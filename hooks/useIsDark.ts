export function useIsDark() {
  if (typeof window === 'undefined') return false
  const el = document.documentElement
  const token = el.classList
  return token.contains('dark')
}
