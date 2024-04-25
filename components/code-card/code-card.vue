<template>
  <div class="h-full w-full flex flex-col">
    <!-- tabs -->
    <div class="bg-#222222 color-#fff text-3.5 leading-8 flex items-center">
      <div class="code-card-add-button p-x-2 cursor-pointer" v-if="addButton" @click="handleAdd"> +</div>
      <div v-for="(item, index) in [...injectData[props.field].keys()]"
           class="code-card-title p-x-1.5 cursor-pointer box-border border-r-1px border-r-solid border-color-[#444] relative"
           :class="[
          index === 0 && 'border-l-1px border-l-solid border-l-color-[#444]',
          activeTabs === item && 'code-card-title-active'
        ]" @click="handleChangeActiveTabs(item)" @dblclick="handleChangeTitleStatus(index)">
        <input v-if="isModifyTitleIndex === index" :value="item" @blur="handleChangeFileTitle(item,$event)" />
        <template v-else>
          {{ item }}
        </template>
      </div>
    </div>
    <MonacoEditor ref="monacoEditorRef" class="flex-1" :language="language"
                  @update:modelValue="handleChangeScriptModelValue" />
  </div>
</template>

<script setup lang="ts">
import { MonacoEditor } from '../monaco-editor'
import { inject, watch, watchEffect } from 'vue'
import { PLAYGROUND_KEY } from '~/constants'

interface Props {
  field: string
  activeTabs: string
  addButton?: boolean
  language: string
}

const props = withDefaults(defineProps<Props>(), {
  addButton: false
})
const injectData = inject(PLAYGROUND_KEY, {
  [props.field]: new Map()
})

const monacoEditorRef = ref()

watch(() => props.activeTabs, activeTabs => {
  if (monacoEditorRef.value) {
    const value = injectData[props.field].get(props.activeTabs) || ''
    monacoEditorRef.value.updateMonacoValue(value)
  }
})


const emits = defineEmits(['update:activeTabs', 'add', 'change'])
const handleChangeActiveTabs = (activeName: string) => {
  emits('update:activeTabs', activeName)
}

const handleAdd = () => {
  emits('add')
}

const isModifyTitleIndex = ref<number | null>(null)
const handleChangeTitleStatus = (index: number) => {
  if (index === 0) return
  isModifyTitleIndex.value = index
}
const handleChangeFileTitle = (fileTitle: string, evt: FocusEvent) => {
  const map = injectData[props.field]
  const value = map.get(fileTitle)
  map.delete(fileTitle)
  const newFileName = (evt.target as HTMLInputElement).value
  map.set(newFileName, value)
  if (props.activeTabs === fileTitle) {
    emits('update:activeTabs', newFileName)
  }

  isModifyTitleIndex.value = null
}
const handleChangeScriptModelValue = (value: string) => {
  const map = injectData[props.field]
  map.set(props.activeTabs, value)
  emits('change')
}
</script>

<style lang="scss">
.code-card-title {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 2px;
    background-color: transparent;
    transition: background-color .15s;
  }

  &-active {
    &::after {
      background-color: #7074f6;
    }
  }
}

.splitpanes__splitter {
  padding: 4px 0;
}
</style>