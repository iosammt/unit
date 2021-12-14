import { Semifunctional } from '../../../../Class/Semifunctional'
import { Unit } from '../../../../Class/Unit'
import { Config } from '../../../../Class/Unit/Config'
import { Unlisten } from '../../../../Unlisten'

export interface I<T> {
  method: string
  data: any
  event: string
  unit: Unit
}

export interface O<T> {
  data: any
}

export default class Listen<T> extends Semifunctional<I<T>, O<T>> {
  private _listener: ((data: any) => void) | undefined

  private _unlisten: Unlisten | undefined = undefined

  constructor(config?: Config) {
    super(
      {
        fi: ['unit', 'event'],
        fo: [],
        i: ['remove'],
        o: ['data'],
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

    this.addListener('destroy', () => {
      this._remove()
    })
  }

  private _remove = () => {
    this._unlisten()

    this._listener = undefined
    this._unlisten = undefined
  }

  f({ unit, event }: I<T>) {
    const listener = (data: any) => {
      this._output.data.push(data)
    }
    this._listener = listener

    this._unlisten = unit.listen(event, this._listener)
  }

  d() {
    this._remove()
  }

  onIterInputData(name: string, data: any) {
    // if (name === 'remove') {
    if (this._listener) {
      this._remove()
    }
    this._input.event.pull()
    this._input.remove.pull()
    // }s
  }

  // TODO
  onDataInputInvalid(name: string): void {
    this._remove()
    this._invalidate()
  }
}
