import { Unit } from '../Class/Unit'
import { DEFAULT_EVENTS } from '../constant/DEFAULT_EVENTS'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { Moment } from './Moment'
import { watchGraph } from './watchGraph'
import { watchTree } from './watchTree'
import { watchUnit } from './watchUnit'

export const watchUnitAndLog = (
  unit: U,
  events: string[] = DEFAULT_EVENTS
): (() => void) =>
  watchUnit(
    unit,
    (moment) => {
      const { data } = moment
      if (data.data instanceof Unit) {
        data.data = data.data.constructor.name
      }
      console.log(moment)
    },
    events
  )

export const watchGraphAndLog = (
  graph: G<any, any>,
  events: string[] = DEFAULT_EVENTS
): (() => void) => {
  return watchGraph(
    graph,
    (moment) => {
      const { type, event, data } = moment
      if (data.data instanceof Unit) {
        data.data = data.data.constructor.name
      }
      const { unitId, pinId, data: _data, err } = data
      // console.log(moment)
      console.log(
        type,
        event,
        unitId,
        pinId,
        _data !== undefined ? JSON.stringify(_data) : '',
        err || ''
      )
    },
    events
  )
}

export const watchTreeAndLog = (
  unit: U,
  events: string[] = DEFAULT_EVENTS
): (() => void) => {
  return watchTree(unit, events, (path: string[], moment: Moment) => {
    const { type, event, data } = moment
    const { pinId, err, data: _data } = data
    const t = path.map(() => '- ').join('')
    console.log(
      `${t}${path[path.length - 1] || ''} ${type} ${pinId} ${event} ${
        _data !== undefined ? JSON.stringify(_data) : ''
      } ${err !== undefined ? JSON.stringify(err) : ''}`
    )
  })
}
