import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'

export const EE_METHOD_CALL = ['emit', 'eventNames']
export const EE_METHOD_WATCH = ['addListener']
export const EE_METHOD_REF = ['refEmitter']

export const EE_METHOD = [
  ...EE_METHOD_CALL,
  ...EE_METHOD_WATCH,
  ...EE_METHOD_REF,
]

export interface $EE_C {
  $emit(data: { type: string; data: any }, callback: Callback): void
  $eventNames(data: {}, callback: Callback<string[]>): void
}

export interface $EE_W {
  $addListener(data: { event: string }, callback: Callback): Unlisten
}

export interface $EE_R {
  $refEmitter(data: {}): $EE
}

export interface $EE extends $EE_C, $EE_W, $EE_R {}
