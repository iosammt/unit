import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { ID } from '../../../../../types/interface/ID'
import { J } from '../../../../../types/interface/J'
import { TA } from '../../../../../types/interface/TA'
import { wrapImageData } from '../../../../../wrap/ImageData'
import { ID_IMAGE_DATA } from '../../../../_ids'

export interface I<T> {
  data: TA & $
  width: number
  height: number
  opt: ImageDataSettings
  done: any
}

export interface O<T> {
  image: J & ID
}

export default class ImageData_<T> extends Holder<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        fi: ['data', 'width', 'height', 'opt'],
        fo: ['image'],
      },
      {
        input: {
          data: {
            ref: true,
          },
        },
        output: {
          image: {
            ref: true,
          },
        },
      },
      system,
      ID_IMAGE_DATA
    )
  }

  async f({ data, width, height, opt }: I<T>, done: Done<O<T>>): Promise<void> {
    let imageData: ImageData

    try {
      const _data = data.raw()

      imageData = new ImageData(_data, width, height, opt)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const image = wrapImageData(imageData, this.__system)

    done({
      image,
    })
  }
}
