<template>
  <section class="w-full h-full flex flex-col">
    <!-- header -->
    <div
      class="flex items-center p-x-4 border-b-1px border-b-solid border-b-#999 h-[var(--header-height)]"
    >
      <h1 class="text-4 font-500">Html Playground</h1>
    </div>

    <!-- playground -->
    <ClientOnly fallback-tag="div">
      <template #feedback> loading.... </template>

      <div class="flex-1 overflow-hidden">
        <Splitpanes
          @resize="handleToggleDraggableStatus(true)"
          @resized="handleToggleDraggableStatus(false)"
        >
          <Pane>
            <Splitpanes horizontal>
              <Pane>
                <CodeCard
                  v-model:model-value="htmlModules"
                  ref="htmlRef"
                  language="html"
                  v-model:active-tabs="activeHtmlActiveTab"
                  @change="lazyCompileBase64"
                />
              </Pane>
              <Pane>
                <div class="h-full w-full border">
                  <CodeCard
                    v-model:model-value="scriptModules"
                    ref="scriptRef"
                    :language="
                      activeScriptActiveTab === importMapTitle
                        ? 'json'
                        : 'javascript'
                    "
                    add-button
                    v-model:active-tabs="activeScriptActiveTab"
                    @add="handleAddScriptModules"
                    :disabledTitle="[importMapTitle]"
                    @remove="handleRemoveScriptModules"
                  >
                  </CodeCard>
                </div>
              </Pane>
              <Pane>
                <div class="h-full w-full">
                  <CodeCard
                    v-model="styleModules"
                    language="css"
                    ref="cssRef"
                    v-model:active-tabs="activeStyleActiveTab"
                    @change="lazyCompileBase64"
                  />
                </div>
              </Pane>
            </Splitpanes>
          </Pane>
          <Pane>
            <div class="h-full w-full">
              <Preview
                :entry="entry"
                :compiled-module="compiledScriptModule"
                :html-inner="htmlModules[activeHtmlActiveTab]"
                :importMap="scriptModules[importMapTitle] || ''"
                :css-inner="styleModules[activeStyleActiveTab]"
                :isDraggable="isDraggable"
              />
            </div>
          </Pane>
        </Splitpanes>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { defineDebounceFn, mulSplit } from '@cc-heart/utils'
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import CodeCard from '~/components/code-card/code-card.vue'
import Preview from '~/components/preview/preview.vue'

const defineModulesFactory = (initialActiveTabs: string) => {
  const modules = ref({} as Record<string, string>)
  const activeTabs = ref(initialActiveTabs)
  modules.value[activeTabs.value] = ''
  const compRef = ref()
  return { modules, activeTabs, compRef }
}
const entry = 'index.js'
const {
  modules: htmlModules,
  activeTabs: activeHtmlActiveTab,
  compRef: htmlRef,
} = defineModulesFactory('index.html')
const {
  modules: styleModules,
  activeTabs: activeStyleActiveTab,
  compRef: scriptRef,
} = defineModulesFactory('index.css')
const {
  modules: scriptModules,
  activeTabs: activeScriptActiveTab,
  compRef: cssRef,
} = defineModulesFactory(entry)
const importMapTitle = 'import map'
scriptModules.value[importMapTitle] = `\n
{
  "imports": {
    "@cc-heart/utils": "https://www.unpkg.com/@cc-heart/utils@5.1.1/dist/browser/index.js"
  }
}`

const compiledScriptModule = ref({})
const lazyWatchScriptModulesCompile = defineDebounceFn(async () => {
  const modules = { ...scriptModules.value }
  delete modules[importMapTitle]
  const newCode = await transFormCode(modules)
  Reflect.set(compiledScriptModule, 'value', newCode)
  lazyCompileBase64()
})

watch(
  () => scriptModules.value,
  () => {
    lazyWatchScriptModulesCompile()
  }
)

let scriptModuleCount = 0
const handleAddScriptModules = () => {
  let key = `script-${scriptModuleCount++}.js`
  const keys = Object.keys(scriptModules.value)
  while (keys.includes(key)) {
    key = `script-${scriptModuleCount++}.js`
  }
  scriptModules.value[key] = ''
  activeScriptActiveTab.value = key
}
const handleRemoveScriptModules = (title: string) => {
  if (title === activeScriptActiveTab.value) {
    activeScriptActiveTab.value = entry
  }
  delete scriptModules.value[title]
  lazyWatchScriptModulesCompile()
}

// ========== compile bas64 ========
const splitCode = '__HTML-PLAYGROUND__'
const compilerBase64 = () => {
  let compileStr = ''
  compileStr += `html:${htmlModules.value['index.html']}` + splitCode
  compileStr += `style:${styleModules.value['index.css']}` + splitCode
  const keys = Object.keys(scriptModules.value)
  for (const key of keys) {
    compileStr += `${key}:${scriptModules.value[key]}` + splitCode
  }
  return btoa(encodeURIComponent(compileStr))
}

function setBase64ForLocation(base64: string) {
  location.href = location.origin + location.pathname + '#' + base64
}

const lazyCompileBase64 = defineDebounceFn(() => {
  setBase64ForLocation(compilerBase64())
}, 500)

const deCodeBase64ToModules = () => {
  const matcher = location.hash.match(/[^#].*/g)?.[0]
  if (matcher) {
    const str = decodeURIComponent(atob(matcher))
    const modules = str.split(new RegExp(splitCode, 'g')).filter(Boolean)
    modules.forEach((module) => {
      let [key, value] = mulSplit(module, ':', 1)
      if (!key) return
      value ??= ''
      if (key === 'html') {
        htmlModules.value['index.html'] = value
        htmlRef.value?.setValueToMonaco(value)
      } else if (key === 'style') {
        styleModules.value['index.css'] = value
        cssRef.value?.setValueToMonaco(value)
      } else {
        scriptModules.value[key] = value
      }
    })
    scriptRef.value?.setValueToMonaco(
      scriptModules.value[activeScriptActiveTab.value] || ''
    )
    lazyWatchScriptModulesCompile()
  }
}

const isDraggable = ref(false)
const handleToggleDraggableStatus = (bool: boolean) => {
  isDraggable.value = bool
}

onMounted(() => {
  nextTick(() => {
    deCodeBase64ToModules()
  })
})
</script>
