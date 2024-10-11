import * as assert from 'assert'
import { UNTITLED } from '../../constant/STRING'
import { watchGraphAndLog } from '../../debug'
import { fromSpec } from '../../spec/fromSpec'
import { system } from '../util/system'

const spec = system.newSpec({
  name: UNTITLED,
  units: {
    add: {
      id: '6fe452f2-2ec1-4ee2-887d-751c3697e6bf',
      input: {
        b: {
          data: '1',
        },
        a: {
          data: '2',
        },
      },
    },
  },
  merges: {},
  inputs: {},
  outputs: {},
})

const Class = fromSpec(spec, system.specs, system.classes)

const composition = new Class(system)

composition.play()

false && watchGraphAndLog(composition)

assert.equal(composition.getUnit('add').getOutput('a + b').take(), 3)
