import { Element } from '../../../../Class/Element/Element'
import { Config } from '../../../../Class/Unit/Config'
import { Dict } from '../../../../types/Dict'

export interface I<T> {
  style?: Dict<string>
}

export interface O<T> {}

export default class StorageService<T> extends Element<I<T>, O<T>> {
  constructor(config?: Config) {
    super(
      {
        i: ['style'],
        o: [],
      },
      config
    )
  }
}
