import { $Component } from '../async/$Component'
import { Async } from '../async/Async'
import { Callback } from '../Callback'
import { Component } from '../client/component'
import { C } from '../interface/C'
import { C_U } from '../interface/C_U'
import { _proxy } from '../proxyWrap'
import { UnitClass } from '../types/UnitClass'
import { Unlisten } from '../Unlisten'
import { $Child } from './Child'
import { $Children } from './Children'

export function $appendChild(
  component: C,
  Class: UnitClass<C_U>,
  callback: Callback<number>
): void {
  const i = component.appendChild(Class)
  callback(i)
}

export function $removeChild(
  component: C,
  { at }: { at: number },
  callback: Callback<{ specId: string }>
): void {
  try {
    const Class = component.removeChild(at)
    // @ts-ignore
    const specId = Class.constructor.id
    callback({ specId })
  } catch (err) {
    callback(undefined, err.message)
  }
}

export function $hasChild(
  component: C,
  { at }: { at: number },
  callback: Callback<boolean>
): void {
  const has = component.hasChild(at)
  callback(has)
}

export function $child(
  component: C,
  { at }: { at: number },
  callback: Callback<$Child>
): void {
  const child = component.child(at)
  // @ts-ignore
  const id = child.constructor.id
  callback(id)
}

export function $children(
  component: C,
  {},
  callback: Callback<$Children>
): void {
  const children = component.children()

  const _children = children.map((c) => {
    // @ts-ignore
    return { id: c.constructor.id } as $Child
  })

  callback(_children)
}

export function $refChild(
  component: C,
  { at, _ }: { at: number; _: string[] }
): $Component {
  const child = component.child(at)
  const local_child = Async(child, _)
  return _proxy(local_child, _)
}

export function $component(
  component: C,
  data: {},
  callback: Callback<Component>
): Unlisten {
  return component.component(callback)
}
