import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Throw from '../../../../system/f/control/Throw'
import Catch from '../../../../system/f/meta/Catch'

const _catch = new Catch()
const _throw = new Throw()

false && watchUnitAndLog(_catch)
false && watchUnitAndLog(_throw)

_throw.push('message', 'bafum!')

assert.equal(_throw.getErr(), 'bafum!')

_catch.push('unit', _throw)

assert.equal(_throw.getErr(), null)

assert.equal(_throw.caughtErr(), 'bafum!')

assert.equal(_catch.peak('err'), 'bafum!')

assert.equal(_catch.take('err'), 'bafum!')

assert.equal(_throw.caughtErr(), null)

_throw.push('message', 'grrr!')

assert.equal(_throw.getErr(), null)

assert.equal(_throw.caughtErr(), 'grrr!')

assert.equal(_catch.peak('err'), 'grrr!')

_catch.takeInput('unit')

assert.equal(_catch.peak('err'), null)

assert.equal(_throw.getErr(), 'grrr!')

_catch.push('unit', _throw)

assert.equal(_throw.getErr(), null)

assert.equal(_throw.caughtErr(), 'grrr!')

assert.equal(_catch.peak('err'), 'grrr!')

assert.equal(_catch.take('err'), 'grrr!')

assert.equal(_throw.caughtErr(), null)
