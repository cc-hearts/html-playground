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

      <div class="flex-1">
        <Splitpanes>
          <Pane>
            <Splitpanes horizontal>
              <Pane>
                <CodeCard language="html" field="htmlModules" v-model:active-tabs="activeHtmlActiveTab" />
              </Pane>
              <Pane>
                <div class="h-full w-full border">
                  <CodeCard language="javascript" add-button field="scriptModules" v-model:active-tabs="activeScriptActiveTab"
                  @add="handleAddScriptModules"/>
                </div>
              </Pane>
              <Pane>
                <div class="h-full w-full">
                  <CodeCard language="css" field="styleModules" v-model:active-tabs="activeStyleActiveTab" />
                </div>
              </Pane>
            </Splitpanes>
          </Pane>
          <Pane>
            <div class="h-full"></div>
          </Pane>
        </Splitpanes>
      </div>

    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
import CodeCard from '~/components/code-card/code-card.vue'
import { PLAYGROUND_KEY } from '~/constants'

const htmlModules = ref(new Map())
const activeHtmlActiveTab = ref('index.html')
htmlModules.value.set(activeHtmlActiveTab.value, '')

const styleModules = ref(new Map())
const activeStyleActiveTab = ref('index.css')
styleModules.value.set(activeStyleActiveTab.value, '')

const scriptModules = ref(new Map())
const activeScriptActiveTab = ref('index.js')
scriptModules.value.set(activeScriptActiveTab.value, '')
console.log(scriptModules);

let scriptModuleCount = 0
const handleAddScriptModules = () => {
  let key = `script-${scriptModuleCount++}.js`
  while (scriptModules.value.has(key)) {
    key = `script-${scriptModuleCount++}.js`
  }
  scriptModules.value.set(key, '')
  activeScriptActiveTab.value = key
}
provide(PLAYGROUND_KEY, {
  htmlModules,
  styleModules,
  scriptModules
})
</script>

<style></style>