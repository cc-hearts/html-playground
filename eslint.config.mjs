import { typescript, vue } from '@cc-heart/eslint-config'
export default [
  ...typescript(),
  ...vue({
    typescript: true,
    autoImport: true,
  }),
]
