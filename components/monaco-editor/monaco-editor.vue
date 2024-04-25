<template>
  <div ref="monacoRef"></div>
</template>

<script lang="ts" setup>
import { MonacoEditorProps } from './helper'
import { editor } from 'monaco-editor'
import { defineDebounceFn } from '@cc-heart/utils'
import { setupAutoTagClose } from '~/components/monaco-editor/plugins/auto-tag-close'

const props = defineProps(MonacoEditorProps)

const monacoRef = ref()
let monacoEditorInstance: editor.IStandaloneCodeEditor | null = null

const updateMonacoValue = (value: string) => {
  monacoEditorInstance?.setValue(value)
}

watchEffect(() => {
  updateMonacoValue(props.modelValue)
})

const getValue = () => {
  return monacoEditorInstance?.getValue()
}
const emits = defineEmits(['update:modelValue'])
const debounceUpdateModelValue = defineDebounceFn(event => {
  emits('update:modelValue', getValue())
})

onMounted(() => {
  monacoEditorInstance = editor.create(monacoRef.value, {
    language: props.language,
    value: props.modelValue,
    folding: true,
    theme: props.theme,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    minimap: {
      enabled: props.minimapEnabled
    },
    automaticLayout: true,
    renderValidationDecorations: 'on'
  })

  setupAutoTagClose(monacoEditorInstance)
  monacoEditorInstance.onDidChangeModelContent(debounceUpdateModelValue)
})

watch(() => props.language, () => {
  if (monacoEditorInstance) {
    editor.setModelLanguage(monacoEditorInstance.getModel()!, props.language);
  }
})

defineExpose({
  updateMonacoValue,
  getValue
})
</script>
