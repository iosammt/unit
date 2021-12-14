import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'

const spec = require('../../../system/core/loop/RangeBounce/spec.json')
const RangeBounce = fromSpec<{ any: any }, { bit: number }>(
  spec,
  globalThis.__specs
)

const rangeBounce = new RangeBounce()

false && watchUnitAndLog(rangeBounce)
false && watchGraphAndLog(rangeBounce)

// do not forget to play
rangeBounce.play()

rangeBounce.push('a', 5)
rangeBounce.push('b', 5)
assert.equal(rangeBounce.take('i'), undefined)
assert.equal(rangeBounce.peakInput('a'), undefined)
assert.equal(rangeBounce.peakInput('b'), undefined)

rangeBounce.push('a', 0)
rangeBounce.push('b', 2)
assert.equal(rangeBounce.take('i'), 0)
assert.equal(rangeBounce.take('i'), 1)
assert.equal(rangeBounce.take('i'), 1)
assert.equal(rangeBounce.take('i'), 0)
assert.equal(rangeBounce.peakInput('a'), undefined)
assert.equal(rangeBounce.peakInput('b'), undefined)

// // infinite loop
// rangeBounce.setInputConstant('a', true)
// rangeBounce.setInputConstant('b', true)
// rangeBounce.setOutputIgnored('i', true)
// rangeBounce.push('a', 0)
// rangeBounce.push('b', 1)

// // infinite loop
// rangeBounce.setInputConstant('a', true)
// rangeBounce.setInputConstant('b', true)
// rangeBounce.setOutputIgnored('i', true)
// rangeBounce.push('a', -100)
// rangeBounce.push('b', 100)
