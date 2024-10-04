import { ASYNC } from '../types/interface/async/wrapper'
import { RemoteAPI } from './RemoteAPI'
import { METHOD, METHOD_TYPES } from './method'

export function remoteRef(ref: RemoteAPI['ref']): RemoteAPI['ref'] {
  let _ref: RemoteAPI['ref'] = {}

  for (const name in ref) {
    const method = ref[name]

    const _method = (data: any): RemoteAPI => {
      const { _ } = data

      const $unit = method(data)

      const remoteApi: RemoteAPI = {
        get: {},
        call: {},
        watch: {},
        ref: {},
      }

      for (const __ of _) {
        const methods = METHOD[__]

        for (const type in methods) {
          const methodList = methods[type]

          for (const methodName of methodList) {
            const $methodName = `$${methodName}`

            if (type === 'ref') {
              remoteApi[type][$methodName] = (...args) => {
                let result = $unit[$methodName](...args)

                result = makeRemoteUnitAPI(result, result.__)

                return result
              }
            } else {
              remoteApi[type][$methodName] = $unit[$methodName]
            }
          }
        }
      }

      return remoteApi
    }

    _ref[name] = _method
  }

  return _ref
}

export function makeRemoteUnitAPI(unit: any, _: string[]): RemoteAPI {
  const api: RemoteAPI = {
    get: {},
    call: {},
    watch: {},
    ref: {},
  }

  for (const __ of _) {
    const method = METHOD[__]
    const async_ = ASYNC[__]

    const $unit = async_(unit)

    for (const type of METHOD_TYPES) {
      for (const name of method[type]) {
        const $name = `$${name}`

        api[type] = { ...api[type], [$name]: $unit[$name] }
      }
    }
  }

  api.ref = remoteRef(api.ref)

  return api
}
