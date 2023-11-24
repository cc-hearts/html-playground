<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="css">
html,
body,
#__nuxt {
  box-sizing: border-box;
  height: 100%;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

html.dark {
  color-scheme: dark;
}

#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: rgb(13, 148, 136);
  opacity: 0.75;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}

p {
  line-height: 1.8em;
}

.splitpanes__splitter {
  border-top: 0 !important;
  border-left:  0 !important;
}
</style>
