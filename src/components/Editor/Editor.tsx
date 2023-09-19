import { ref, defineComponent, onMounted, watch, toRaw } from 'vue'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { isDark } from '@/configs'
export default defineComponent({
  props: {
    lang: {
      type: String,
      default: 'javascript',
    },
    value: {
      type: String,
      default: null,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const macroEl = ref<HTMLDivElement | null>(null)
    const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
    const macroValue = ref<string | undefined>('')
    function getTheme() {
      return isDark.value ? 'vs-dark' : 'vs'
    }

    const getVal = () => {
      const val = toRaw(editor.value)?.getValue()
      macroValue.value = val
      emit('change', val)
    }

    onMounted(() => {
      editor.value = monaco.editor.create(macroEl.value!, {
        value: '',
        language: props.lang,
        minimap: { enabled: false },
        theme: getTheme(),
      })

      if (editor.value) {
        editor.value.onDidChangeModelContent(() => {
          getVal()
        })
        if (props.value !== null) {
          updateMacroValue(props.value)
        }
      }
    })

    watch(
      () => isDark.value,
      () => {
        editor.value!.updateOptions({
          theme: getTheme(),
        })
      },
    )

    function updateMacroValue(val: string) {
      toRaw(editor.value)?.setValue(val)
      macroValue.value = val
    }
    watch(
      () => props.value,
      (val) => {
        if (val !== macroValue.value) {
          updateMacroValue(val)
        }
      },
    )

    return () => <div style={{ height: '100%' }} ref={macroEl}></div>
  },
})
