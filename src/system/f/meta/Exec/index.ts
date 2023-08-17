import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { ID_EXEC } from '../../../_ids'

export interface I {
  unit: Unit
  method: string
  args: any[]
}

export interface O {
  return: any
}

export default class Exec extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['unit', 'method', 'args'],
        o: ['return'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      ID_EXEC
    )
  }

  public f({ unit, method, args }: Partial<I>, done: Done<O>) {
    const f = unit[method]

    let _return: any

    if (typeof f === 'function') {
      try {
        _return = f.call(unit, ...args)
      } catch (err) {
        done(undefined, err.message)

        return
      }
    } else {
      done(undefined, 'invalid method')

      return
    }

    done({ return: _return })
  }
}
