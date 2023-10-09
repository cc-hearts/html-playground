<script setup lang="ts">
import { ref, watch } from 'vue'
import { isDark } from '~/configs/constant'
const value = ref('')

function getTheme() {
  return isDark.value ? 'vs-dark' : 'vs'
}

const editorRef = ref(null)
const theme = ref(getTheme())

const props = withDefaults(
  defineProps<{
    value?: string
    lang?: string
    onChange?: (e: string) => any
  }>(),
  {
    lang: 'javascript',
    value: '',
  },
)

value.value = props.value || ''

const emits = defineEmits<{
  (e: 'update:modalValue', val: string): any
  (e: 'change', val: string): any
}>()

watch(
  () => props.value,
  (val) => {
    if (val !== value.value) {
      value.value = val!
    }
  },
  {
    immediate: true,
  },
)

watch(
  () => isDark.value,
  () => {
    theme.value = getTheme()
    // @ts-ignore
    editorRef.value!.$editor.updateOptions({
      theme: theme.value,
    })
  },
)

watch(value, (val) => {
  emits('update:modalValue', val)
  emits('change', val)
})

onMounted(() => {
  // @ts-ignore
  editorRef.value!.$editor.updateOptions({
    minimap: { enabled: false },
  })
})
</script>
<template>
  <MonacoEditor
    class="h-full w-full cc-monaco"
    style="height: 100%"
    v-model="value"
    :lang="lang"
    ref="editorRef"
    theme="vs-dark"
  />
</template>
<style lang="scss">
.cc-monaco {
  .monaco-editor {
    width: 100% !important;
    height: 100% !important;
    & > div {
      width: 100% !important;
    }
  }
}
</style>
