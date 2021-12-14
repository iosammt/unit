import { IOElement } from './IOElement'
import { parseTransformXY } from './parseTransformXY'
import { addVector3, NULL_VECTOR, Position } from './util/geometry'

export function getPosition(
  element: IOElement,
  relative: HTMLElement
): Position {
  // AD HOC
  // RETURN
  if (!(element instanceof HTMLElement)) {
    return NULL_VECTOR
  }

  const local_position = getLocalPosition(element)
  const scroll_position = getScrollPosition(element, relative)
  const offset_position = getOffsetPosition(element, relative)

  return addVector3(local_position, scroll_position, offset_position)
}

export function getOffsetPosition(element: HTMLElement, relative: HTMLElement) {
  const { offsetParent } = element

  let x = 0
  let y = 0

  const pushParent = (p: HTMLElement) => {
    const { offsetLeft, offsetTop } = p

    x += offsetLeft
    y += offsetTop
  }

  let p = offsetParent as HTMLElement
  while (p && p !== relative) {
    pushParent(p)
    p = p.offsetParent as HTMLElement
  }

  return { x, y }
}

export function getScrollPosition(
  element: HTMLElement,
  relative: HTMLElement
): Position {
  const { parentElement } = element

  let x = 0
  let y = 0

  const pushScrollParent = (p: HTMLElement) => {
    const { scrollLeft, scrollTop } = p

    x += scrollTop
    y += scrollLeft
  }

  let p = parentElement
  while (p && p !== relative) {
    pushScrollParent(p)
    p = p.parentElement
  }

  return { x, y }
}

export function getLocalPosition(element: HTMLElement): Position {
  const { offsetLeft, offsetTop, offsetWidth, offsetHeight, style } = element

  let offset_x = offsetLeft
  let offset_y = offsetTop

  let width
  let height

  let transform_x
  let transform_y

  let scale_x
  let scale_y

  const { transform } = style

  if (width !== offsetWidth || height !== offsetHeight) {
    if (transform) {
      const [_transform_x, _transform_y, _scale_x, _scale_y] = parseTransformXY(
        transform,
        offsetWidth,
        offsetHeight
      )
      transform_x = _transform_x
      transform_y = _transform_y
      scale_x = _scale_x
      scale_y = _scale_y
    } else {
      transform_x = 0
      transform_y = 0
      scale_x = 1
      scale_y = 1
    }
  }

  width = offsetWidth
  height = offsetHeight

  // TODO there's more to it
  const x = offsetLeft + transform_x
  const y = offsetTop + transform_y

  return { x, y }
}
