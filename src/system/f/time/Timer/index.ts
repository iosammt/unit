import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  ms: number
}

export interface O {
  ms: number
}

export default class Timer extends Functional<I, O> {
  private _timer: NodeJS.Timer | null = null

  constructor(config?: Config) {
    super(
      {
        i: ['ms'],
        o: ['ms'],
      },
      config
    )

    this.addListener('reset', this._reset)
    this.addListener('destroy', this._reset)
  }

  private _reset() {
    if (this._timer !== null) {
      clearTimeout(this._timer)
      this._timer = null
    }
  }

  public f({ ms }: I, done: Done<O>): void {
    this._reset()
    this._timer = setTimeout(() => {
      this._timer = null
      done({ ms })
    }, ms)
  }
}
