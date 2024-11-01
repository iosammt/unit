import { Field } from '../../../../../client/field'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
}

export default class FileField extends Field<HTMLInputElement, Props> {
  constructor($props: Props, $system: System) {
    const DEFAULT_STYLE = $system.style['filefield']

    super($props, $system, $system.api.document.createElement('input'), {
      valueKey: 'value',
      defaultStyle: DEFAULT_STYLE,
      defaultValue: '',
    })

    this.$element.type = 'file'
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this.$element.setSelectionRange(start, end, direction)
  }
}
