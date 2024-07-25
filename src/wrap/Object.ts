import { $ } from '../Class/$'
import { Object_ } from '../Object'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { J } from '../types/interface/J'
import { Unlisten } from '../types/Unlisten'

export function wrapSharedRef<T extends Dict<any>>(data: SharedRef<T>): J<T> {
  const _data = new Object_<T>(data.current)

  return _data
}

export function wrapObject<T extends object>(
  data: T,
  system: System
): J<T> & $ {
  const _data = new Object_<T>(data)

  const _obj = new (class Array extends $ implements J<T> {
    __: string[] = ['J']

    get<K extends keyof T>(name: K): Promise<T[K]> {
      return _data.get(name)
    }

    set<K extends keyof T>(name: K, data: T[K]): Promise<void> {
      return _data.set(name, data)
    }

    delete<K extends keyof T>(name: K): Promise<void> {
      return _data.delete(name)
    }

    hasKey<K extends keyof T>(name: K): Promise<boolean> {
      return _data.hasKey(name)
    }

    keys(): Promise<string[]> {
      return _data.keys()
    }

    deepGet(path: string[]): Promise<any> {
      return _data.deepGet(path)
    }

    deepSet(path: string[], data: any): Promise<void> {
      return _data.deepSet(path, data)
    }

    deepDelete(path: string[]): Promise<void> {
      return _data.deepDelete(path)
    }

    subscribe(
      path: string[],
      key: string,
      listener: (
        type: ObjectUpdateType,
        path: string[],
        key: string,
        data: any
      ) => void
    ): Unlisten {
      return _data.subscribe(path, key, listener)
    }

    raw() {
      return data
    }
  })(system)

  return _obj
}
