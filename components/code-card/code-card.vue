<script setup lang="ts">
import { hasOwn } from '@cc-heart/utils'
import { watch } from 'vue'
import { MonacoEditor } from '../monaco-editor'

interface Props {
  activeTabs: string
  addButton?: boolean
  language: string
  disabledTitle?: Array<string>
  modelValue: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  addButton: false,
  disabledTitle: () => [],
  modules: () => ({}),
})

const emits = defineEmits([
  'update:activeTabs',
  'add',
  'change',
  'remove',
  'update:modelValue',
])

const vFocus = {
  mounted: (el: HTMLElement) => el.focus?.(),
}

const monacoEditorRef = ref()
const calcTitleList = computed(() => Object.keys(props.modelValue))

watch(
  () => props.activeTabs,
  (activeTabs) => {
    if (monacoEditorRef.value && hasOwn(props.modelValue, activeTabs)) {
      const value = props.modelValue[activeTabs] || ''
      monacoEditorRef.value.updateMonacoValue(value)
    }
  }
)

const handleChangeActiveTabs = (activeName: string) => {
  emits('update:activeTabs', activeName)
}

const handleAdd = () => {
  emits('add')
}

const isModifyTitleIndex = ref<number | null>(null)
const handleChangeTitleStatus = (index: number, title: string) => {
  if (index === 0 || props.disabledTitle.includes(title)) return
  isModifyTitleIndex.value = index
}
const handleChangeFileTitle = (fileTitle: string, evt: FocusEvent) => {
  const value = props.modelValue[fileTitle]
  const newFileName = (evt.target as HTMLInputElement).value
  isModifyTitleIndex.value = null
  if (fileTitle === newFileName) return

  const filenameList = Object.keys(props.modelValue).filter(
    (title) => title !== fileTitle
  )
  const newModelValue = filenameList.reduce((acc, key) => {
    Reflect.set(acc, key, props.modelValue[key])
    return acc
  }, {})
  Reflect.set(newModelValue, newFileName, value)
  emits('update:modelValue', newModelValue)
  if (props.activeTabs === fileTitle) {
    emits('update:activeTabs', newFileName)
  }
}

const handleChangeScriptModelValue = (value: string) => {
  if (!hasOwn(props.modelValue, props.activeTabs)) return

  const oldValue = props.modelValue[props.activeTabs]
  if (oldValue !== value) {
    const newModelValue = { ...props.modelValue }
    Reflect.set(newModelValue, props.activeTabs, value)
    emits('update:modelValue', newModelValue)
    emits('change')
  }
}

const removeTitle = (title: string) => {
  emits('remove', title)
}
const setValueToMonaco = (value: string) => {
  if (monacoEditorRef.value) {
    monacoEditorRef.value.updateMonacoValue(value)
  }
}
defineExpose({
  setValueToMonaco,
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <!-- tabs -->
    <div class="flex">
      <div
        class="bg-#222222 text-3.5 leading-8 flex items-center overflow-x-auto"
      >
        <div
          v-if="addButton"
          class="code-card-add-button p-x-2 cursor-pointer"
          @click="handleAdd"
        >
          +
        </div>
        <div
          v-for="(item, index) in calcTitleList"
          :key="index"
          class="code-card-title p-x-1.5 cursor-pointer box-border border-r-1px border-r-solid border-color-[#444] relative"
          :class="[
            index === 0 && 'border-l-1px border-l-solid border-l-color-[#444]',
            activeTabs === item && 'code-card-title-active',
          ]"
          @click="handleChangeActiveTabs(item)"
          @dblclick="handleChangeTitleStatus(index, item)"
        >
          <input
            v-if="isModifyTitleIndex === index"
            v-focus
            class="bg-transparent border-none outline-none color-inherit border-b border-b-solid border-b-[#444]"
            :value="item"
            @blur="handleChangeFileTitle(item, $event)"
          />
          <template v-else>
            <div>
              {{ item }}
              <button
                v-if="index > 0 && !disabledTitle.includes(item)"
                class="color-inherit bg-transparent border-0 m-l-1 hover:bg-#707070 hover:color-#eee p-x-1 rounded-2px cursor-pointer transition"
                @click.stop="removeTitle(item)"
              >
                ×
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <MonacoEditor
      ref="monacoEditorRef"
      class="flex-1"
      :language="language"
      @update:model-value="handleChangeScriptModelValue"
    />
  </div>
</template>

<style lang="scss">
.code-card-title {
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
    height: 2px;
    background-color: transparent;
    transition: background-color 0.15s;
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
