import { api } from 'boot/axios'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'

const router = useRouter()

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
        router.push(this.redirectUrl || '/')
      } catch (error) {
        console.error(error)
        router.push('/login')
      }
    },
    async logout () {
      try {
        await api.post('/logout', { token: this.user.token })
      } catch (error) {
        console.error(error)
      }
      this.user = null
      router.push('/login')
    }
  }
})
