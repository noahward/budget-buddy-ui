import { api } from 'boot/axios'
import { camelizeKeys, decamelizeKeys } from 'humps'
import { defineStore } from 'pinia'
import { Category, CreateCategory } from '../models/category.model'

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
    },
    async createCategory (categoryInfo: CreateCategory) {
      return api.post('/categories', decamelizeKeys(categoryInfo))
        .then((response) => {
          this.categories.push(camelizeKeys(response.data) as Category)
          console.log(this.categories)
        })
        .catch((error) => {
          throw error
        })
    }
  }
})
