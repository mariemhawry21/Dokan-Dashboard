import { defineStore } from 'pinia'
import axios from 'axios'

export const useRequestsStore = defineStore('requests', {
  state: () => ({
    requests: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      currentPage: 1,
      totalPages: 1,
      itemsPerPage: 10
    }
  }),

  actions: {
    async fetchRequests(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { data } = await axios.get(
          'http://localhost:5000/users/pending',
          {
            params: {
              page: params.page || this.pagination.currentPage,
              limit: params.limit || this.pagination.itemsPerPage
            },
            headers: {
              'Cache-Control': 'no-cache',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              Pragma: 'no-cache'
            }
          }
        )

        this.requests = data.data.users
        this.updatePagination({
          total: data.total,
          currentPage: data.page,
          totalPages: data.totalPages,
          itemsPerPage: params.limit || this.pagination.itemsPerPage
        })
      } catch (error) {
        this.handleError(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async approveRequest(userId) {
      this.loading = true
      console.log(userId)

      try {
        await axios.patch(
          `http://localhost:5000/users/${userId}/approve`,
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache'
            }
          }
        )
        this.removeUser(userId)
        this.updateTotalCount(-1)
      } catch (error) {
        this.handleError(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async denyRequest(userId) {
      this.loading = true
      try {
        await axios.patch(
          `http://localhost:5000/users/${userId}/deny`,
          { reason: 'you are not legal to enter dashboard' },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Cache-Control': 'no-cache',
              Pragma: 'no-cache'
            }
          }
        )
        this.removeUser(userId)
        this.updateTotalCount(-1)
      } catch (error) {
        this.handleError(error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Helper methods
    updatePagination(paginationData) {
      this.pagination = {
        ...this.pagination,
        ...paginationData
      }
    },

    removeUser(userId) {
      this.requests = this.requests.filter((user) => user._id !== userId)
    },

    updateTotalCount(change) {
      this.pagination.total = Math.max(0, this.pagination.total + change)
      this.pagination.totalPages = Math.ceil(
        this.pagination.total / this.pagination.itemsPerPage
      )

      // Reset to first page if current page exceeds total pages
      if (this.pagination.currentPage > this.pagination.totalPages) {
        this.pagination.currentPage = 1
      }
    },

    handleError(error) {
      this.error =
        error.response?.data?.message ||
        error.message ||
        'An unknown error occurred'
    }
  },

  getters: {
    hasNextPage: (state) =>
      state.pagination.currentPage < state.pagination.totalPages,
    hasPreviousPage: (state) => state.pagination.currentPage > 1,
    showingFrom: (state) =>
      (state.pagination.currentPage - 1) * state.pagination.itemsPerPage + 1,
    showingTo: (state) =>
      Math.min(
        state.pagination.currentPage * state.pagination.itemsPerPage,
        state.pagination.total
      )
  }
})
