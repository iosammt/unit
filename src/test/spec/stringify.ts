import * as assert from 'assert'
import { evaluate } from '../../spec/evaluate'
import { fromId } from '../../spec/fromId'
import { stringify } from '../../spec/stringify'

// stringify

assert.deepEqual(stringify(1), '1')
assert.deepEqual(stringify(Infinity), 'Infinity')
assert.deepEqual(stringify('"\n"'), `'"\\n"'`)
assert.deepEqual(stringify('foo'), "'foo'")
assert.deepEqual(stringify('"foo"'), '\'"foo"\'')
assert.deepEqual(stringify("'foo'"), "'\\'foo\\''")
assert.deepEqual(stringify("''foo''"), "'\\'\\'foo\\'\\''")
assert.deepEqual(stringify('\\'), "'\\\\'")
assert.deepEqual(stringify("'\\'"), "'\\'\\\\\\''")
assert.deepEqual(stringify(true), 'true')
assert.deepEqual(stringify(false), 'false')
assert.deepEqual(stringify([]), '[]')
assert.deepEqual(stringify([1, 2, 3]), '[1,2,3]')
assert.deepEqual(
  stringify({ method: 'PUT', headers: { 'Content-Type': 'application/json' } }),
  "{method:'PUT',headers:{\"Content-Type\":'application/json'}}"
)
assert.deepEqual(
  stringify([
    [1, 0],
    [0, 0],
  ]),
  '[[1,0],[0,0]]'
)
// prettier-ignore
assert.deepEqual(
  stringify(
    '{"error":{"errors":[{"domain": "global","reason": "required","message": "Login Required","locationType": "header","location": "Authorization"}],"code": 401,"message": "Login Required"}}")'
  ),
  `'{"error":{"errors":[{"domain": "global","reason": "required","message": "Login Required","locationType": "header","location": "Authorization"}],"code": 401,"message": "Login Required"}}")'`
)
// prettier-ignore
assert.deepEqual(
  stringify(`{
    "error": {
     "errors": [
      {
       "domain": "global",
       "reason": "required",
       "message": "Login Required",
       "locationType": "header",
       "location": "Authorization"
      }
     ],
     "code": 401,
     "message": "Login Required"
    }
   }
   `),
  `'{\\n    "error": {\\n     "errors": [\\n      {\\n       "domain": "global",\\n       "reason": "required",\\n       "message": "Login Required",\\n       "locationType": "header",\\n       "location": "Authorization"\\n      }\\n     ],\\n     "code": 401,\\n     "message": "Login Required"\\n    }\\n   }\\n   '`
)

assert.deepEqual(stringify({ foo: 0 }), '{foo:0}')
// prettier-ignore
assert.deepEqual(stringify({ foo: 'bar', zaz: 'tar' }), '{foo:\'bar\',zaz:\'tar\'}')
assert.deepEqual(stringify({ 1: 1 }), '{1:1}')
assert.deepEqual(
  stringify(fromId('6fe452f2-2ec1-4ee2-887d-751c3697e6bf', globalThis.__specs)),
  '6fe452f2-2ec1-4ee2-887d-751c3697e6bf'
)
assert.deepEqual(
  stringify(fromId('fa94b179-00e3-4ed1-814e-7938324a833f', globalThis.__specs)),
  'fa94b179-00e3-4ed1-814e-7938324a833f'
)

assert.deepEqual(JSON.parse(evaluate(stringify(JSON.stringify('\n')))), '\n')
assert.deepEqual(JSON.parse(evaluate(stringify(JSON.stringify('\r')))), '\r')
