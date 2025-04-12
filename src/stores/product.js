import { defineStore } from 'pinia'
import axios from 'axios'
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    // fetch method
    // async fetchProducts() {
    //   this.isLoading = true
    //   this.error = null
    //   try {
    //     const res = await fetch('https://dummyjson.com/products')
    //     if (!res.status) throw new Error('Failed to fetch products')
    //     const data = await res.json()
    //     this.products = data.products
    //   } catch (err) {
    //     this.error = err.message
    //   } finally {
    //     this.isLoading = false
    //   }
    // },
    // axios method
    async fetchProducts() {
      this.isLoading = true
      this.error = null
      try {
        const res = await axios.get('https://dummyjson.com/products')
        this.products = res.data.products
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
