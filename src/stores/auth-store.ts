import { api } from 'boot/axios'
import { defineStore } from 'pinia'


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || '{}')
  }),
  actions: {
    async login (userInfo: object) {
      try {
        const user = await api.post('/login', userInfo)
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
        return { status: 'success', msg: 'User logged in' }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async logout () {
      try {
        await api.post('/logout', { token: this.user.token })
        this.user = null
        return { status: 'success', msg: 'User logged out' }
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
})
