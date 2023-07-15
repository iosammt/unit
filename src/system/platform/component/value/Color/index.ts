import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_COLOR } from '../../../../_ids'

export interface I {
  value: string
}

export interface O {
  value: string
}

export default class Color extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value'],
        o: ['value'],
      },
      {},
      system,
      ID_COLOR
    )

    this._defaultState = {
      value: '#000000',
    }
  }
}
