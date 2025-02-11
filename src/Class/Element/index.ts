import { Component } from '../../client/component'
import { isComponentEvent } from '../../client/isComponentEvent'
import {
  animate,
  appendChild,
  appendChildren,
  appendParentChild,
  cancelAnimation,
  hasChild,
  pullChild,
  pushChild,
  refChild,
  refChildren,
  refRoot,
  registerParentRoot,
  registerRoot,
  removeChild,
  removeParentChild,
  reorderParentRoot,
  reorderRoot,
  stopPropagation,
  unregisterParentRoot,
  unregisterRoot,
} from '../../component/method'
import { MethodNotImplementedError } from '../../exception/MethodNotImplementedError'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { AnimationSpec, C_EE, ComponentSetup } from '../../types/interface/C'
import { Component_, ComponentEvents } from '../../types/interface/Component'
import { E } from '../../types/interface/composed/E'
import { UnitBundle } from '../../types/UnitBundle'
import { Unlisten } from '../../types/Unlisten'
import { forEach } from '../../util/array'
import { Stateful, StatefulEvents } from '../Stateful'
import { ION, Opt } from '../Unit'

export type Element_EE = C_EE

export type ElementEE<_EE extends Dict<any[]>> = StatefulEvents<
  _EE & Element_EE
> &
  Element_EE

export class Element_<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    _J extends Dict<any> = {},
    _EE extends ElementEE<_EE> = ElementEE<Element_EE>,
    _C extends Component = Component,
  >
  extends Stateful<I, O, {}, _EE>
  implements E
{
  __ = ['U', 'C', 'J', 'V', 'EE']

  public _children: Component_[] = []
  public _root: Component_[] = []
  public _parent_root: Component_[] = []
  public _parent_children: Component_[] = []
  public _slot: Dict<Component_> = {}
  public _component: _C
  public _animations: AnimationSpec[] = []
  public _stopPropagation: Dict<number> = {}
  public _stopImmediatePropagation: Dict<number> = {}
  public _preventDefault: Dict<number> = {}

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      id
    )

    this.addListener('reset', this._reset)
    this.addListener('play', this._play)
    this.addListener('pause', this._pause)
    this.addListener('set', (name: keyof I, data) => {
      const {
        api: {
          window: { nextTick },
        },
      } = this.__system

      if (!this._forwarding) {
        if (data === undefined) {
          this._forwarding_empty = true
          // @ts-ignore
          this._output?.[name]?.pull()
          this._forwarding_empty = false
        } else {
          this._forwarding = true
          // @ts-ignore
          this._output?.[name]?.push(data)
          this._forwarding = false
        }
      }

      if (
        !this._set_from_input &&
        !this._backwarding &&
        !this._forwarding &&
        data !== undefined
      ) {
        this._backwarding = true

        nextTick(() => {
          this._input?.[name]?.pull()

          this._backwarding = false
        })
      }
    })

    this._slot = {
      default: this,
    }
  }

  isElement(): boolean {
    return true
  }

  registerRoot(component: Component_): void {
    return registerRoot(this, this._root, component, true)
  }

  unregisterRoot(component: Component_): void {
    return unregisterRoot(this, this._root, component, true)
  }

  reorderRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderRoot(this, this._root, component, to, true)
  }

  registerParentRoot(
    component: Component_,
    slotName: string,
    at?: number,
    emit?: boolean
  ): void {
    return registerParentRoot(
      this,
      this._parent_root,
      component,
      slotName,
      at,
      emit
    )
  }

  unregisterParentRoot(component: Component_): void {
    return unregisterParentRoot(this, this._parent_root, component, true)
  }

  reorderParentRoot(component: Component_<ComponentEvents>, to: number): void {
    return reorderParentRoot(this, this._parent_root, component, to, true)
  }

  appendParentChild(component: Component_, slotName: string): void {
    return appendParentChild(
      this,
      this._parent_children,
      component,
      slotName,
      true
    )
  }

  removeParentChild(component: Component_): void {
    return removeParentChild(this, this._parent_children, component, true)
  }

  appendChild(bundle: UnitBundle): number {
    return appendChild(this, this._children, bundle)
  }

  appendChildren(bundles: UnitBundle[]): number {
    return appendChildren(this, this._children, bundles)
  }

  insertChild(Bundle: UnitBundle, at: number): void {
    throw new MethodNotImplementedError()
  }

  pushChild(Bundle: UnitBundle): number {
    return pushChild(this, this._children, Bundle)[0]
  }

  hasChild(at: number): boolean {
    return hasChild(this, this._children, at)
  }

  removeChild(at: number): Component_ {
    return removeChild(this, this._children, at)
  }

  pullChild(at: number): Component_ {
    throw pullChild(this, this._children, at)
  }

  refRoot(at: number): Component_ {
    return refRoot(this, this._children, at)
  }

  refChild(at: number): Component_ {
    return refChild(this, this._children, at)
  }

  refChildren(): Component_[] {
    return refChildren(this, this._children)
  }

  refSlot(slotName: string): Component_ {
    const slot = this._slot[slotName]

    if (slot) {
      return slot
    }

    throw new MethodNotImplementedError()
  }

  getAnimations(): AnimationSpec[] {
    return this._animations
  }

  animate(keyframes: Keyframe[], opt: KeyframeAnimationOptions): void {
    return animate(this, this._animations, keyframes, opt)
  }

  cancelAnimation(id: string): void {
    return cancelAnimation(this, this._animations, id)
  }

  stopPropagation(name: string): Unlisten {
    return stopPropagation(this, this._stopPropagation, name)
  }

  getSetup(): ComponentSetup {
    const setup: ComponentSetup = {
      animations: this._animations,
      events: this.eventNames().filter(isComponentEvent),
      stopPropagation: Object.keys(this._stopPropagation),
      stopImmediatePropagation: Object.keys(this._stopImmediatePropagation),
      preventDefault: Object.keys(this._preventDefault),
    }

    return setup
  }

  private _reset(): void {
    forEach(this._children, (u) => u.reset())

    this.emit('call', { method: 'reset', data: [] })
  }

  private _play(): void {
    forEach(this._children, (u) => u.play())
  }

  private _pause(): void {
    forEach(this._children, (u) => u.pause())
  }
}
