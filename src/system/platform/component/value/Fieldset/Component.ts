import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
}

export default class Fieldset extends Field<HTMLFieldSetElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['fieldset']

    super($props, $system, $system.api.document.createElement('fieldset'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })
  }
}
