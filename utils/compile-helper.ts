export const transFormCode = async (code: Record<string, string>) => {
  return await $fetch('/api/compile', {
    method: 'POST',
    body: JSON.stringify(code),
  })
}
