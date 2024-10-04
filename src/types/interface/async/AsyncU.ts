import { $_ } from '../$_'
import { Unit } from '../../../Class/Unit'
import { UnitGetPinDataData } from '../../../Class/Unit/interface'
import { Moment } from '../../../debug/Moment'
import { watchUnit } from '../../../debug/watchUnit'
import { getGlobalRef } from '../../../global'
import { proxyWrap } from '../../../proxyWrap'
import { evaluate } from '../../../spec/evaluate'
import { stringify } from '../../../spec/stringify'
import { clone, mapObjVK } from '../../../util/object'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GlobalRefSpec } from '../../GlobalRefSpec'
import { IO } from '../../IO'
import { stringifyPinData } from '../../stringifyPinData'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $U, $U_C, $U_G, $U_R, $U_W } from './$U'
import { Async } from './Async'

export const AsyncUGet = (unit: Unit<any, any, any>): $U_G => {
  return {
    $getGlobalId(data: {}, callback: Callback<string>): void {
      const __globalId = unit.getGlobalId()

      callback(__globalId)
    },

    $paused(data: {}, callback: Callback<boolean>): void {
      const paused = unit.paused()

      callback(paused)
    },

    $reset(data: {}): void {
      unit.reset()
    },

    $getPinData(
      { type, pinId }: UnitGetPinDataData,
      callback: (data: any) => void
    ): void {
      const _data = unit.getPinData(type, pinId)

      const __data = stringify(_data)

      callback(__data)
    },

    $getAllPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      const _data = unit.getPinsData()

      const __data = stringifyPinData(_data)

      callback(__data)
    },

    $getAllInputData(data: {}, callback: (data: Dict<any>) => void): void {
      const _data = unit.getInputData()
      callback(_data)
    },

    $getAllRefInputData(
      data: {},
      callback: Callback<Dict<GlobalRefSpec>>
    ): void {
      const _data = unit.getRefInputData()

      const __data = mapObjVK(_data, (unit: Unit) => {
        const __ = unit.getInterface()
        const globalId = unit.getGlobalId()

        return { globalId, __ }
      })

      callback(__data)
    },

    $getUnitBundleSpec(
      data: { deep: boolean },
      callback: Callback<UnitBundleSpec>
    ): void {
      const unitBundleSpec = unit.getUnitBundleSpec(data.deep)

      const $unitBundleSpec = clone(unitBundleSpec)

      callback($unitBundleSpec)
    },
  }
}

export const AsyncUCall = (unit: Unit<any, any, any>): $U_C => {
  return {
    $play(data: {}) {
      unit.play()
    },

    $pause(data: {}) {
      unit.pause()
    },

    $reset(data: {}): void {
      unit.reset()
    },

    $push({ pinId, data }: { pinId: string; data: any }): void {
      const { classes, specs } = unit.__system

      const _data = evaluate(data, specs, classes)

      unit.push(pinId, _data)
    },

    $takeInput(data: { path: string[]; pinId: string }): void {
      const { pinId } = data

      unit.takeInput(pinId)
    },

    $setPinData({ type, pinId, data }: { type: IO; pinId: string; data: any }) {
      const { classes, specs } = unit.__system

      const _data = evaluate(data, specs, classes)

      unit.setPinData(type, pinId, _data)
    },

    $removePinData(data: { type: IO; pinId: string }) {
      const { type, pinId } = data
      unit.removePinData(type, pinId)
    },

    $pullInput(data: { pinId: string }): void {
      const { pinId } = data

      const input = unit.getInput(pinId)

      input.pull()
    },
  }
}

export const AsyncUWatch = (unit: Unit): $U_W => {
  return {
    $watch(
      { events }: { events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return watchUnit(unit, callback, events)
    },
  }
}

export const AsyncURef = (unit: Unit): $U_R => {
  return {
    $refGlobalObj(data: GlobalRefSpec): $_ {
      const system = unit.refSystem()

      const { globalId, __ } = data

      const $ = getGlobalRef(system, globalId)

      const $obj = Async($, __ ?? $.__, system.async)

      return proxyWrap($obj, $.__)
    },
  }
}

export const AsyncU: (unit: Unit) => $U = (unit: Unit) => {
  return {
    ...AsyncUGet(unit),
    ...AsyncUCall(unit),
    ...AsyncUWatch(unit),
    ...AsyncURef(unit),
  }
}
