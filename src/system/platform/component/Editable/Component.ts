import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { Dict } from '../../../../types/Dict'
import { basePropHandler } from '../propHandler'

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
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Editable extends Element<HTMLDivElement, Props> {
  private _div_el: HTMLDivElement

  private _prop_handler

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

    const $element = document.createElement('div')

    $element.contentEditable = 'true'

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

    this._prop_handler = {
      ...basePropHandler(this._div_el, DEFAULT_STYLE),
    }

    this._div_el = $element

    this.$element = $element
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
