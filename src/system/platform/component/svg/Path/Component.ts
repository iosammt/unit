import applyAttr from '../../../../../client/applyAttr'
import { namespaceURI } from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { PropHandler } from '../../../../../client/propHandler'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Style } from '../../../Style'

export interface Props {
  id?: string
  className?: string
  style?: Style
  d?: string
  markerStart?: string
  markerEnd?: string
  fillRule?: string
  attr?: Dict<string>
}

export const DEFAULT_STYLE = {
  strokeWidth: '3px',
  fill: 'none',
  stroke: 'currentColor',
}

export default class SVGPath extends Element<SVGPathElement, Props> {
  private _path_el: SVGPathElement

  private _prop_handler: PropHandler = {
    className: (className: string | undefined) => {
      this._path_el.className.value = className
    },
    style: (style: Style | undefined) => {
      applyStyle(this._path_el, { ...DEFAULT_STYLE, ...style })
    },
    d: (d: string | undefined) => {
      if (d === undefined) {
        this._path_el.removeAttribute('d')
      } else {
        this._path_el.setAttribute('d', d)
      }
    },
    markerStart: (markerStart: string | undefined) => {
      this._path_el.setAttribute('marker-start', markerStart)
    },
    markerEnd: (markerEnd: string | undefined) => {
      this._path_el.setAttribute('marker-end', markerEnd)
    },
    strokeWidth: (strokeWidth: string | undefined) => {
      if (strokeWidth === undefined) {
        this._path_el.removeAttribute('stroke-width')
      } else {
        this._path_el.setAttribute('stroke-width', `${strokeWidth}`)
      }
    },
    fillRule: (fillRule: string | undefined) => {
      if (fillRule === undefined) {
        this._path_el.removeAttribute('fill-rule')
      } else {
        this._path_el.setAttribute('fill-rule', fillRule)
      }
    },
  }

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      id,
      className,
      style = {},
      d = '',
      markerStart,
      markerEnd,
      fillRule,
      attr = {},
    } = $props

    const path_el = this.$system.api.document.createElementNS(
      namespaceURI,
      'path'
    )
    if (id !== undefined) {
      path_el.id = id
    }
    if (className) {
      path_el.classList.value = className
    }
    if (markerStart !== undefined) {
      path_el.setAttribute('marker-start', markerStart)
    }
    if (markerEnd !== undefined) {
      path_el.setAttribute('marker-end', markerEnd)
    }
    if (fillRule !== undefined) {
      path_el.setAttribute('fill-rule', fillRule)
    }

    path_el.setAttribute('d', d)

    applyAttr(path_el, attr)
    applyStyle(path_el, { ...DEFAULT_STYLE, ...style })

    this._path_el = path_el

    this.$element = path_el
    this.$unbundled = false
    this.$primitive = true
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
