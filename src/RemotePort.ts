import { MethodType } from './client/method'
import { CALL, GET, REF, REF_EXEC, UNWATCH, WATCH } from './constant/STRING'
import { EventEmitter_, EventEmitter_EE } from './EventEmitter'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { Port } from './types/global/Port'
import { Unlisten } from './types/Unlisten'
import { randomIdNotInSet } from './util/id'

export type AnyEmitterEvents = EventEmitter_EE<Dict<any[]>> & Dict<any[]>

export class RemotePort {
  private _port: Port

  private _call_id: Set<string> = new Set<string>()
  private _watch_id: Set<string> = new Set<string>()
  private _ref_id: Set<string> = new Set<string>()

  private _ref: Dict<RemotePort> = {}

  private _watch_emitter: EventEmitter_<AnyEmitterEvents> = new EventEmitter_()
  private _call_emitter: EventEmitter_<AnyEmitterEvents> = new EventEmitter_()

  private _valid: boolean = true

  constructor(port: Port) {
    this._port = port

    this._port.onmessage = (event) => {
      const { data } = event

      this.exec(data)
    }

    this._port.onerror = (event) => {
      const { message } = event

      // console.log('err', message)
    }
  }

  exec(data) {
    const { type, data: _data } = data as {
      type: MethodType
      id: string
      data: any
    }

    const { id, data: __data } = _data

    if (type === GET) {
      if (!this._call_id.has(id)) {
        throw new Error('unexpected worker call message id')
      }

      this._call_emitter.emit(id, __data)
    } else if (type === CALL) {
      if (!this._call_id.has(id)) {
        throw new Error('unexpected worker call message id')
      }

      this._call_emitter.emit(id, __data)
    } else if (type === WATCH) {
      if (!this._watch_id.has(id)) {
        throw new Error('unexpected worker watch message id')
      }

      this._watch_emitter.emit(id, __data)
    } else if (type === REF) {
      const ref_port = this._ref[id]

      ref_port.exec(__data)
    } else {
      throw new Error('unexpected worker message type')
    }
  }

  get(method: string, data: any, callback: Callback<any>): void {
    const id = randomIdNotInSet(this._call_id)

    this._call_id.add(id)

    const listener = (data) => {
      this._call_emitter.removeListener(id, listener)
      this._call_id.delete(id)

      callback(data)
    }

    this._call_emitter.addListener(id, listener)

    const _data = { type: GET, data: { id, method, data } }

    this._port.send(_data)
  }

  call(method: string, data: any, callback: Callback<any>): void {
    const id = randomIdNotInSet(this._call_id)

    this._call_id.add(id)

    const listener = (data) => {
      this._call_emitter.removeListener(id, listener)
      this._call_id.delete(id)

      callback(data)
    }

    this._call_emitter.addListener(id, listener)

    const _data = { type: CALL, data: { id, method, data } }

    this._port.send(_data)
  }

  watch(method: string, data: any, callback: Callback<any>): Unlisten {
    const id = randomIdNotInSet(this._watch_id)

    this._watch_id.add(id)

    const listener = (data) => {
      callback(data)
    }

    this._watch_emitter.addListener(id, listener)

    const _data = { type: WATCH, data: { id, method, data } }

    this._port.send(_data)

    return () => {
      this._watch_emitter.removeListener(id, listener)

      this._watch_id.delete(id)

      if (this._valid) {
        const _data = { type: UNWATCH, data: { id } }

        this._port.send(_data)
      } else {
        // console.log('Invalid Remote Port unlisten called')
      }
    }
  }

  ref(method: string, data: any): RemotePort {
    const id = randomIdNotInSet(this._ref_id)

    const _data = { type: REF, data: { id, method, data } }

    this._port.send(_data)

    const port: Port = {
      send: (data) => {
        const _data = { type: REF_EXEC, data: { id, data } }
        this._port.send(_data)
      },
      onmessage() {},
      onerror() {},
    }

    const remote_port = new RemotePort(port)

    this._ref[id] = remote_port

    return remote_port
  }

  close(): void {
    this._valid = false

    for (const id in this._ref) {
      const ref = this._ref[id]

      ref.close()
    }
  }

  valid(): boolean {
    return this._valid
  }
}
