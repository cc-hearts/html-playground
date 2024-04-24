<template>
  <div class="h-full w-full flex flex-col">
    <!-- tabs -->
    <div class="bg-#222222 color-#fff text-3.5 leading-8 flex items-center">
      <div class="code-card-add-button p-x-2 cursor-pointer" v-if="addButton" @click="handleAdd"> + </div>
      <div v-for="(item, index) in calcTitle"
        class="code-card-title p-x-1.5 cursor-pointer box-border border-r-1px border-r-solid border-color-[#444] relative"
        :class="[
          index === 0 && 'border-l-1px border-l-solid border-l-color-[#444]',
          activeTabs === item && 'code-card-title-active'
        ]" @click="handleChangeActiveTabs(item)" @dblclick="handleChangeTitleStatus(index)">
        {{ item }}
      </div>
    </div>
    <MonacoEditor class="flex-1" :language="language" @update:modelValue="handleChangeScriptModelValue" />
  </div>
</template>

<script setup lang="ts">
import { MonacoEditor } from '../monaco-editor'
import { inject } from 'vue'
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
  [props.field]: ref(new Map())
})

const calcTitle = computed(() => {
  return [...injectData[props.field].value.keys()]
})

const isModifyTitle = ref(null)
const emits = defineEmits(['update:activeTabs', 'add'])
const handleChangeActiveTabs = (activeName: string) => {
  emits('update:activeTabs', activeName)
}

const handleAdd = () => {
  emits('add')
}

const handleChangeTitleStatus = (index: number) => {
  console.log('-------', index)
}
const handleChangeScriptModelValue = (value: string) => {
  const map = injectData[props.field].value
  map.set(props.activeTabs, value)
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