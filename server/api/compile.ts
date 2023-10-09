import { traverseScriptCode } from '../utils/compile-helper'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return traverseScriptCode(body)
})
