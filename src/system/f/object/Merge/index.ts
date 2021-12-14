import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'
import merge from './f'

export interface I<T, K> {
  a: Dict<T>
  b: Dict<K>
}

export interface O<T, K> {
  ab: Dict<T | K>
}

export default class Merge<T, K> extends Functional<I<T, K>, O<T, K>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a', 'b'],
        o: ['ab'],
      },
      config
    )
  }

  f({ a, b }: I<T, K>, done: Done<O<T, K>>): void {
    done({ ab: merge(a, b) })
  }
}
