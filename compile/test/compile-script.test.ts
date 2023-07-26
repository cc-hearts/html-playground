import { describe } from 'node:test'
import { transform } from '../compile-script.js'
import assert from 'node:assert'
describe('babel complier', () => {
  assert.deepStrictEqual(
    transform(`import a from './b.js'`),
    'const {\n  default: a\n} = __require("./b.js");',
  )

  assert.deepStrictEqual(
    transform(`import { baz } from 'foo.js'`),
    'const {\n  baz\n} = __require("foo.js");',
  )

  assert.deepStrictEqual(
    transform(`import * as ok from 'foo.js'`),
    'const ok = __require("foo.js");',
  )

  assert.deepStrictEqual(transform('export const a = 1'), '')
})
