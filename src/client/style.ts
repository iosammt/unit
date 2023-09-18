import { NOOP } from '../NOOP'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { callAll } from '../util/call/callAll'
import { addListener } from './addListener'
import { Component } from './component'
import { makeCustomListener } from './event/custom'
import { makeResizeListener } from './event/resize'

export const isVValue = (value: string) => {
  return value.endsWith('vh') || value.endsWith('vw')
}

export function reactToFrameSize(
  value: string,
  component: Component<HTMLElement | SVGElement>,
  setValue: (value: number) => void
): Unlisten {
  let unlistenComponent = NOOP
  let unlistenContext = NOOP

  const vh = value.endsWith('vh')
  const vw = value.endsWith('vw')

  if (vw || vh) {
    const percent = parseFloat(value.replace('vh', '').replace('vw', '')) / 100

    const resize = ({ width, height }) => {
      setValue(vw ? width * percent : height * percent)
    }

    const resizeListener = makeResizeListener(resize)

    const immediateResize = () => {
      const { $width: width, $height: height } = component.$context

      resize({ width, height })
    }

    const addContextListener = () => {
      const { $context } = component

      unlistenContext = addListener($context, resizeListener)
    }

    const removeContextListener = () => {
      unlistenContext()

      unlistenContext = NOOP
    }

    if (component.$mounted) {
      addContextListener()

      immediateResize()
    }

    unlistenComponent = component.addEventListeners([
      makeCustomListener('mount', () => {
        immediateResize()

        addContextListener()
      }),
      makeCustomListener('unmount', removeContextListener),
    ])

    return callAll([removeContextListener, unlistenComponent])
  }

  return NOOP
}

export function applyDynamicStyle(
  component: Component<HTMLElement | SVGElement>,
  $element: HTMLElement | SVGElement,
  style: Dict<string>
): Unlisten {
  removeStyle($element)

  let { fontSize, width, height } = style

  let unlistenResize = NOOP

  let styleUnlisten = component.$propUnlisten['style']

  if (styleUnlisten) {
    styleUnlisten()

    delete component.$propUnlisten['style']
  }

  const unlistenAll = []

  if (typeof fontSize === 'number') {
    fontSize = `${fontSize}px`
  }

  if (fontSize && isVValue(fontSize)) {
    delete style.fontSize

    unlistenAll.push(
      reactToFrameSize(fontSize, component, (value) => {
        $element.style.fontSize = value + 'px'
      })
    )
  }

  if (width && isVValue(width)) {
    delete style.width

    unlistenAll.push(
      reactToFrameSize(width, component, (value) => {
        $element.style.width = value + 'px'
      })
    )
  }

  if (height && isVValue(height)) {
    delete style.height

    unlistenAll.push(
      reactToFrameSize(height, component, (value) => {
        $element.style.height = value + 'px'
      })
    )
  }

  mergeStyle($element, style)

  styleUnlisten = callAll(unlistenAll)

  component.$propUnlisten['style'] = styleUnlisten

  return styleUnlisten
}

export function removeStyle(element: HTMLElement | SVGElement) {
  const _style = element.style

  while (_style[0]) {
    _style.removeProperty(_style[0])
  }
}

export default function applyStyle(
  element: HTMLElement | SVGElement,
  style: Dict<string>
) {
  removeStyle(element)
  mergeStyle(element, style)
}

export function mergeStyle(
  element: HTMLElement | SVGElement,
  style: Dict<string>
) {
  const _style = element.style

  for (const key in style) {
    const value = style[key]

    _style[key] = value
  }
}
