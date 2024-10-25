import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_MEMORY } from '../../../_ids'

export interface I<T> {
  a: T
}

export interface O<T> {
  a: T
}

export default class Memory<T> extends Primitive<I<T>, O<T>> {
  private _current: T | undefined = undefined

  constructor(system: System) {
    super({ i: ['a'], o: ['a'] }, {}, system, ID_MEMORY)

    this.addListener('reset', () => {
      this._current = undefined
    })
  }

  onDataInputData(name: string, data: I<T>[keyof I<T>]) {
    this._current = data
    this._forward_if_ready()
  }

  private _forward_if_ready() {
    while (
      !this._forwarding &&
      !this._backwarding &&
      this._current !== undefined
    ) {
      this._forward('a', this._current)
      this._current = undefined
      this._backward_all()
    }
  }

  onDataOutputDrop(name: string) {
    this._current = undefined
  }

  public onDataInputInvalid(name: string) {
    this._invalidate()
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      _current: this._current,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _current, ...rest } = state

    super.restoreSelf(rest)

    this._current = _current
  }
}
