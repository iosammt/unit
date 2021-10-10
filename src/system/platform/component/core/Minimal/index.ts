import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I<T> {
  id: string
}

export interface O<T> {}

export default class Minimal<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['id', 'style'],
        o: [],
      },
      config
    )
  }
}
