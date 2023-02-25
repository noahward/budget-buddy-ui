import { api } from 'boot/axios'
import { User } from '../models/user.model'
import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'

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
      return api.post('/auth/login', userInfo)
        .then((response) => {
          this.user = response.data
          LocalStorage.set('user', response.data)
          this.router.push('/accounts')
        })
        .catch((error) => {
          return error
        })
    },
    async register (userInfo: object) {
      return api.post('/auth/register', userInfo)
        .then((response) => {
          this.user = response.data
          LocalStorage.set('user', response.data)
          this.router.push('/accounts')
        })
        .catch((error) => {
          console.error(error)
          throw error
        })
    },
    async logout () {
      return api.post('/auth/logout/')
        .catch((error) => {
          console.log('Auth store error')
          console.error(error)
          throw error
        })
        .finally(() => {
          this.router.push('/login')
          LocalStorage.remove('user')
          this.user = {}
        })
    }
  }
})
