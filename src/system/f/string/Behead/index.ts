import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_BEHEAD_0 } from '../../../_ids'

export interface I<T> {
  a: string
}

export interface O<T> {
  tail: string
  head: string
}

export default class Behead<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['a'],
        o: ['tail', 'head'],
      },
      {},
      system,
      ID_BEHEAD_0
    )
  }

  f({ a }: I<T>, done: Done<O<T>>): void {
    const head = a[0] || ''
    const tail = a.slice(1) || ''
    done({ tail, head })
  }
}
