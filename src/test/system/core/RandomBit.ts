import * as assert from 'assert'
import { watchGraphAndLog, watchUnitAndLog } from '../../../debug'
import { fromSpec } from '../../../spec/fromSpec'
import _specs from '../../../system/_specs'
import { GraphSpec } from '../../../types/GraphSpec'
import { system } from '../../util/system'

const spec =
  require('../../../system/core/common/RandomBit/spec.json') as GraphSpec

const RandomBit = fromSpec<{ any: any }, { bit: number }>(spec, _specs, {})

const randomBit = new RandomBit(system)

false && watchUnitAndLog(randomBit)
false && watchGraphAndLog(randomBit)

randomBit.play()

let bit

randomBit.push('any', 1)
bit = randomBit.take('bit')
assert(bit === 0 || bit === 1)

randomBit.push('any', 'foo')
bit = randomBit.take('bit')
assert(bit === 0 || bit === 1)
