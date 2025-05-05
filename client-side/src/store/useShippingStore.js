import { defineStore } from 'pinia'
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/settings',
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    throw new Error('No authentication token found')
  }
  return config
})

export const useShippingStore = defineStore('shipping', {
  state: () => ({
    shippingMethods: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 1
    },
    loading: false,
    error: null,
    itemToDelete: null // Added for delete confirmation
  }),

  actions: {
    async fetchShippingMethods(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await apiClient.get('/shipping-methods', {
          params: {
            page: params.page || this.pagination.page,
            limit: params.limit || this.pagination.limit
          }
        })

        this.shippingMethods = response.data.data.shippingMethods
        this.pagination = {
          page: response.data.data.pagination.page,
          limit: response.data.data.pagination.limit,
          total: response.data.data.pagination.total,
          totalPages: response.data.data.pagination.totalPages
        }
      } catch (error) {
        this.handleError(error, 'Failed to fetch shipping methods')
        throw error
      } finally {
        this.loading = false
      }
    },

    async addShippingMethod(methodData) {
      this.loading = true
      try {
        if (
          !methodData.name ||
          typeof methodData.cost !== 'number' ||
          methodData.cost < 0
        ) {
          throw new Error('Invalid shipping method data')
        }

        const response = await apiClient.post('/shipping-methods', {
          name: methodData.name.trim(),
          cost: Number(methodData.cost)
        })

        await this.fetchShippingMethods({
          page: this.pagination.page,
          limit: this.pagination.limit
        })

        return response.data.data.shippingMethod
      } catch (error) {
        this.handleError(error, 'Failed to add shipping method')
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateShippingMethod(methodData) {
      this.loading = true
      try {
        if (!methodData._id) {
          throw new Error('Missing shipping method ID')
        }

        const response = await apiClient.put(
          `/shipping-methods/${methodData._id}`,
          {
            name: methodData.name.trim(),
            cost: Number(methodData.cost)
          }
        )

        await this.fetchShippingMethods({
          page: this.pagination.page,
          limit: this.pagination.limit
        })

        return response.data.data.shippingMethod
      } catch (error) {
        this.handleError(error, 'Failed to update shipping method')
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteShippingMethod(id) {
      this.loading = true
      try {
        if (!id) {
          throw new Error('Missing shipping method ID')
        }

        await apiClient.delete(`/shipping-methods/${id}`)
        await this.fetchShippingMethods({
          page: this.pagination.page,
          limit: this.pagination.limit
        })
      } catch (error) {
        this.handleError(error, 'Failed to delete shipping method')
        throw error
      } finally {
        this.loading = false
      }
    },

    // New method for delete confirmation
    setItemToDelete(id) {
      this.itemToDelete = id
    },

    handleError(error, defaultMessage) {
      console.error('Shipping Store Error:', error)

      if (error.response) {
        if (error.response.status === 401) {
          this.error = 'Session expired. Please login again.'
        } else if (error.response.status === 403) {
          this.error = 'You do not have permission for this action'
        } else {
          this.error = error.response.data?.message || defaultMessage
        }
      } else if (error.request) {
        this.error = 'Network error. Please check your connection.'
      } else {
        this.error = error.message || defaultMessage
      }
    }
  }
})
