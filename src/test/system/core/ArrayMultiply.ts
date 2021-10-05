import * as assert from 'assert'
import { Graph } from '../../../Class/Graph'
import {
  watchGraphAndLog,
  watchTreeAndLog,
  watchUnitAndLog,
} from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import { GraphSpec } from '../../../types'

const spec =
  require('../../../system/core/array/Multiply/spec.json') as GraphSpec
const ArrayMultiply = fromSpec(spec, globalThis.__specs)

const arrayMultiply = new ArrayMultiply() as Graph

false && watchUnitAndLog(arrayMultiply)
false && watchGraphAndLog(arrayMultiply)
false && watchTreeAndLog(arrayMultiply)

// do not forget to play
arrayMultiply.play()

arrayMultiply.push('a', [])
arrayMultiply.push('b', [])
assert.deepEqual(arrayMultiply.take('ab'), [])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)

arrayMultiply.push('a', [1])
arrayMultiply.push('b', [2])
assert.deepEqual(arrayMultiply.take('ab'), [2])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)

arrayMultiply.push('a', [1, 2])
arrayMultiply.push('b', [1, 2])
assert.deepEqual(arrayMultiply.take('ab'), [1, 4])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)

arrayMultiply.push('a', [1, 2])
arrayMultiply.push('b', [1, 2])
assert.deepEqual(arrayMultiply.peak('ab'), [1, 4])
arrayMultiply.push('b', [3, 4])
assert.deepEqual(arrayMultiply.take('ab'), [3, 8])
assert.deepEqual(arrayMultiply.peakInput('a'), undefined)
assert.deepEqual(arrayMultiply.peakInput('b'), undefined)
