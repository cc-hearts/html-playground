import { traverseScriptCode } from '../utils/helper'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return traverseScriptCode(body)
})
