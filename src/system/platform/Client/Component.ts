import { Element } from '../../../client/element'
import parentElement from '../../../client/platform/web/parentElement'
import { System } from '../../../system'
import { UnitBundleSpec } from '../../../types/UnitBundleSpec'

export interface Props {
  graph: UnitBundleSpec
}

export const DEFAULT_STYLE = {
  cursor: 'pointer',
  color: 'currentColor',
  'touch-action': 'none',
}

export default class Client extends Element<HTMLDivElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system)

    const {} = this.$props

    const $element = parentElement($system)

    this.$element = $element

    this.setSubComponents({})
  }

  onPropChanged(prop: string, current: any) {
    // console.log('Client', 'onPropChanged', prop, current)

    if (prop === 'graph') {
      // RETURN
    }
  }
}
