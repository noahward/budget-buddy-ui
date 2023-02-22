import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from 'stores/auth-store'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

export default boot(({ app, store }) => {
  const { user } = useAuthStore(store)
  if (user.data) {
    api.defaults.headers.common['Authorization'] = `Token ${user.data.token}`
  }

  // TODO: Are boolean environment variables possible?
  if (import.meta.env.VITE_LOG_REQUESTS === 'true') {
    api.interceptors.request.use(request => {
      console.log('Starting request:', request)
      return request
    })
  }

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
