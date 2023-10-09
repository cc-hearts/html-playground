import { defineConfig } from 'unocss'

export default defineConfig({
  // ...
  rules: [
    [
      'h-full-1',
      {
        'height': "calc(100% - 1px)"
      }
    ]
  ]
})
