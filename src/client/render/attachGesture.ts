import { getStroke } from 'perfect-freehand'
import { System } from '../../system'
import { Unlisten } from '../../types/Unlisten'
import { namespaceURI } from '../component/namespaceURI'
import { _addEventListener } from '../event'
import { UnitPointerEvent } from '../event/pointer'
import { Point } from '../util/geometry/types'

function getSvgPathFromStroke(stroke): string {
  if (!stroke.length) {
    return ''
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2)
      return acc
    },
    ['M', ...stroke[0], 'Q']
  )

  d.push('Z')

  return d.join(' ')
}

const STROKE_OPT = {
  size: 3,
  smoothing: 0.99,
  thinning: 0.5,
  streamline: 0.25,
  easing: (t) => t,
  start: {
    taper: 0,
    cap: true,
  },
  end: {
    taper: 0,
    cap: true,
  },
}

export function attachGesture(system: System): void {
  // console.log('attachGesture')

  const {
    root,
    foreground: { svg },
    api: {
      document: { createElementNS },
    },
  } = system

  const captureGesture = (
    event: UnitPointerEvent,
    opt: {
      lineWidth?: number
      strokeStyle?: string
    } = {},
    callback: (event: PointerEvent, track: Point[]) => void
  ): Unlisten => {
    const { pointerId, screenX, screenY, pageX, pageY } = event

    // svg.setPointerCapture(pointerId)

    const path = createElementNS(namespaceURI, 'path')

    svg.appendChild(path)

    const { lineWidth = 2, strokeStyle = '#d1d1d1' } = opt

    const color = strokeStyle

    path.style.stroke = color
    path.style.strokeWidth = `${lineWidth}px`
    path.style.fill = color

    let active = true

    const track: Point[] = [{ x: pageX, y: pageY }]

    const pointerMoveListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerMoveListener')

      const { pointerId: _pointerId } = _event

      if (_pointerId === pointerId) {
        const { pageX, pageY } = _event

        const outline = getStroke(track, STROKE_OPT)

        const d = getSvgPathFromStroke(outline)

        path.setAttribute('d', d)

        track.push({ x: pageX, y: pageY })
      }
    }

    const pointerUpListener = (_event: PointerEvent) => {
      // console.log('attachGesture', 'pointerUpListener')

      const { pointerId: _pointerId } = _event

      if (_pointerId === pointerId) {
        unlisten()

        callback(_event, track)
      }
    }

    const unlisten = () => {
      if (active) {
        active = false

        unlistenPointerMove()
        unlistenPointerUp()

        svg.removeChild(path)
      }
    }

    const unlistenPointerMove = _addEventListener(
      'pointermove',
      root.shadowRoot,
      pointerMoveListener,
      true
    )
    const unlistenPointerUp = _addEventListener(
      'pointerup',
      root.shadowRoot,
      pointerUpListener,
      true
    )

    return unlisten
  }

  system.captureGesture = captureGesture
}
