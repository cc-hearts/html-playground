<template>
  <div class="h-full w-full flex flex-col">
    <!-- tabs -->
    <div class="flex">
      <div class="bg-#222222 text-3.5 leading-8 flex items-center overflow-x-auto">
        <div class="code-card-add-button p-x-2 cursor-pointer" v-if="addButton" @click="handleAdd"> +</div>
        <div v-for="(item, index) in Object.keys(injectData[props.field].value)"
          class="code-card-title p-x-1.5 cursor-pointer box-border border-r-1px border-r-solid border-color-[#444] relative"
          :class="[
            index === 0 && 'border-l-1px border-l-solid border-l-color-[#444]',
            activeTabs === item && 'code-card-title-active'
          ]" @click="handleChangeActiveTabs(item)" @dblclick="handleChangeTitleStatus(index, item)">
          <input v-if="isModifyTitleIndex === index" :value="item" @blur="handleChangeFileTitle(item, $event)" />
          <template v-else>

            <div>
              {{ item }}
              <button
                class="color-inherit bg-transparent border-0 m-l-1 hover:bg-#707070 hover:color-#eee p-x-1 rounded-2px cursor-pointer transition"
                @click="removeTitle(item)" v-if="index > 0 && !disabledTitle.includes(item)">×</button>
            </div>

          </template>
        </div>
      </div>

    </div>
    <MonacoEditor ref="monacoEditorRef" class="flex-1" :language="language"
      @update:modelValue="handleChangeScriptModelValue" />
  </div>
</template>

<script setup lang="ts">
import { inject, watch } from 'vue';
import { PLAYGROUND_KEY } from '~/constants';
import { MonacoEditor } from '../monaco-editor';

interface Props {
  field: string
  activeTabs: string
  addButton?: boolean
  language: string
  disabledTitle?: Array<string>
}

const props = withDefaults(defineProps<Props>(), {
  addButton: false,
  disabledTitle: () => []
})

const injectData = inject(PLAYGROUND_KEY, {
  [props.field]: ref({} as Record<string, string>)
})

const monacoEditorRef = ref()

watch(() => props.activeTabs, () => {
  if (monacoEditorRef.value) {
    const value = injectData[props.field].value[props.activeTabs] || ''
    monacoEditorRef.value.updateMonacoValue(value)
  }
})

const emits = defineEmits(['update:activeTabs', 'add', 'change', 'remove'])
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
  const map = injectData[props.field]
  const value = map.value[fileTitle]
  delete map.value[fileTitle]
  const newFileName = (evt.target as HTMLInputElement).value
  map.value[newFileName] = value
  if (props.activeTabs === fileTitle) {
    emits('update:activeTabs', newFileName)
  }
  isModifyTitleIndex.value = null
}

const handleChangeScriptModelValue = (value: string) => {
  const map = injectData[props.field]
  const oldValue = map.value[props.activeTabs]
  if (oldValue !== value) {
    map.value[props.activeTabs] = value
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
  setValueToMonaco
})
</script>

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