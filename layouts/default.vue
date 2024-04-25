<template>
  <section class="w-full h-full flex flex-col">
    <!-- header -->
    <div class="flex items-center p-x-4 border-b-1px border-b-solid border-b-#999 h-[var(--header-height)]">
      <h1 class="text-4 font-500">Html Playground</h1>
    </div>

    <!-- playground -->
    <ClientOnly fallback-tag="div">
      <template #feedback>
        loading....
      </template>

      <div class="flex-1 overflow-hidden">
        <Splitpanes>
          <Pane>
            <Splitpanes horizontal>
              <Pane>
                <CodeCard language="html" field="htmlModules" v-model:active-tabs="activeHtmlActiveTab"
                  />
              </Pane>
              <Pane>
                <div class="h-full w-full border">
                  <CodeCard :key="scriptModuleKeys"
                    :language="activeScriptActiveTab === importMapTitle ? 'json' : 'javascript'" add-button
                    field="scriptModules" v-model:active-tabs="activeScriptActiveTab" @add="handleAddScriptModules"
                    @change="lazyWatchScriptModulesCompile" :disabledTitle="[importMapTitle]"
                    @remove="handleRemoveScriptModules">

                  </CodeCard>
                </div>
              </Pane>
              <Pane>
                <div class="h-full w-full">
                  <CodeCard language="css" field="styleModules" v-model:active-tabs="activeStyleActiveTab"
                     />
                </div>
              </Pane>
            </Splitpanes>
          </Pane>
          <Pane>
            <div class="h-full">
              <Preview :entry="entry"  :compiled-module="compiledScriptModule"
                :html-inner="htmlModules.get(activeHtmlActiveTab)"
                :importMap="scriptModules.get(importMapTitle) || ''"
                :css-inner="styleModules.get(activeStyleActiveTab)" />
            </div>
          </Pane>
        </Splitpanes>
      </div>

    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { defineDebounceFn } from '@cc-heart/utils';
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import CodeCard from '~/components/code-card/code-card.vue'
import Preview from '~/components/preview/preview.vue';
import { PLAYGROUND_KEY } from '~/constants'

const defineModulesFactory = (initialActiveTabs: string) => {
  const modules = ref(new Map<string, string>())
  const activeTabs = ref(initialActiveTabs)
  modules.value.set(activeTabs.value, '')
  return { modules, activeTabs }
}
const entry = 'index.js'
const { modules: htmlModules, activeTabs: activeHtmlActiveTab } = defineModulesFactory('index.html')
const { modules: styleModules, activeTabs: activeStyleActiveTab } = defineModulesFactory('index.css')

const { modules: scriptModules, activeTabs: activeScriptActiveTab } = defineModulesFactory(entry)
const importMapTitle = 'import map'
scriptModules.value.set(importMapTitle, `\n
{
  "imports": {
    "@cc-heart/utils": "https://www.unpkg.com/@cc-heart/utils@5.1.1/dist/browser/index.js"
  }
}`)

const compiledScriptModule = ref({})
const lazyWatchScriptModulesCompile = defineDebounceFn(async () => {
  const modules = Object.fromEntries(scriptModules.value)
  delete modules[importMapTitle]
  const newCode = await transFormCode(modules)
  Reflect.set(compiledScriptModule, 'value', newCode)
})


let scriptModuleCount = 0
const scriptModuleKeys = ref(0)
const handleAddScriptModules = () => {
  let key = `script-${scriptModuleCount++}.js`
  while (scriptModules.value.has(key)) {
    key = `script-${scriptModuleCount++}.js`
  }
  scriptModules.value.set(key, '')
  activeScriptActiveTab.value = key
}
const handleRemoveScriptModules = (title: string) => {
  scriptModules.value.delete(title)
  scriptModuleKeys.value++
  if (title === activeScriptActiveTab.value) {
    activeScriptActiveTab.value = entry
  }
}
provide(PLAYGROUND_KEY, {
  htmlModules,
  styleModules,
  scriptModules
})
</script>

<style></style>