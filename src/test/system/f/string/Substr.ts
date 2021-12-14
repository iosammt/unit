import * as assert from 'assert'
import { watchUnitAndLog } from '../../../../debug'
import Substr from '../../../../system/f/string/Substr'

const substr = new Substr()

false && watchUnitAndLog(substr)

substr.push('a', 'foobar')
substr.push('from', 3)
substr.push('length', 3)
assert.equal(substr.take('a'), 'bar')

substr.push('a', 'foobar')
substr.push('from', 0)
substr.push('length', 3)
assert.equal(substr.take('a'), 'foo')
