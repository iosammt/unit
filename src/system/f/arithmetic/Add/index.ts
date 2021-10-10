import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I {
  a: number
  b: number
}

export interface O {
  'a + b': number
}

export default class Add extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['a + b'],
      },
      config
    )
  }

  f({ a, b }: I, done: Done<O>): void {
    done({ 'a + b': a + b })
  }
}
