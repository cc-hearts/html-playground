import { Post } from '@/utils/request'

export const transFormCode = (code: Record<string, string>) => {
  const { data } = Post('/', code)
  return data
}

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
