import { defineComponent, watch, ref } from 'vue'
import '@/assets/scss/components/preview.scss'
import { useDebounce } from '@/hooks/useDebounce'
import { isDark } from '@/configs'
export default defineComponent({
  name: 'Preview',
  props: {
    html: {
      type: String,
      default: '',
    },
    style: {
      type: String,
      default: '',
    },
    compileModule: {
      type: Object,
      default: () => ({}),
    },
    entry: {
      type: String,
      default: 'app.js',
    },
    importMap: {
      type: String,
      default: '{}',
    },
  },
  setup(props) {
    const srcDoc = ref('')
    function getBackground() {
      return getComputedStyle(document.body).backgroundColor
    }
    function getColor() {
      return getComputedStyle(document.body).color
    }

    const importMapFields = computed(() => {
      if (!props.importMap) return '[]'
      const imports = JSON.parse(props.importMap)?.imports || {}
      return `[${Object.keys(imports)
        .map((target) => `'${target}'`)
        .join(',')}]`
    })

    const updateSrcDoc = () => {
      const code = JSON.stringify(props.compileModule)
      srcDoc.value = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/vite.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>test</title>
          <style>
            html,body {
              color: ${getColor()};
              background-color: ${getBackground()};
            }
          </style>
          <style>
            ${props.style}
          </style>
        </head>
        <body>
          <div id="app-iframe">
            ${props.html}
          </div>
          <script type="importmap">
               ${props.importMap}
          </script>
          <script type="module">
          const __import__map = ${importMapFields.value}
          async function __require(keys) {
            if (__exports._map[keys]) {
              return __exports._map[keys];
            }
            const func = __require._map[keys];
            if (func instanceof Function) {
              func(__require, __exports);
              return __exports._map[keys] || {};
            }
            // is exist import Map ?
            if (__import__map.includes(keys)) {
              return import(keys);
            }
            return {};
          }
          __require._map = {};

          function __exports(fileName, type, value) {
            if (!__exports._map[fileName]) {
              __exports._map[fileName] = {};
            }
            __exports._map[fileName][type] = value;
          }
          __exports._map = {};
          const code = ${code}
          const entry = "${props.entry}"
          Object.keys(code).forEach(keys => {
            __require._map[keys] = new Function("__require", "__exports", "(async () => {" + code[keys] + "\\n" + "})()")
          })
          __require._map[entry]?.(__require, __exports)
          </script>
        </body>
      </html>
    `
    }

    const updateSrcDebounce = useDebounce(updateSrcDoc)
    watch(
      [() => props.html, () => props.style, () => props.compileModule],
      () => {
        updateSrcDebounce()
      },
    )
    watch(() => isDark.value, updateSrcDoc)
    return () => (
      <div class="preview w-full h-full box-border">
        <iframe
          sandbox="allow-scripts"
          class="w-full h-full"
          srcdoc={srcDoc.value}
        />
      </div>
    )
  },
})
