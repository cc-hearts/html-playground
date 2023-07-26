import babel from '@babel/core'
// eslint-disable-next-line @typescript-eslint/ban-types
export function traverseScriptCode(code: Record<string, string | Function>) {
  return Object.keys(code).reduce((acc, keys) => {
    const newCode = transform(code[keys], keys) || ''
    acc[keys] = newCode
    return acc
  }, {})
}

export function transform(code, fileName = '') {
  const ast = babel.parse(code, {
    sourceType: 'module',
  })
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
          if (type === 'ImportDefaultSpecifier') {
            Reflect.set(acc, defaultKey, name)
          } else if (type === 'ImportSpecifier') {
            Reflect.set(acc, name, name)
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
              prefix = ''
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
          `const ${__importVariable} = __require("${importStringLiteral}");`,
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (new_ast) path.replaceWith(new_ast)
      },
      ExportNamedDeclaration(path) {
        // export const a = 1 ====> __exports(filename, name, value)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // const
        const declaration = path.node.declaration
        let name
        switch (path.node.declaration?.type) {
          case 'VariableDeclaration':
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            name = path.node.declaration.declarations[0].id.name
            break
          case 'FunctionDeclaration':
            name = path.node.declaration.id?.name
            break
          default:
            break
        }

        const new_ast = babel.template.ast(
          `__exports("${fileName}", "${name}", ${name});`,
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        path.replaceWith(declaration)
        path.insertAfter(new_ast)
      },
      ExportDefaultDeclaration(path) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const name = path.node.declaration.name
        const new_ast = babel.template.ast(
          `__exports('${fileName}','default', ${name})`,
        )
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        path.replaceWith(new_ast)
      },
    })
    return babel.transformFromAstSync(ast)?.code
  }
}
