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
          const transactionArr = camelizeKeys(response.data) as Transaction[]
          transactionArr.forEach(obj => {
            if (obj.dateClassified !== null) {
              obj.dateClassified = new Date(obj.dateClassified)
            }
            obj.date = new Date(obj.date)
          })
          transactionArr.sort((a, b) => {
            if (a.dateClassified === null && b.dateClassified === null) {
              return 0
            }
            if (a.dateClassified === null) {
              return 1
            }
            if (b.dateClassified === null) {
              return -1
            }
            // @ts-expect-error   all dates have been converted to Date objects at this point
            return b.dateClassified.getTime() - a.dateClassified.getTime()
          })
          this.transactions = transactionArr
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
