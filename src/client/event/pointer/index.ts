import { _addEventListener } from '..'
import { Unlisten } from '../../../Unlisten'
import { Context } from '../../context'
import Listenable from '../../Listenable'

export const POINTER_EVENT_NAMES = [
  'pointerdown',
  'pointermove',
  'pointerup',
  'pointerenter',
  'pointerleave',
  'pointercancel',
  'pointerover',
  'pointerout',
]

export interface IOPointerEvent {
  clientX: number
  clientY: number
  offsetX: number
  offsetY: number
  screenX: number
  screenY: number
  pointerId: number
  pointerType: string
}

export function _IOPointerEvent(
  $context: Context,
  _event: PointerEvent
): IOPointerEvent {
  const { $x, $y, $sx, $sy } = $context

  const {
    pointerId,
    pointerType,
    clientX,
    clientY,
    offsetX,
    offsetY,
    screenX,
    screenY,
    target,
  } = _event

  return {
    clientX: (clientX - $x) / $sx,
    clientY: (clientY - $y) / $sy,
    offsetX,
    offsetY,
    screenX: clientX,
    screenY: clientY,
    // screenX,
    // screenY,
    pointerId,
    pointerType,
  }
}

export function listenPointerEvent(
  type: string,
  component: Listenable,
  listener: (event: IOPointerEvent, _event: PointerEvent) => void,
  _global: boolean = false
): Unlisten {
  const { $element } = component
  const pointerEventListener = (_event: PointerEvent) => {
    // log(type)
    const { $context } = component
    const event = _IOPointerEvent($context, _event)
    listener(event, _event)
  }

  const unlisten = _addEventListener(
    type,
    $element,
    pointerEventListener,
    _global
  )

  const { $listenCount } = component
  $listenCount[type] = $listenCount[type] || 0
  $listenCount[type]++
  return () => {
    $listenCount[type]--
    if ($listenCount[type] === 0) {
      delete $listenCount[type]
    }
    unlisten()
  }
}
