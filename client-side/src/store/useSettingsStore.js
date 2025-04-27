import { defineStore } from 'pinia'
import axios from 'axios' // Assuming you're using axios for HTTP requests

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    storeName: '',
    currency: 'USD',
    defaultLanguage: 'en',
    shippingMethods: [],
    loading: false,
    error: null
  }),
  actions: {
    // Fetch store settings from the backend
    async fetchStoreSettings() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/settings')
        const { storeName, currency, defaultLanguage, shippingMethods } =
          response.data.settings
        this.storeName = storeName
        this.currency = currency
        this.defaultLanguage = defaultLanguage
        this.shippingMethods = shippingMethods
      } catch (error) {
        this.error = 'Failed to fetch store settings'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    // Update store settings on the backend
    async updateStoreSettings(updatedSettings) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.put('/api/settings', updatedSettings)
        const { storeName, currency, defaultLanguage, shippingMethods } =
          response.data.settings
        this.storeName = storeName
        this.currency = currency
        this.defaultLanguage = defaultLanguage
        this.shippingMethods = shippingMethods
      } catch (error) {
        this.error = 'Failed to update store settings'
        console.error(error)
      } finally {
        this.loading = false
      }
    },

    // Delete a shipping method from the settings
    async deleteShippingMethod(methodId) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`/api/settings/shipping-methods/${methodId}`)
        this.shippingMethods = this.shippingMethods.filter(
          (method) => method._id !== methodId
        )
      } catch (error) {
        this.error = 'Failed to delete shipping method'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
})
