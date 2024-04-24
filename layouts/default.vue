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
                <CodeCard />
              </Pane>
              <Pane>
                <div class="h-full w-full border"></div>
              </Pane>
              <Pane>
                <div class="h-full w-full">1</div>
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
import CodeCard from '~/components/code-card/code-card.vue';
import { PLAYGROUND_KEY } from '~/constants';

const htmlInner = ref()
const styleInner = ref()
const scriptModules = ref(new Map())

provide(PLAYGROUND_KEY, {
  htmlInner,
  styleInner,
  scriptModules
})
</script>

<style></style>