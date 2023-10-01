import { Moment } from '../../debug/Moment'
import { GraphSpecComponentAppendMomentData } from '../../debug/graph/watchGraphUnitComponentAppendEvent'
import { GraphSpecComponentRemoveMomentData } from '../../debug/graph/watchGraphUnitComponentRemoveEvent'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Unlisten } from '../../types/Unlisten'
import { $Graph } from '../../types/interface/async/$Graph'
import { callAll } from '../../util/call/callAll'
import { Component } from '../component'
import { componentFromUnitSpec } from '../componentFromUnitSpec'
import { component_ } from '../component_'

export function watchGraphComponent(
  system: System,
  $graph: $Graph,
  component: Component
): Unlisten {
  const unlisten_component = () => {
    // component._disconnect()
  }

  const unlisten_sub_component = (sub_component_id: string) => {
    const sub_component_unlisten = _sub_component_unlisten[sub_component_id]
    sub_component_unlisten()
    delete _sub_component_unlisten[sub_component_id]
  }

  const _sub_component_unlisten: Dict<Unlisten> = {}
  const unlisten_sub_components = () => {
    for (const sub_component_id in _sub_component_unlisten) {
      unlisten_sub_component(sub_component_id)
    }
  }

  const listen_sub_component = (
    unitId: string,
    sub_component: Component
  ): void => {
    const _ = component_(sub_component)
    const sub_component_async_ref = $graph.$refSubComponent({ unitId, _ })
    const sub_component_unlisten = watchGraphComponent(
      system,
      sub_component_async_ref as $Graph,
      sub_component
    )
    _sub_component_unlisten[unitId] = sub_component_unlisten
  }

  if (component.$unbundled) {
    for (const sub_component_id in component.$subComponent) {
      const sub_component = component.getSubComponent(sub_component_id)
      listen_sub_component(sub_component_id, sub_component)
    }
  }

  const unlisten_graph = $graph.$watch(
    { events: ['component_append', 'component_remove'] },
    (moment: Moment) => {
      const { type, event, data } = moment
      const handler = {
        component_append: (data: GraphSpecComponentAppendMomentData) => {
          const { unitId, unitSpec } = data

          const sub_component = componentFromUnitSpec(
            system,
            system.specs,
            unitSpec
          )

          component.setSubComponent(unitId, sub_component)
          component.appendRoot(sub_component)

          listen_sub_component(unitId, sub_component)
        },
        component_remove: (data: GraphSpecComponentRemoveMomentData) => {
          const { unitId } = data

          unlisten_sub_component(unitId)

          const sub_component = component.removeSubComponent(unitId)

          component.removeRoot(sub_component)
        },
      }
      handler[event](data)
    }
  )

  const unlisten = callAll([
    unlisten_component,
    unlisten_graph,
    unlisten_sub_components,
  ])

  return unlisten
}
