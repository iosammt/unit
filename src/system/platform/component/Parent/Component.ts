import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { System } from '../../../../system'

export interface Props {}

const DEFAULT_STYLE = {}

export default class Parent extends Element<HTMLDivElement, Props> {
  constructor($props: Props, $system: System) {
    super($props, $system)

    const {} = this.$props

    const $element = parentElement($system)

    this.$element = $element
  }

  focus() {
    this.$parentChildren[0] && this.$parentChildren[0].focus()
  }
}
