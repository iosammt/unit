import { boot } from '../boot'
import { RemoteRef } from '../client/RemoteRef'
import { makeRemoteUnitAPI } from '../client/makeRemoteUnitAPI'
import { workerApi } from '../client/platform/worker/boot'
import { init } from '../client/service'
import _classes from '../system/_classes'
import _specs from '../system/_specs'

const system = boot(null, workerApi(), {
  specs: _specs,
  classes: _classes,
  components: {},
})

const post = (data) => {
  postMessage(data, null)
}

const api = makeRemoteUnitAPI(system, ['S'])

const ref = new RemoteRef(api, post)

init(() => {
  return ref
})
