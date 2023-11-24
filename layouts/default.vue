<script setup lang="ts">
import Headers from '@/components/Header/header.vue'
</script>
<template>
  <main class="flex flex-col h-full w-full text-gray-700 dark:text-gray-200">
    <Headers>
      <template #left>
        <h1>HTML Playground</h1>
      </template>
    </Headers>
    <slot />
  </main>
</template>
<style lang="scss"></style>
