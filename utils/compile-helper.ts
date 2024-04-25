export const compile: (() => string | null) & {
  __comp?: () => string
} = () => {
  if (compile.__comp instanceof Function) {
    return compile.__comp()
  }
  return null
}

export const registerCompile = (fn: () => string) => {
  compile.__comp = fn
}

export const transFormCode = async (code: Record<string, string>) => {
  return await $fetch('/api/compile', {
    method: 'POST',
    body: JSON.stringify(code),
  })
}
