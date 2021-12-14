import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { J } from '../../../../../interface/J'

export interface I<T> {
  obj: J
  any: any
}

export interface O<T> {
  keys: string[]
}

export default class Keys<T> extends Functional<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['obj', 'any'],
        o: ['keys'],
      },
      config,
      {
        input: {
          obj: {
            ref: true,
          },
        },
      }
    )
  }

  async f({ obj, any }: I<T>, done: Done<O<T>>) {
    try {
      const keys = await obj.keys()
      done({ keys })
    } catch (err) {
      done(undefined, err)
    }
  }
}
