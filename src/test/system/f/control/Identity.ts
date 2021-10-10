import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Identity from '../../../../system/f/control/Identity'

const identity = new Identity()

false && watchUnitAndLog(identity)

identity.push('a', 1)
assert.equal(identity.takeOutput('a'), 1)

identity.push('a', 1)
assert.equal(identity.takeOutput('a'), 1)

identity.push('a', null)
assert.equal(identity.takeOutput('a'), null)

identity.setInputConstant('a', true)
assert(identity.getInput('a').constant())
identity.push('a', 4)
assert.equal(identity.peakInput('a'), 4)
assert.equal(identity.peakOutput('a'), 4)
assert.equal(identity.takeOutput('a'), 4)
assert.equal(identity.takeOutput('a'), 4)
assert.equal(identity.takeOutput('a'), 4)
