import { api } from 'boot/axios'
import { camelizeKeys } from 'humps'
import { defineStore } from 'pinia'
import { Transaction } from '../models/transaction.model'

export const useTransactionStore = defineStore('transaction', {
  state: () => {
    return {
      transactions: [] as Transaction[]
    }
  },
  actions: {
    async getTransactions (accountId: number) {
      return api.get(`/accounts/${accountId}/transactions`)
        .then((response) => {
          this.transactions = camelizeKeys(response.data) as Transaction[]
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
