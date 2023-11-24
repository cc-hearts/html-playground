<script setup lang="ts">
import { usePrefixCls } from '@/hooks/usePrefixCls'
import GithubIcon from '@/components/icons/github.vue'
import { githubUrl } from '@/configs'
import Link from '@/components/icons/Link.vue'
import ToggleDark from '@/components/switch/toggleDark.vue'
import { copy } from '@cc-heart/utils-client'
import { compile } from '@/utils/compile-helper'
import { showMessage } from '@/components/message/message';

const headerCls = usePrefixCls('header')
const toGithub = () => {
  if (githubUrl) window.open(githubUrl)
}

const handleCopyPages = () => {
  copy(location.href)
  showMessage('Sharable URL has been copied to clipboard.', 'success')
}
</script>

<template>
  <header class="flex justify-between items-center px-3" :class="[headerCls]">
    <slot name="left">
      <div></div>
    </slot>
    <div class="flex text-2xl items-center" :class="[`${headerCls}__icon`]">
      <slot name="right-icon"></slot>
      <GithubIcon @click="toGithub" />
      <Link @click="handleCopyPages" />
      <ToggleDark />
    </div>
  </header>
</template>

<style lang="scss">
@use '@/assets/scss/var/variable.scss' as var;

.#{var.$namespace}-header {
  height: 48px;
  flex-shrink: 0;
  box-shadow: 0 1px 0 var(--box-color-1);

  &__icon {
    color: var(--color-text-2);

    &>div,
    &>button,
    &>svg {
      margin: 0 0.5rem;
    }

    svg {
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--color-text-1);
      }
    }
  }
}
</style>
