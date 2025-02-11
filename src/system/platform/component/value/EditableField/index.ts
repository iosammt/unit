import { Field } from '../../../../../Class/Field'
import { System } from '../../../../../system'
import { ID_EDITABLE_FIELD } from '../../../../_ids'

export interface I {
  style: object
  value: string
  attr: number
}

export interface O {
  value: string
}

export default class EditableField extends Field<'value', I, O> {
  constructor(system: System) {
    super(
      {
        i: ['value', 'style', 'attr'],
        o: ['value'],
      },
      {},
      system,
      ID_EDITABLE_FIELD,
      'value'
    )

    this._defaultState = {
      value: '',
    }
  }
}
