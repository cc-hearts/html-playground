
export function copyText(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
    return
  }
  console.warn('clipboard is not exist of navigator')
}