import { Request } from '@cc-heart/utils-client'
import { params } from 'node_modules/@cc-heart/utils-client/dist/types/src/utils/request'

const request = new Request('http://114.55.225.186:30083')

export function Post<T, U extends params = params>(
  url: string,
  params?: U,
  requestInit?: RequestInit,
) {
  return request.Post<T>(url, params, requestInit)
}
