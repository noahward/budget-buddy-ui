import { api } from 'boot/axios'
import { defineStore } from 'pinia'
import { Account } from '../models/account.model'

export const useGeneralStore = defineStore('general', {
  state: () => {
    return {
      accounts: [] as Account[]
    }
  },
  actions: {
    async getAccounts () {
      return api.get('/accounts')
        .then((response) => {
          this.accounts = response.data
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
