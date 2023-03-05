import { api } from 'boot/axios'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { User, UserData } from '../models/user.model'
import { camelizeKeys, decamelizeKeys } from 'humps'

interface UserState {
  user: User | Record<string, never>;
}

export const useAuthStore = defineStore('auth', {
  state: (): UserState => ({
    user: LocalStorage.getItem('user') || {}
  }),
  actions: {
    // TODO: Abstract common logic between register and login functions
    async login (userInfo: object) {
      return api.post('/auth/login', decamelizeKeys(userInfo))
        .then((response) => {
          this.user = camelizeKeys(response.data) as User
          api.defaults.headers.common.Authorization = `Token ${response.data.token.key}`
          LocalStorage.set('user', camelizeKeys(response.data))
          this.router.push('/accounts')
        })
        .catch((error) => {
          throw error
        })
    },
    async register (userInfo: object) {
      return api.post('/auth/register', decamelizeKeys(userInfo))
        .then((response) => {
          this.user = camelizeKeys(response.data) as User
          api.defaults.headers.common.Authorization = `Token ${response.data.token.key}`
          LocalStorage.set('user', camelizeKeys(response.data))
          this.router.push('/accounts')
        })
        .catch((error) => {
          throw error
        })
    },
    async logout () {
      return api.post('/auth/logout/')
        .then(() => {
          delete api.defaults.headers.common.Authorization
          this.router.push('/login')
        })
        .catch((error) => {
          throw error
        })
        .finally(() => {
          LocalStorage.remove('user')
          this.user = {}
        })
    },
    async updateUser (userInfo: object) {
      return api.patch('/auth/user', decamelizeKeys(userInfo))
        .then((response) => {
          this.user.profile = camelizeKeys(response.data) as UserData
          LocalStorage.set('user', this.user)
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
