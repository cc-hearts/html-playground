import { Post } from '@/utils/request'

export const transFormCode = (code: Record<string, string>) => {
  const { data } = Post('/', code)
  return data
}

interface Compile {
  (): string
  __compile?: () => string
}
export const compile: Compile = () => {
  if (compile.__comp instanceof Function) {
    return compile.__comp()
  }
  return null
}

export const registerCompile = (fn: () => string) => {
  compile.__comp = fn
}
