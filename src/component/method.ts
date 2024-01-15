import { ChildOutOfBound } from '../exception/ChildOutOfBoundError'
import { evaluate } from '../spec/evaluate'
import { Dict } from '../types/Dict'
import { AnimationSpec } from '../types/interface/C'
import { Component_ } from '../types/interface/Component'
import { UnitBundle } from '../types/UnitBundle'
import { insert } from '../util/array'

export function appendChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>
): number {
  const i = pushChild(component, children, Class)

  const { __bundle: bundle } = Class

  component.emit('append_child', bundle, [])

  return i
}

export function instanceChild(
  component,
  Class: UnitBundle<Component_>
): Component_ {
  const system = component.refSystem()

  const unit = new Class(system)

  const {
    input = {},
    output = {},
    memory = { input: {}, output: {}, memory: {} },
  } = Class.__bundle.unit

  for (const name in input) {
    const { data } = input[name]

    if (data !== undefined) {
      const _data = evaluate(data, system.specs, system.classes)

      unit.pushInput(name, _data)
    }
  }

  // unit.restore(memory)

  if (component.paused() && !unit.paused()) {
    unit.pause()
  } else if (!component.paused() && unit.paused()) {
    unit.play()
  }

  return unit
}

export function pushChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>
): number {
  const unit = instanceChild(component, Class)

  children.push(unit)

  const i = children.length - 1

  return i
}

export function insertChild(
  component: Component_,
  children: Component_[],
  Class: UnitBundle<Component_>,
  at: number
): void {
  const unit = instanceChild(component, Class)

  insert(children, unit, at)

  const { __bundle: bundle } = Class

  component.emit('insert_child', bundle, at, [])
}

export function hasChild(
  element: Component_,
  children: Component_[],
  at: number
): boolean {
  const has = at >= 0 && at < children.length
  return has
}

export function pullChild(
  element: Component_,
  children: Component_[],
  at: number
): Component_ {
  const has = hasChild(element, children, at)

  if (!has) {
    throw new ChildOutOfBound()
  }

  const [unit] = children.splice(at, 1)

  return unit
}

export function removeChild(
  element: Component_,
  children: Component_[],
  at: number
): Component_ {
  const child = pullChild(element, children, at)

  element.emit('remove_child', at, [])
  element.emit(`remove_child_at_${at}`, at)

  return child
}

export function refChild(
  element: Component_,
  children: Component_[],
  at: number
): Component_ {
  return children[at]
}

export function refChildren(
  element: Component_,
  children: Component_[]
): Component_[] {
  return children
}

export function refSlot(
  element: Component_,
  slotName: string,
  slot: Dict<Component_>
): Component_ {
  return slot[slotName] || element
}

export function registerParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  slotName: string,
  at?: number
): void {
  if (at === undefined) {
    parentRoot.push(child)
  } else {
    insert(parentRoot, child, at)
  }

  component.emit('register_parent_root', child, slotName)

  const slot = component.refSlot(slotName)

  slot.appendParentChild(component, 'default')
}

export function unregisterParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  component.emit('unregister_parent_root', component)
}

export function reorderRoot(
  component: Component_,
  root: Component_[],
  child: Component_,
  to: number
): void {
  const currentIndex = root.indexOf(child)

  if (currentIndex === -1) {
    throw new Error('root not found')
  }

  root.splice(currentIndex, 1)

  insert(root, child, to)

  component.emit('reorder_root', component, to)
}

export function reorderParentRoot(
  component: Component_,
  parentRoot: Component_[],
  child: Component_,
  to: number
): void {
  const currentIndex = parentRoot.indexOf(child)

  if (currentIndex === -1) {
    throw new Error('root not found')
  }

  parentRoot.splice(currentIndex, 1)

  insert(parentRoot, child, to)

  component.emit('reorder_parent_root', component, to)
}

export function unregisterRoot(
  component: Component_,
  root: Component_[],
  child: Component_
): void {
  const at = root.indexOf(child)

  root.splice(at, 1)

  component.emit('unregister_root', component)
}

export function registerRoot(
  component: Component_,
  root: Component_[],
  child: Component_
): void {
  root.push(child)

  component.emit('register_root', component)
}

export function appendParentChild(
  component: Component_,
  parentChild: Component_[],
  child: Component_,
  slotName: string
): void {
  const slot = component.refSlot(slotName)

  if (component === slot) {
    parentChild.push(child)

    component.emit('append_parent_child', component, slotName)
  } else {
    slot.appendParentChild(child, 'default')
  }
}

export function removeParentChild(
  component: Component_,
  parentRoot: Component_[],
  child: Component_
): void {
  const at = parentRoot.indexOf(child)

  parentRoot.splice(at, 1)

  component.emit('remove_parent_child', component)
}

export function animate(
  component: Component_,
  animations: AnimationSpec[],
  keyframes: Keyframe[],
  opt: KeyframeAnimationOptions
) {
  animations.push({ keyframes, opt })

  component.emit('call', {
    method: 'animate',
    data: [keyframes, opt],
  })
}

export function cancelAnimation(
  component: Component_,
  animations: AnimationSpec[],
  id: string
) {
  const i = animations.findIndex((animation) => {
    return animation.opt.id === id
  })

  animations.splice(i, 1)

  component.emit('call', {
    method: 'cancelAnimation',
    data: [id],
  })
}
