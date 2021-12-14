import { Component } from '../../../../client/component'
import parentElement from '../../../../client/parentElement'
import { Dict } from '../../../../types/Dict'
import Div from '../../component/Div/Component'

export interface Props {
  style?: Dict<string>
}

export const DEFAULT_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  overflowY: 'auto',
  paddingTop: '3px',
  paddingBottom: '3px',
}

export default class MailService extends Component<HTMLDivElement, Props> {
  private _root: Div

  constructor($props: Props) {
    super($props)

    const { style } = $props

    const div = new Div({
      style: {
        ...DEFAULT_STYLE,
        ...style,
      },
    })
    this._root = div

    const $element = parentElement()

    this.$element = $element
    this.$slot = div.$slot
    this.$unbundled = false

    this.registerRoot(div)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      this._root.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  onMount(): void {}
}
