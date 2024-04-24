<template>
  <div ref="monacoRef"></div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { MonacoEditorProps } from './helper'
// /esm/vs/editor/editor.api
import * as monaco from 'monaco-editor'

const props = defineProps(MonacoEditorProps)

const monacoRef = ref()
let monacoEditorInstance: monaco.editor.IStandaloneCodeEditor | null = null

const updateMonacoValue = (value: string) => {
  monacoEditorInstance?.setValue(value)
}

const getValue = () => {
  return monacoEditorInstance?.getValue()
}

onMounted(() => {
  console.log(props.language)
  monacoEditorInstance = monaco.editor.create(monacoRef.value, {
    language: 'javascript',
    value: '',
    folding: true,
    theme: props.theme,
    scrollbar: {
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
    },
    minimap: {
      enabled: props.minimapEnabled,
    },
    renderValidationDecorations: 'on',
  })
})

defineExpose({
  updateMonacoValue,
  getValue,
})
</script>
