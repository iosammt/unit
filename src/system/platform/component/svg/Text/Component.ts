import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import applyStyle from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  value?: string
  x?: string
  y?: string
  dx?: string
  dy?: string
  textAnchor?: string
}

export const DEFAULT_STYLE = {
  fill: 'currentColor',
}

export default class SVGText extends Element<SVGTextElement, Props> {
  private _text_el: SVGTextElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      style = {},
      className,
      value,
      x,
      y,
      dx,
      dy,
      textAnchor = 'start',
    } = this.$props

    const text_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'text'
    )

    applyStyle(text_el, { ...DEFAULT_STYLE, ...style })

    if (className) {
      text_el.classList.add(className)
    }
    if (value !== undefined) {
      text_el.textContent = value
    }
    if (x !== undefined) {
      text_el.setAttribute('x', `${x}`)
    }
    if (y !== undefined) {
      text_el.setAttribute('y', `${y}`)
    }
    if (dx !== undefined) {
      text_el.setAttribute('dx', `${dx}`)
    }
    if (dy !== undefined) {
      text_el.setAttribute('dy', `${dy}`)
    }
    if (textAnchor !== undefined) {
      text_el.setAttribute('text-anchor', textAnchor)
    }
    this._text_el = text_el

    this.$element = text_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'style') {
      applyStyle(this._text_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'value') {
      this._text_el.textContent = current
    } else if (prop === 'dy') {
      this._text_el.setAttribute('dy', `${current ?? ''}`)
    } else if (prop === 'dx') {
      this._text_el.setAttribute('dx', `${current ?? ''}`)
    } else if (prop === 'x') {
      this._text_el.setAttribute('x', `${current ?? ''}`)
    } else if (prop === 'y') {
      this._text_el.setAttribute('y', `${current ?? ''}`)
    } else if (prop === 'textAnchor') {
      this._text_el.setAttribute('text-anchor', current)
    }
  }
}
