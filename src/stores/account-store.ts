import { api } from 'boot/axios'
import { decamelizeKeys, camelizeKeys } from 'humps'
import { defineStore } from 'pinia'
import { Account, UpdateAccount, CreateAccount } from '../models/account.model'

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
          this.accounts = camelizeKeys(response.data) as Account[]
        })
        .catch((error) => {
          throw error
        })
    },
    async createAccount (accountInfo: CreateAccount) {
      return api.post('/accounts', decamelizeKeys(accountInfo))
        .then((response) => {
          this.accounts.push(camelizeKeys(response.data) as Account)
        })
        .catch((error) => {
          throw error
        })
    },
    async updateAccount (accountInfo: UpdateAccount) {
      return api.patch(`/accounts/${accountInfo.id}`, accountInfo)
        .then((response) => {
          const updAccountInfo = camelizeKeys(response.data) as Account
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
    },
    async uploadTransactions (accountId: number, file: File) {
      const formData = new FormData()
      formData.append('file', file)
      return api.post(`/accounts/${accountId}/transactions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .catch((error) => {
          throw error
        })
    }
  }
})
