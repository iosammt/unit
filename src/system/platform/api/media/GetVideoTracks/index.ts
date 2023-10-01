import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { MethodNotImplementedError } from '../../../../../exception/MethodNotImplementedError'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { MS } from '../../../../../types/interface/MS'
import { MST } from '../../../../../types/interface/MST'
import { wrapMediaStreamTrack } from '../../../../../wrap/MediaStreamTrack'
import { ID_GET_VIDEO_TRACKS } from '../../../../_ids'

export type I = {
  stream: MS
  init: number
  done: any
}

export type O = {
  tracks: A
}

export default class GetVideoTracks extends Semifunctional<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['stream', 'init'],
        fo: ['tracks'],
        i: ['done'],
        o: [],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
        output: {
          tracks: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_VIDEO_TRACKS
    )

    this.addListener('destroy', () => {})
  }

  async f({ stream }: I, done: Done<O>) {
    let _tracks: MediaStreamTrack[]

    try {
      _tracks = await stream.getVideoTracks()
    } catch (err) {
      done(undefined, err)
    }

    const tracks = new (class Array extends $ implements A<MST> {
      __: string[] = ['A']

      async append(a: MST): Promise<void> {
        throw new MethodNotImplementedError()
      }

      async put(i: number, data: any): Promise<void> {
        throw new MethodNotImplementedError()
      }

      async at(i: number): Promise<MST> {
        const track = _tracks[i]

        const _track = wrapMediaStreamTrack(track, this.__system)

        return _track
      }

      async length(): Promise<number> {
        return _tracks.length
      }

      async indexOf(a: MST): Promise<number> {
        throw new MethodNotImplementedError()
      }
    })(this.__system)

    done({ tracks })
  }

  onIterDataInputData(name: string): void {
    // if (name === 'done') {
    this._forward_all_empty()

    this._backward_all()

    this._backward('done')
    // }
  }
}
