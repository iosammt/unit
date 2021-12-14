import ResizeObserver from 'resize-observer-polyfill'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { pull } from '../util/array'
import { Component } from './component'
import fullwindowElement from './createFullwindow'
import Listenable from './Listenable'
import { PositionObserver } from './PositionObserver'
import { stopByPropagation } from './stopPropagation'

export interface FullwindowOpt {
  showExitButton?: boolean
  backgroundOpacity?: number
  svg?: boolean
}

export interface Fullwindow {
  component: Component
  container: HTMLDivElement
}

export interface Context extends Listenable {
  $system: System | null
  $mounted: boolean
  $listenCount: Dict<number>
  $disabled: boolean
  $parent: Component | null
  $parent_unlisten: Unlisten | null
  $element: HTMLElement
  $context: Context
  $x: number
  $y: number
  $sx: number
  $sy: number
  $rx: number
  $ry: number
  $rz: number
  $width: number
  $height: number
  $theme: 'dark' | 'light'
  $color: string
  $fullwindow: Fullwindow[]
  $fullwindow_i: number
  $resizeObserver: ResizeObserver
  $positionObserver: PositionObserver
}

export interface Ref extends Dict<any[]> {}

// TODO
// move
function getChildIndex(child: ChildNode): number {
  let i = 0
  // @ts-ignore
  for (i = 0; (child = child.previousSibling); i++) {}
  return i
}

// TODO
// move
export function _replaceChild($element: Element, $nextElement: Element) {
  const parent = $element.parentElement
  if (parent) {
    const index = getChildIndex($element)
    parent.insertBefore($nextElement, parent.children[index])
    parent.removeChild($element)
  }
}

export function dispatchContextEvent(
  $context: Context,
  type: string,
  data: any = {}
): void {
  const { $element } = $context
  dispatchCustomEvent($element, type, data, false)
}

export function dispatchCustomEvent(
  $element: Element,
  type: string,
  detail: any = {},
  bubbles: boolean = true
) {
  $element.dispatchEvent(new CustomEvent(`_${type}`, { detail, bubbles }))
}

export function setParent($context: Context, $parent: Component | null): void {
  $context.$parent = $parent
  const { $fullwindow } = $context
  for (const fullwindow of $fullwindow) {
    const { component } = fullwindow
    component.$parent = $parent
  }
}

export function mount($context: Context): void {
  // console.log('mount')
  $context.$mounted = true

  const { $element, $positionObserver, $resizeObserver } = $context

  const { width, height } = $element.getBoundingClientRect()
  $context.$width = width
  $context.$height = height

  const { x, y, sx, sy } = $positionObserver.observe($element)
  $context.$x = x
  $context.$y = y
  $context.$sx = sx
  $context.$sy = sy

  $resizeObserver.observe($element)

  for (const { component } of $context.$fullwindow) {
    component.mount($context)
  }
}

export function unmount($context: Context): void {
  // console.log('unmount')
  $context.$mounted = false

  $context.$system = null

  const { $positionObserver, $resizeObserver } = $context

  $positionObserver.disconnect()

  $resizeObserver.disconnect()

  for (const { component } of $context.$fullwindow) {
    component.unmount()
  }
}

export function attach($context: Context, $system: System): void {
  $context.$system = $system

  $system.context.push($context)

  const { $element } = $context
  for (const type of $system.customEvent) {
    const _type = `_${type}`
    stopByPropagation($element, _type)
  }

  for (const { component } of $context.$fullwindow) {
    component.attach($system)
  }
}

export function dettach($context: Context, $system: System): void {
  $context.$system = null

  pull($system.context, $context)

  for (const { component } of $context.$fullwindow) {
    component.dettach()
  }
}

export function resize($context: Context, width: number, height: number): void {
  // console.log('resize', width, height)
  $context.$width = width
  $context.$height = height
  dispatchContextEvent($context, 'resize', { width, height })
}

export function setWidth($context: Context, width: number): void {
  // console.log('setWidth', width)
  const { $height } = $context
  resize($context, width, $height)
}

export function setHeight($context: Context, height: number): void {
  // console.log('setHeight', height)
  const { $width } = $context
  resize($context, $width, height)
}

export function setTheme($context: Context, $theme: 'light' | 'dark'): void {
  if ($context.$theme === $theme) {
    return
  }
  $context.$theme = $theme
  dispatchContextEvent($context, 'themechanged', {})
}

export function _setColor($context: Context, $color: string): void {
  if ($context.$color === $color) {
    return
  }
  $context.$color = $color
  $context.$element.style.color = $color
}

export function setColor($context: Context, $color: string): void {
  _setColor($context, $color)
  dispatchContextEvent($context, 'colorchanged', {})
}

export function enterFullwindow(
  $$context: Context,
  component: Component,
  { animate }: { animate?: boolean } = { animate: false }
): Unlisten {
  const { $element: $$element, $fullwindow, $system } = $$context

  const { $element } = component

  if (component.$mounted) {
    component.unmount()
  }

  const container = fullwindowElement()

  container.appendChild($element)
  $$element.appendChild(container)

  // the component share $parent
  component.$parent = $$context.$parent

  if ($$context.$mounted) {
    component.mount($$context)
  }

  const fullwindow: Fullwindow = {
    component,
    container,
  }
  $fullwindow.push(fullwindow)

  $$context.$fullwindow_i++

  return () => {
    _removeFullwindow($$context, fullwindow, $$context.$fullwindow_i)
  }
}

export function enableContext($context: Context): void {
  // console.log('enableContext')
  $context.$disabled = false
  dispatchContextEvent($context, 'enabled', {})
}

export function disableContext($context: Context): void {
  // console.log('disableContext')
  $context.$disabled = true
  dispatchContextEvent($context, 'disabled', {})
}

export function focusContext($context: Context): void {
  // console.log('focusContext')
  const { $fullwindow, $fullwindow_i } = $context
  if ($fullwindow_i > -1) {
    const fullwindow = $fullwindow[$fullwindow_i]
    const { component } = fullwindow
    component.focus()
  }
}

export function blurContext($context: Context): void {
  $context.$element.blur()
}

function _removeFullwindow(
  $$context: Context,
  fullwindow: Fullwindow,
  i: number
): Component {
  // console.log('_removeFullwindow')
  const { $element: $$element } = $$context
  const { component, container } = fullwindow
  const { $element } = component
  $$context.$fullwindow.splice(i, 1)
  $$context.$fullwindow_i--
  component.unmount()
  container.removeChild($element)
  $$element.removeChild(container)
  return component
}
