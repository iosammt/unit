import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Config } from '../../../../../Class/Unit/Config'
import { CA } from '../../../../../interface/CA'

export interface I {
  canvas: CA
  step: any[]
}

export interface O {
  i: number
}

export default class Draw extends Functional<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['canvas', 'step'],
        o: [],
      },
      config,
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      }
    )
  }

  f({ canvas, step }: I, done: Done<O>): void {
    canvas.draw(step)
    done({})
  }
}
