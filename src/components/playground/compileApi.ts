import { Post } from '@/utils/request'

export const transFormCode = (code: Record<string, string>) => {
  const { data } = Post('/', code)
  return data
}
