import { defineStore } from 'pinia'
// TODO: How to import router in store
// import { router } from 'router'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // TODO: Check if the below line is bad practice
    user: JSON.parse(localStorage.getItem('user') as string),
    redirectUrl: undefined
  }),
  actions: {
    async login (userInfo: object) {
      try {
        const user = await api.post('/login', { userInfo })
        this.user = user
        localStorage.setItem('user', JSON.stringify(user))
        // router.push(this.redirectUrl || '/')
      } catch (error) {
        console.error(error)
        // router.push('/login')
      }
    },
    async logout () {
      try {
        await api.post('/logout', { token: this.user.token })
      } catch (error) {
        console.error(error)
      }
      this.user = null
      // router.push('/login')
    }
  }
})
