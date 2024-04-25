/* eslint-disable @typescript-eslint/ban-ts-comment */
import babel from '@babel/core'
import generate from '@babel/generator'

export function traverseScriptCode(code: Record<string, string>) {
  return Object.keys(code).reduce((acc, keys) => {
    const newCode = transform(code[keys] as string, keys) || ''
    Reflect.set(acc, keys, newCode)
    return acc
  }, {})
}

const newExportAst = (fileName: string, name: string, value: string) => {
  return babel.template.ast(`__exports("${fileName}", "${name}", ${value});`)
}

export function transform(code: string, fileName = '') {
  const ast = babel.parse(code, {
    sourceType: 'module',
  })
  let count = 1
  if (ast) {
    babel.traverse(ast, {
      ImportDeclaration(path) {
        const importStringLiteral = path.node.source.value
        const defaultKey = Symbol('default')
        let isExistsNamespaceKey = false
        const namespaceKey = Symbol('namespace')
        const __import = path.node.specifiers.reduce<
          Record<string | symbol, string>
        >((acc, specifiers) => {
          const { type } = specifiers
          const name = specifiers.local.name
          // @ts-ignore
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
        const new_ast = babel.template.ast(
          `const ${__importVariable} = await __require("${importStringLiteral}");`,
        )
        // @ts-ignore
        if (new_ast) path.replaceWith(new_ast)
      },
      ExportNamedDeclaration(path) {
        // export const a = 1 ====> __exports(filename, name, value)
        const declaration = path.node.declaration
        let name
        switch (path.node.declaration?.type) {
          case 'VariableDeclaration':
            // @ts-ignore
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
          //@ts-ignore
          path.replaceWith(declaration)
          path.insertAfter(new_ast)
        } else if (path.node.specifiers && path.node.specifiers.length > 0) {
          const exportName = path.node.specifiers.map((target) => {
            return [
              // @ts-ignore
              target?.local?.name || target?.exported?.name,
              // @ts-ignore
              target?.exported?.name,
            ]
          })
          // export { a } from 'utils.js'
          if (path.node.source) {
            const modulePath = path.node.source.value
            const newAst = babel.template.ast(
              `const __module_import_${count} = await __require("${modulePath}");`,
            )
            exportName.forEach((target) => {
              const [localName, exportedName] = target
              const new_ast = newExportAst(
                fileName,
                exportedName,
                `__module_import_${count}.${localName}`,
              )
              path.insertAfter(new_ast)
            })
            path.replaceWithMultiple(newAst)
            count++
            return
          } else {
            exportName.forEach((target) => {
              const [localName, exportedName] = target
              const new_ast = newExportAst(fileName, exportedName, localName)
              path.insertAfter(new_ast)
            })
          }

          path.remove()
        } else if (path.node.declaration) {
          // @ts-ignore
          const { declarations } = path.node.declaration
          if (declarations) {
            // @ts-ignore
            declarations.forEach((declaration) => {
              const { id } = declaration
              // @ts-ignore
              const exportList =
                Array.isArray(id.properties) &&
                // @ts-ignore
                id.properties.map((property) => {
                  return property.value.name || property.key.name
                })
              // @ts-ignore
              exportList.forEach((value) => {
                const new_ast = newExportAst(fileName, value, value)
                path.insertAfter(new_ast)
              })
            })
          }
          path.replaceWith(path.node.declaration)
        }
      },
      ExportDefaultDeclaration(path) {
        const declaration = path.node.declaration
        // @ts-ignore
        const name = declaration?.id?.name || declaration?.name
        const new_ast = newExportAst(
          fileName,
          'default',
          name || generate(path.node.declaration)?.code,
        )
        if (name) {
          // @ts-ignore
          if (declaration?.id?.name) {
            path.replaceWith(declaration)
          }
          path.insertAfter(new_ast)
          // @ts-ignore
          if (!declaration?.id?.name) {
            path.remove()
          }
        } else {
          // @ts-ignore
          path.replaceWith(new_ast)
        }
      },
      ExportAllDeclaration(path) {
        const modulePath = path.node.source.value
        const newAst = babel.template.ast(
          `const __module_import = await __require("${modulePath}");\nObject.keys(__module_import).forEach(key => {\n  if (key !== "default") {\n    __exports("", key, __module_import[key]);\n  }\n});`,
        )
        // @ts-ignore
        path.replaceWithMultiple(newAst)
      },
    })
    return babel.transformFromAstSync(ast)?.code
  }
}
