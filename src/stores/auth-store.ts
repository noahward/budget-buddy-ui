import { api } from 'boot/axios'
import { defineStore } from 'pinia'
import { User } from '../models/user.model'

interface UserState {
  user: User | Record<string, never>;
}

export const useAuthStore = defineStore('auth', {
  state: (): UserState => ({
    user: JSON.parse(localStorage.getItem('user') || '{}')
  }),
  actions: {
    async login (userInfo: object) {
      try {
        const user = await api.post('/auth/login', userInfo)
        this.user = user.data
        localStorage.setItem('user', JSON.stringify(user))
        this.router.push('/accounts')
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async register (userInfo: object) {
      try {
        const user = await api.post('/auth/register', userInfo)
        this.user = user.data
        localStorage.setItem('user', JSON.stringify(user))
        this.router.push('/accounts')
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async logout () {
      try {
        await api.post('/auth/logout/')
        this.router.push('/login')
      } catch (error) {
        console.error(error)
        throw error
      } finally {
        localStorage.removeItem('user')
        this.user = {}
      }
    }
  }
})
