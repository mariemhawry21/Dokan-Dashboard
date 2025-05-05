import { defineStore } from 'pinia'
import axios from 'axios'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currencies: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    selectedCurrency: {
      code: 'USD',
      exchange_rate: 1,
      symbol: '$'
    },
    loading: false,
    error: null
  }),

  actions: {
    async fetchCurrencies(page = 1, limit = 10) {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:5000/api/currencies', {
          params: { page, size: limit }
        })

        // Handle both paginated and non-paginated responses
        if (res.data.meta) {
          this.currencies = res.data.data || []
          this.pagination = {
            page: res.data.meta.page,
            limit: res.data.meta.limit,
            total: res.data.meta.total,
            totalPages: res.data.meta.totalPages
          }
        } else {
          this.currencies = Array.isArray(res.data) ? res.data : []
          this.pagination = {
            page: 1,
            limit: this.currencies.length,
            total: this.currencies.length,
            totalPages: 1
          }
        }
      } catch (err) {
        console.error('Failed to fetch currencies:', err)
        this.error = err.response?.data?.message || 'Failed to fetch currencies'
        throw err
      } finally {
        this.loading = false
      }
    },

    async addCurrency(data) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(
          'http://localhost:5000/api/currencies',
          {
            code: data.code,
            name: data.name,
            symbol: data.symbol,
            exchange_rate: Number(data.exchange_rate)
          }
        )
        // Refresh the current page after adding
        await this.fetchCurrencies(this.pagination.page, this.pagination.limit)
        return response.data
      } catch (error) {
        let errorMessage = 'Failed to add currency'

        if (error.response) {
          if (error.response.data.message.includes('duplicate key')) {
            errorMessage = `Currency with code ${data.code} already exists`
          } else {
            errorMessage = error.response.data.message || errorMessage
          }
        }

        throw new Error(errorMessage)
      } finally {
        this.loading = false
      }
    },

    async updateCurrency(id, data) {
      this.loading = true
      try {
        const res = await axios.put(
          `http://localhost:5000/api/currencies/${id}`,
          data
        )
        // Update local state if item exists on current page
        const index = this.currencies.findIndex((c) => c._id === id)
        if (index !== -1) {
          this.currencies[index] = res.data
        }
        return res.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update currency'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteCurrency(id) {
      this.loading = true
      try {
        await axios.delete(`http://localhost:5000/api/currencies/${id}`)
        // Refresh current page after deletion
        await this.fetchCurrencies(this.pagination.page, this.pagination.limit)
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete currency'
        throw err
      } finally {
        this.loading = false
      }
    },

    setCurrency(currency) {
      this.selectedCurrency = currency
      localStorage.setItem('selectedCurrency', JSON.stringify(currency))
    },

    persistCurrencyFromStorage() {
      const savedCurrency = localStorage.getItem('selectedCurrency')
      if (savedCurrency) {
        try {
          const currency = JSON.parse(savedCurrency)
          if (currency?.code && currency?.exchange_rate && currency?.symbol) {
            this.selectedCurrency = currency
          }
        } catch (err) {
          console.error('Error parsing saved currency:', err)
        }
      }
    },

    // Helper to change page
    async changePage(page) {
      await this.fetchCurrencies(page, this.pagination.limit)
    },

    // Helper to change items per page
    async changeLimit(limit) {
      await this.fetchCurrencies(1, limit) // Reset to first page when changing limit
    }
  },

  getters: {
    rate: (state) => state.selectedCurrency.exchange_rate,
    symbol: (state) => state.selectedCurrency.symbol,
    currentPage: (state) => state.pagination.page,
    itemsPerPage: (state) => state.pagination.limit,
    totalItems: (state) => state.pagination.total
  }
})
