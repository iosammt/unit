import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I {
  style: Dict<string>
  key: string
}

export interface O {}

export default class KeyboardKey extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['style', 'key'],
        o: [],
      },
      config
    )
  }
}
