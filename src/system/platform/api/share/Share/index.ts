import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_SHARE } from '../../../../_ids'

export type I = {
  data: ShareData
}

export type O = {}

export default class Share extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['data'],
        o: [],
      },
      {
        input: {},
      },
      system,
      ID_SHARE
    )
  }

  async f({ data }: I, done: Done<O>): Promise<void> {
    const {
      api: {
        navigator: { share },
      },
    } = this.__system

    try {
      await share(data)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    done()
  }
}
