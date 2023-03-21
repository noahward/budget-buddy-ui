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
    },
    async classifyTransaction (accountId: number, transactionId: number, categoryId: number) {
      return api.patch(`/accounts/${accountId}/transactions/${transactionId}`, { category: categoryId })
        .then((response) => {
          const updTransaction = camelizeKeys(response.data) as Transaction
          const targetTransaction = this.transactions.find((obj) => obj.id === updTransaction.id)
          if (targetTransaction) {
            Object.assign(targetTransaction, updTransaction)
          }
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
