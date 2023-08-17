import { ElementEE, Element_ } from '../../../../../Class/Element'
import { Unit } from '../../../../../Class/Unit'
import { APINotSupportedError } from '../../../../../exception/APINotImplementedError'
import { System } from '../../../../../system'
import { Callback } from '../../../../../types/Callback'
import { CS } from '../../../../../types/interface/CS'
import { PS } from '../../../../../types/interface/PS'
import { CSOpt } from '../../../../../types/interface/async/$CS'
import { ID_VIDEO } from '../../../../_ids'
import VideoComp from './Component'

export interface I {
  style: object
  src: string
  stream: Unit
  controls: boolean
  currentTime: number
}

export interface O {}

export interface VideoJ {}
export interface VideoEE extends ElementEE<{}> {}
export interface VideoC extends VideoComp {}

export default class Video
  extends Element_<I, O, VideoJ, VideoEE, VideoC>
  implements CS, PS
{
  constructor(system: System) {
    super(
      {
        i: ['src', 'stream', 'style', 'controls', 'currentTime'],
        o: [],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_VIDEO
    )

    this._defaultState = {}
  }

  async captureStream({ frameRate }: CSOpt): Promise<MediaStream> {
    // TODO
    // const stream = await this._element.captureStream({ frameRate })
    throw new APINotSupportedError('Video Capture')
  }

  requestPictureInPicture(callback: Callback<PictureInPictureWindow>): void {
    // TODO
  }

  onDataInputData(name: string, data: any): void {
    super.onDataInputData(name, data)

    if (name === 'currentTime') {
      this._input.currentTime.pull()
    }
  }
}
