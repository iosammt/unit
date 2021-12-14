import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { Dict } from '../../../../types/Dict'
import { basePropHandler, PropHandler } from '../propHandler'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  innerText?: string
  tabIndex?: number
  title?: string
  draggable?: boolean
  data?: Dict<string>
}

const DEFAULT_STYLE = {
  color: 'currentColor',
}

export default class Span extends Element<HTMLSpanElement, Props> {
  private _span_el: HTMLSpanElement

  private _prop_handler: PropHandler

  constructor($props: Props) {
    super($props)

    const {
      id,
      className,
      style,
      innerText,
      tabIndex,
      title,
      draggable,
      data = {},
    } = this.$props

    const $element = document.createElement('span')

    if (id !== undefined) {
      $element.id = id
    }
    if (className !== undefined) {
      $element.className = className
    }
    applyStyle($element, { ...DEFAULT_STYLE, ...style })
    if (innerText) {
      $element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }
    if (title) {
      $element.title = title
    }
    if (draggable !== undefined) {
      $element.setAttribute('draggable', draggable.toString())
    }
    if (data !== undefined) {
      for (const key in data) {
        const d = data[key]
        $element.dataset[key] = d
      }
    }

    this._span_el = $element

    this._prop_handler = {
      ...basePropHandler(this._span_el, DEFAULT_STYLE),
    }

    this.$element = $element
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
