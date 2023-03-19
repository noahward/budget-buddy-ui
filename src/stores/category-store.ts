import { api } from 'boot/axios'
import { camelizeKeys } from 'humps'
import { defineStore } from 'pinia'
import { Category } from '../models/category.model'

export const useCategoryStore = defineStore('category', {
  state: () => {
    return {
      categories: [] as Category[]
    }
  },
  actions: {
    async getCategories () {
      return api.get('/categories')
        .then((response) => {
          this.categories = camelizeKeys(response.data) as Category[]
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
