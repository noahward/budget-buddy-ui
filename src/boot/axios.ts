import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from 'stores/auth-store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
interface APIConfig {
  baseURL: string | undefined;
  Authorization?: string
}

const config: APIConfig = { baseURL: import.meta.env.VITE_API_BASE_URL }
const { user } = useAuthStore()

if (user?.token) {
  config.Authorization = `Token ${user.token}`
}

const api = axios.create(config)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
