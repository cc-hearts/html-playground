import type { NodePath, types } from '@babel/core'
// @ts-expect-error
import { packages, transformFromAst } from '@babel/standalone'

const template = packages.template.default
const traverse = packages.traverse.default
const parse = packages.parser.parse
const generate = packages.generator.default

export function traverseScriptCode(code: Record<string, string>) {
  return Object.keys(code).reduce((acc, keys) => {
    const newCode = transform(code[keys] as string, keys) || ''
    Reflect.set(acc, keys, newCode)
    return acc
  }, {})
}

const newExportAst = (fileName: string, name: string, value: string) => {
  return template.ast(`__exports("${fileName}", "${name}", ${value});`)
}

export function transform(code: string, fileName = '') {
  const ast = parse(code, {
    sourceType: 'module',
  })
  let count = 1
  if (ast) {
    traverse(ast, {
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        const importStringLiteral = path.node.source.value
        const defaultKey = Symbol('default')
        let isExistsNamespaceKey = false
        const namespaceKey = Symbol('namespace')
        const __import = path.node.specifiers.reduce<
          Record<string | symbol, string>
        >((acc, specifiers) => {
          const { type } = specifiers
          const name = specifiers.local.name
          // @ts-expect-error
          const importedName = specifiers.imported?.name || ''
          if (type === 'ImportDefaultSpecifier') {
            Reflect.set(acc, defaultKey, name)
          } else if (type === 'ImportSpecifier') {
            const target =
              importedName === name ? name : `${importedName}: ${name}`
            Reflect.set(acc, name, target)
          } else {
            Reflect.set(acc, namespaceKey, name)
          }
          return acc
        }, {})
        const importVariable: string[] = []
        ;[defaultKey, namespaceKey].forEach((key) => {
          if (__import[key] !== void 0) {
            let prefix = ''
            if (key === defaultKey) {
              prefix = 'default : '
            } else {
              isExistsNamespaceKey = true
            }
            importVariable.push(`${prefix} ${Reflect.get(__import, key)}`)
          }
        })
        Object.entries(__import).reduce<string[]>((acc, cur) => {
          const [, value] = cur
          acc.push(value as string)
          return acc
        }, importVariable)
        const __importVariable = isExistsNamespaceKey
          ? importVariable.join(',')
          : `{${importVariable.join(',')}}`
        const new_ast = template.ast(
          `const ${__importVariable} = await __require("${importStringLiteral}");`
        )
        // @ts-expect-error
        if (new_ast) path.replaceWith(new_ast)
      },
      ExportNamedDeclaration(path: NodePath<types.ExportNamedDeclaration>) {
        // export const a = 1 ====> __exports(filename, name, value)
        const declaration = path.node.declaration
        let name
        switch (path.node.declaration?.type) {
          case 'VariableDeclaration':
            // @ts-expect-error
            name = path.node.declaration.declarations[0].id.name
            break
          case 'FunctionDeclaration':
            name = path.node.declaration.id?.name
            break
          default:
            break
        }
        if (name) {
          const new_ast = newExportAst(fileName, name, name)
          //@ts-expect-error
          path.replaceWith(declaration)
          path.insertAfter(new_ast)
        } else if (path.node.specifiers && path.node.specifiers.length > 0) {
          const exportName = path.node.specifiers.map((target) => {
            return [
              // @ts-expect-error
              target?.local?.name || target?.exported?.name,
              // @ts-expect-error
              target?.exported?.name,
            ]
          })
          // export { a } from 'utils.js'
          if (path.node.source) {
            const modulePath = path.node.source.value
            const newAst = template.ast(
              `const __module_import_${count} = await __require("${modulePath}");`
            )
            exportName.forEach((target) => {
              const [localName, exportedName] = target
              const new_ast = newExportAst(
                fileName,
                exportedName,
                `__module_import_${count}.${localName}`
              )
              path.insertAfter(new_ast)
            })
            path.replaceWithMultiple(newAst)
            count++
            return
          } 
            exportName.forEach((target) => {
              const [localName, exportedName] = target
              const new_ast = newExportAst(fileName, exportedName, localName)
              path.insertAfter(new_ast)
            })
          

          path.remove()
        } else if (path.node.declaration) {
          // @ts-expect-error
          const { declarations } = path.node.declaration
          if (declarations) {
            // @ts-expect-error
            declarations.forEach((declaration) => {
              const { id } = declaration
              // @ts-expect-error
              const exportList =
                Array.isArray(id.properties) &&
                // @ts-expect-error
                id.properties.map((property) => {
                  return property.value.name || property.key.name
                })
              // @ts-expect-error
              exportList.forEach((value) => {
                const new_ast = newExportAst(fileName, value, value)
                path.insertAfter(new_ast)
              })
            })
          }
          path.replaceWith(path.node.declaration)
        }
      },
      ExportDefaultDeclaration(path: NodePath<types.ExportDefaultDeclaration>) {
        const declaration = path.node.declaration
        // @ts-expect-error
        const name = declaration?.id?.name || declaration?.name
        const new_ast = newExportAst(
          fileName,
          'default',
          name || generate(path.node.declaration)?.code
        )
        if (name) {
          // @ts-expect-error
          if (declaration?.id?.name) {
            path.replaceWith(declaration)
          }
          path.insertAfter(new_ast)
          // @ts-expect-error
          if (!declaration?.id?.name) {
            path.remove()
          }
        } else {
          // @ts-expect-error
          path.replaceWith(new_ast)
        }
      },
      ExportAllDeclaration(path: NodePath<types.ExportAllDeclaration>) {
        const modulePath = path.node.source.value
        const newAst = template.ast(
          `const __module_import = await __require("${modulePath}");\nObject.keys(__module_import).forEach(key => {\n  if (key !== "default") {\n    __exports("", key, __module_import[key]);\n  }\n});`
        )
        // @ts-expect-error
        path.replaceWithMultiple(newAst)
      },
    })

    // @ts-expect-error
    return transformFromAst(ast, code, {})?.code
  }
}

export const transFormCode = async (code: Record<string, string>) => {
  return traverseScriptCode(code)
}
