import { $ } from '../../../../Class/$'
import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { $U } from '../../../../types/interface/async/$U'
import { ID_RENDER } from '../../../_ids'

export interface I {
  unit: $U & $
  style: object
}

export interface O {}

export default class Render extends Element_<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['style', 'unit'],
        o: [],
      },
      {
        input: {
          component: {
            ref: true,
          },
        },
      },
      system,
      ID_RENDER
    )
  }
}
