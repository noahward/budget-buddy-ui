import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'stores/auth-store'
import axios, { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

export default boot(({ router, store }) => {
  const { user } = useAuthStore(store)
  if (Object.keys(user).length !== 0) {
    api.defaults.headers.common.Authorization = `Token ${user.token}`
  }

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        router.push('/login')
      }
    }
  )

  // TODO: Are boolean environment variables possible?
  if (import.meta.env.VITE_LOG_REQUESTS === 'true') {
    api.interceptors.request.use(request => {
      console.log('Starting request:', request)
      return request
    })
  }
})

export { api }
