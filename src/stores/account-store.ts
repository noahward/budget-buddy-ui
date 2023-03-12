import { api } from 'boot/axios'
import { defineStore } from 'pinia'
import { Account } from '../models/account.model'

export const useAccountStore = defineStore('account', {
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
    },
    async createAccount (accountInfo: Account) {
      return api.post('/accounts', accountInfo)
        .then((response) => {
          this.accounts.push(response.data)
        })
        .catch((error) => {
          throw error
        })
    },
    async updateAccount (accountInfo: Account) {
      return api.patch(`/accounts/${accountInfo.id}`, accountInfo)
        .then((response) => {
          const updAccountInfo = response.data
          const targetAcc = this.accounts.find((acc) => acc.id === updAccountInfo.id)
          if (targetAcc) {
            Object.assign(targetAcc, updAccountInfo)
          }
        })
        .catch((error) => {
          throw error
        })
    },
    async deleteAccount (accountId: number) {
      return api.delete(`/accounts/${accountId}`)
        .then(() => {
          this.accounts = this.accounts.filter((acc) => acc.id !== accountId)
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
