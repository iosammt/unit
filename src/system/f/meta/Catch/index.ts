import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Primitive } from '../../../../Primitive'
import { Unlisten } from '../../../../Unlisten'

export interface I<T> {
  unit: string
}

export interface O<T> {
  err: string
}

export default class Catch<T> extends Primitive<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['unit'],
        o: ['err'],
      },
      config,
      {
        input: {
          unit: {
            ref: true,
          },
        },
      }
    )
  }

  private _unlisten: Unlisten
  private _done: () => void

  onRefInputData(name: string, unit: Unit): void {
    // if (name === 'unit') {
    const { unlisten, done } = unit.catch((err: string | null) => {
      if (err === null) {
        // this._backward_all()
        this._forward_all_empty()
      } else {
        this._output.err.push(err)
      }
    })
    this._unlisten = unlisten
    this._done = done
    const err = unit.caughtErr()
    if (err !== null) {
      this._output.err.push(err)
    }
    // }
  }

  onRefInputDrop(name: string): void {
    // if (name === 'unit') {
    this._unlisten()
    this._unlisten = undefined
    this._done = undefined
    this._forward_all_empty()
    // }
  }

  onDataOutputDrop(name: string): void {
    // if (name === 'err') {
    if (!this._backwarding && !this._forwarding_empty) {
      this._done()
    }
    // }
  }
}
