import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'

const spec = {
  id: '9fa54f98-5dca-11ea-92d5-7f5b0bc9cda0',
  name: 'random hex color',
  units: {
    nstringbuilderfrom: {
      path: '9cab124a-b40d-4614-b032-20b0209e90e3',
      input: {
        from: { constant: true, data: "'#'" },
        n: { constant: true, data: '7' },
      },
    },
    wait: {
      path: 'ba38b0af-80c0-49e4-9e39-864396964ccc',
      input: { a: { constant: true, data: '0' } },
    },
    randomnaturalbetween: {
      path: '9d2b69b2-c468-4fca-a7d5-d158033c0201',
      input: { a: { constant: false }, b: { constant: true, data: '16' } },
    },
    repeatn: {
      path: '251ba609-a9c5-451b-8162-411c966bf919',
      input: { n: { constant: true, data: '6' } },
    },
    tostring: {
      path: 'f712793d-8ee9-4805-9d4a-8c210cae667a',
      input: { radix: { constant: true, data: '16' } },
    },
  },
  merges: {
    0: {
      repeatn: { input: { a: true } },
      wait: { output: { a: true } },
    },
    1: {
      randomnaturalbetween: { input: { a: true } },
      repeatn: { output: { a: true } },
    },
    2: {
      randomnaturalbetween: { output: { n: true } },
      tostring: { input: { n: true } },
    },
    3: {
      nstringbuilderfrom: { input: { a: true } },
      tostring: { output: { str: true } },
    },
  },
  metadata: { icon: 'palette', description: 'random HEX color string' },
  inputs: {
    any: {
      name: 'any',
      pin: { 0: { unitId: 'wait', pinId: 'b' } },
      functional: true,
    },
  },
  outputs: {
    hex: {
      name: 'hex',
      pin: { 0: { unitId: 'nstringbuilderfrom', pinId: 'str' } },
    },
  },
}

const RandomHEXColor = fromSpec(spec as GraphSpec, globalThis.__specs)

const randomHEXColor = new RandomHEXColor()

false && watchUnitAndLog(randomHEXColor)
false && watchGraphAndLog(randomHEXColor)
false && watchGraphAndLog(randomHEXColor.refUnit('nstringbuilderfrom') as Graph)

randomHEXColor.play()

randomHEXColor.push('any', 0)
assert.notEqual(randomHEXColor.take('hex'), undefined)

randomHEXColor.push('any', 0)
assert.notEqual(randomHEXColor.take('hex'), undefined)
