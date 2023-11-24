export function setBase64ForLocation(base64: string) {
  location.href = location.origin + location.pathname + '#' + base64
}
