import { ref } from 'vue'

export const prefixCls = 'cc'
export const isDev = process.env.NODE_ENV === 'development'
export const isProd = process.env.NODE_ENV === 'production'
export const isDark = ref(false)

export const githubUrl = 'https://github.com/cc-hearts/html-playground.git'
