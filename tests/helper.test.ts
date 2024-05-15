import { describe, it, expect } from 'vitest'
import { transform } from '../server/utils/helper'
describe('compile-helper module', () => {
  it('Compile a named export', () => {
    expect(transform(`const a = 1; export { a }`)).toBe(
      `const a = 1;\n__exports("", "a", a);`
    )
    expect(transform(`const a = 1; export { a as b }`)).toBe(
      `const a = 1;\n__exports("", "b", a);`
    )
    expect(transform(`const a = 1; export { a as default }`)).toBe(
      `const a = 1;\n__exports("", "default", a);`
    )
    expect(transform(`const a = 1; export { a as default, a as b }`)).toBe(
      `const a = 1;\n__exports("", "b", a);\n__exports("", "default", a);`
    )
    expect(transform(`export const { name1, name2: bar } = o;`)).toBe(
      `const {\n  name1,\n  name2: bar\n} = o;\n__exports("", "bar", bar);\n__exports("", "name1", name1);`
    )
  })

  it('Compile a normal default export', () => {
    expect(transform(`export default 1`)).toBe(`__exports("", "default", 1);`)
    expect(transform(`const a = 1; export default a`)).toBe(
      `const a = 1;\n__exports("", "default", a);`
    )
    expect(transform(`function noop(){} export default noop`)).toBe(
      `function noop() {}\n__exports("", "default", noop);`
    )
    expect(transform(`export default function noop(){}`)).toBe(
      `function noop() {}\n__exports("", "default", noop);`
    )
  })

  it('export module', () => {
    expect(transform(`export * from 'a'`)).toBe(
      `const __module_import = await __require("a");\nObject.keys(__module_import).forEach(key => {\n  if (key !== "default") {\n    __exports("", key, __module_import[key]);\n  }\n});`
    )
    expect(transform(`export { a } from 'a.js' `)).toBe(
      `const __module_import_1 = await __require("a.js");\n__exports("", "a", __module_import_1.a);`
    )
    expect(transform(`export { b as c } from 'a.js' `)).toBe(
      `const __module_import_1 = await __require("a.js");\n__exports("", "c", __module_import_1.b);`
    )
  })

  it('import module', () => {
    expect(transform(`import a from 'a'`)).toBe(
      `const {\n  default: a\n} = await __require("a");`
    )
    expect(transform(`import { a } from 'a'`)).toBe(
      `const {\n  a\n} = await __require("a");`
    )
    expect(transform(`import { a as b } from 'a'`)).toBe(
      `const {\n  a: b\n} = await __require("a");`
    )
  })
})
