import { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import LocalRouters from '@/routes/index'
const router = createRouter({
  history: createWebHistory(),
  routes: [...LocalRouters, ...routes],
})

export const setup = ({ app }: { app: App }) => {
  console.log(routes)
  app.use(router)
}
