import { Element } from '../../../../../Class/Element/Element'
import { Config } from '../../../../../Class/Unit/Config'

export interface I {}

export interface O {}

export default class SVGG extends Element<I, O> {
  constructor(config?: Config) {
    super(
      {
        i: ['class', 'style'],
        o: [],
      },
      config
    )
  }
}
