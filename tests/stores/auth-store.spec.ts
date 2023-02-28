import { createPinia, setActivePinia } from 'pinia'
import { LocalStorage } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Authentication Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('State', () => {
    describe('user', () => {
      it('Sets user state as empty object if local storage is empty', () => {
        const authStore = useAuthStore()
        expect(authStore.user).toStrictEqual({})
      })

      it('Sets user state from local storage', () => {
        LocalStorage.set('user', 'fake user data')
        const authStore = useAuthStore()
        expect(authStore.user).toStrictEqual('fake user data')
      })
    })
  })
})
