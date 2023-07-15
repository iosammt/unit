import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_NUMBER_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: number
}

export interface O {
  value: number
}

export default class NumberField extends Field<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'min', 'max'],
        o: ['value'],
      },
      {},
      system,
      ID_NUMBER_FIELD
    )

    this._defaultState = {
      value: 0,
    }
  }
}
