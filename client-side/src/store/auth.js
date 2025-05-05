// useAuthStore.js
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    pendingEmail: null,
    user: JSON.parse(localStorage.getItem('user')) || null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userRole: (state) => state.user?.role,
    isSuperAdmin: (state) => state.user?.role === 'super_admin',
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
      this.setUserFromToken(token)
    },

    setUserFromToken(token) {
      try {
        const decoded = jwtDecode(token)
        this.user = {
          id: decoded._id,
          email: decoded.email,
          role: decoded.role,
          // token:token,
          // ... other user properties
        }
        localStorage.setItem('user', JSON.stringify(this.user))

        // Redirect based on role after login
        this.redirectAfterLogin()
      } catch (error) {
        console.error('Token decoding failed:', error)
        this.logout()
      }
    },

    redirectAfterLogin() {
      if (!this.user?.role) return

      const redirectPath = router.currentRoute.value.query.redirect

      if (redirectPath) {
        router.push(redirectPath)
      } else {
        switch (this.user.role) {
          case 'super_admin':
            router.push({ name: 'super-admin-dashboard' })
            break
          case 'admin':
            router.push({ name: 'admin-dashboard' })
            break
          default:
            router.push({ name: 'login' })
        }
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push({ name: 'login' })
    },

    async loadUserFromStorage() {
      if (this.token && !this.user) {
        await this.setUserFromToken(this.token)
      }
    }
  }
})
