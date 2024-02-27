import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_PROMPT } from '../../../../_ids'

export type I = {
  message: string
  default: string
}

export type O = {
  answer: string
}

export default class Prompt extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['message', 'default'],
        o: ['answer'],
      },
      {},
      system,
      ID_PROMPT
    )
  }

  f({ message, default: default_ }: I, done: Done<O>): void {
    const {
      api: {
        alert: { prompt },
      },
    } = this.__system

    const answer = prompt(message, default_)

    if (answer === null) {
      done(undefined, 'user cancelled prompt')

      return
    }

    done({ answer })
  }
}
