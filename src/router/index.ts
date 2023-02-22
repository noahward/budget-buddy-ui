import { route } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth-store'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router'
import routes from './routes'


export default route(function ( { store } ) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(( to, from ) => {
    const { user } = useAuthStore(store)
    if (to.meta.requiresAuth && !user.data) return '/login'
    else if (!to.meta.requiresAuth && user.data) return from
  })

  return Router
})
