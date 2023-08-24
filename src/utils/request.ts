import { Request } from '@cc-heart/utils-client'
import { params } from 'node_modules/@cc-heart/utils-client/dist/types/src/utils/request'

const request = new Request('https://playground.jxwazx.cn')

export function Post<T, U extends params = params>(
  url: string,
  params?: U,
  requestInit?: RequestInit,
) {
  return request.Post<T>(url, params, requestInit)
}
