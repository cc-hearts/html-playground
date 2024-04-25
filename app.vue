<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}


body,
html,
#__nuxt {
  width: 100%;
  height: 100%;
}

body {
  background: var(--global-bg-color);
  color: var(--text-color);
}


iframe {
  border: none;
}

.splitpanes__splitter {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;

  border-top: 1px solid var(--divider-color);
  border-bottom: 1px solid var(--divider-color);


  &::after,
  &::before {
    content: '';
    width: 32px;
    height: 1px;
    background: var(--split-bg-color);
  }
}

.splitpanes--vertical {
  &>.splitpanes__splitter {
    flex-direction: row;
    padding: 0 4px;
    border-left: 1px solid var(--divider-color);
    border-right: 1px solid var(--divider-color);

    &::after,
    &::before {
      width: 1px;
      height: 32px;
    }
  }
}
</style>