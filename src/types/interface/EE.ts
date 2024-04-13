import { Dict } from '../Dict'
import { Listener } from '../Listener'
import { Unlisten } from '../Unlisten'

export interface EE<
  _EE extends Dict<any[]> = any,
  __EE extends Dict<any[]> = any,
> {
  addListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): Unlisten

  prependListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): Unlisten

  removeListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): void

  eventNames(): string[]

  emit<K extends keyof _EE>(event: K, ...args: _EE[K]): void

  listenerCount(name: keyof _EE): number
}
