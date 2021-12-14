import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Config } from '../../../../Class/Unit/Config'

export interface I<T> {
  a: string
}

export interface O<T> {
  tail: string
  head: string
}

export default class Behead<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['a'],
        o: ['tail', 'head'],
      },
      config
    )
  }

  f({ a }: I<T>, done: Done<O<T>>): void {
    const head = a[0]
    const tail = a.slice(1) || ''
    done({ tail, head })
  }
}
