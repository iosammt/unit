import { Pin, PinEvent } from '../Pin'
import { stringify } from '../spec/stringify'
import { GlobalRefSpec } from '../types/GlobalRefSpec'
import { $_ } from '../types/interface/$_'
import { Moment } from './Moment'
import { PinType } from './PinType'

export interface RefPinMomentData {
  pinId: string
  type: string
  data: GlobalRefSpec | string
}

export interface RefPinMoment extends Moment<RefPinMomentData> {}

export function watchRefPinEvent(
  event: PinEvent,
  type: 'ref_input' | 'ref_output',
  pinType: PinType,
  pinId: string,
  pin: Pin<any>,
  callback: (moment: RefPinMoment) => void
): () => void {
  // console.log(event, type, pin)

  const listener = (_data: $_) => {
    const data = stringify(_data, true)

    callback({
      type,
      event,
      data: { type: pinType, pinId, data },
    })
  }

  pin.prependListener(event, listener)

  return () => {
    pin.removeListener(event, listener)
  }
}
