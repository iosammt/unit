import { EventEmitter_ } from './EventEmitter'
import { ObjectUpdateType } from './ObjectUpdateType'
import { keys } from './system/f/object/Keys/f'
import { Dict } from './types/Dict'
import { J } from './types/interface/J'
import { V } from './types/interface/V'
import { Unlisten } from './types/Unlisten'
import { last, pop } from './util/array'

export type ObjectNode = {
  emitter: EventEmitter_ | null
  children: Dict<ObjectNode>
}

export class Object_<T extends Object> implements J<T>, V<T> {
  private _obj: T
  private _node: ObjectNode = {
    emitter: new EventEmitter_(),
    children: {},
  }

  constructor(obj: T) {
    this._obj = obj
  }

  public dispatch = (
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ) => {
    return this._dispatch(type, path, key, value)
  }

  private _obj_at_path(path: string[]): Dict<any> {
    let _obj: any = this._obj
    for (const p of path) {
      _obj = _obj[p]
    }
    return _obj
  }

  private _dispatch = (
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ) => {
    this._rec_dispatch(path, this._node, type, path, key, value)
  }

  _rec_dispatch = (
    current: string[],
    node: ObjectNode,
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ): void => {
    if (current.length === 0) {
      this._end_dispatch(node, type, path, key, value)
    } else {
      const [p, ...next] = current
      const key_node = node.children[p]
      if (key_node) {
        this._rec_dispatch(next, key_node, type, path, key, value)
      }
      const all_node = node.children['*']
      if (all_node) {
        this._rec_dispatch(next, all_node, type, path, key, value)
      }
    }
  }

  _end_dispatch = (
    node: ObjectNode,
    type: ObjectUpdateType,
    path: string[],
    key: string,
    value: any
  ) => {
    const { emitter } = node
    if (emitter) {
      emitter.emit(key, type, path, key, value)
      emitter.emit('*', type, path, key, value)
    }
  }

  private _ensure_emitter = (path: string[]): EventEmitter_ => {
    let node = this._node
    for (const p of path) {
      if (!node.children[p]) {
        node.children[p] = { emitter: new EventEmitter_(), children: {} }
      }
      node = node.children[p]
    }
    return node.emitter
  }

  private _remove_node = (path: string[]): void => {
    if (path.length > 0) {
      const [last, rest] = pop(path)
      const parent = this._node_at_path(rest)
      delete parent.children[last]
    }
  }

  private _node_at_path = (path: string[]): ObjectNode | null => {
    let node = this._node
    for (const p of path) {
      node = node.children[p]
      if (!node) {
        return null
      }
    }
    return node
  }

  private _set_path = (path: string[], data: any) => {
    const parent_path = path.slice(0, -1)
    const key = last(path)

    const obj = this._obj_at_path(parent_path)

    obj[key] = data

    this._dispatch('set', parent_path, key, data)
  }

  private _delete = async (name: string): Promise<void> => {
    this._delete_path([name])
    return
  }

  private _delete_path = (path: string[]) => {
    const parent_path = path.slice(0, -1)
    const key = last(path)

    const obj = this._obj_at_path(parent_path)

    const value = obj[key]

    delete obj[key]

    if (obj[key] === undefined) {
      this._dispatch('delete', parent_path, key, value)
    }
  }

  public async read(): Promise<T> {
    return this._obj
  }

  public write(data: T): Promise<void> {
    this._obj = data

    return
  }

  public async get(name: string): Promise<any> {
    const value = this._obj[name]

    if (value === undefined) {
      throw new Error('key value not found')
    }

    return this._obj[name]
  }

  public async set(name: string, data: any): Promise<void> {
    this._set_path([name], data)
  }

  public async hasKey(name: string): Promise<boolean> {
    return this._obj[name] !== undefined
  }

  public async delete(name: string): Promise<void> {
    return this._delete(name)
  }

  public async deepGet(path: string[]): Promise<any> {
    const value = this._obj_at_path(path)

    return value
  }

  public async deepSet(path: string[], data: any): Promise<void> {
    this._set_path(path, data)

    return
  }

  public async deepDelete(path: string[]): Promise<void> {
    this._delete_path(path)
    return
  }

  public async keys(): Promise<string[]> {
    return keys(this._obj)
  }

  public subscribe(
    path: string[],
    key: string,
    listener: (
      type: ObjectUpdateType,
      path: string[],
      key: string,
      data: any
    ) => void
  ): Unlisten {
    const emitter = this._ensure_emitter(path)
    emitter.addListener(key, listener)
    return () => {
      emitter.removeListener(key, listener)

      const eventNames = emitter.eventNames()
      if (eventNames.length === 0) {
        this._remove_node(path)
      }
    }
  }
}
