import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
    cart: {
      items: []
    },
    isAuthenticated: false,
    token: localStorage.getItem('token') || '',
    isLoading: false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    authError: null
  },
  
  getters: {
    currentUser: state => state.user,
    isAuthenticated: state => state.isAuthenticated,
    cartItemCount: state => state.cart.items.reduce((total, item) => total + item.quantity, 0),
    cartTotalPrice: state => state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    authError: state => state.authError,
    isLoading: state => state.isLoading
  },
  
  mutations: {
    initializeStore(state) {
      // Cart initialization
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      }

      // Auth initialization
      if (state.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
      }
    },

    setIsLoading(state, status) {
      state.isLoading = status
    },

    setToken(state, token) {
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    setAuthError(state, error) {
      state.authError = error
    },

    clearAuthData(state) {
      state.token = ''
      state.isAuthenticated = false
      state.user = null
      state.authError = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    },

    addToCart(state, item) {
      const existingItem = state.cart.items.find(
        i => i.product.id === item.product.id
      )

      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        state.cart.items.push(item)
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },

    removeFromCart(state, productId) {
      state.cart.items = state.cart.items.filter(
        item => item.product.id !== productId
      )
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },

    updateCartItemQuantity(state, { productId, quantity }) {
      const item = state.cart.items.find(
        item => item.product.id === productId
      )
      if (item) {
        item.quantity = quantity
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }
    },

    clearCart(state) {
      state.cart.items = []
      localStorage.setItem('cart', JSON.stringify(state.cart))
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      commit('setIsLoading', true)
      commit('setAuthError', null)
      
      try {
        const response = await axios.post('/auth/login/', credentials)
        commit('setToken', response.data.token)
        commit('setUser', response.data.user)
        return true
      } catch (error) {
        commit('setAuthError', error.response?.data?.message || 'Login failed')
        return false
      } finally {
        commit('setIsLoading', false)
      }
    },

    async register({ commit }, userData) {
      commit('setIsLoading', true)
      commit('setAuthError', null)
      
      try {
        const response = await axios.post('/auth/register/', userData)
        commit('setToken', response.data.token)
        commit('setUser', response.data.user)
        return true
      } catch (error) {
        commit('setAuthError', error.response?.data?.message || 'Registration failed')
        return false
      } finally {
        commit('setIsLoading', false)
      }
    },

    async logout({ commit }) {
      commit('clearAuthData')
      try {
        await axios.post('/auth/logout/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    },

    async fetchUser({ commit }) {
      try {
        const response = await axios.get('/auth/user/')
        commit('setUser', response.data)
      } catch (error) {
        if (error.response?.status === 401) {
          commit('clearAuthData')
        }
      }
    },

    async checkAuth({ state, commit }) {
      if (!state.token) return false
      
      try {
        await axios.get('/auth/verify/')
        return true
      } catch (error) {
        if (error.response?.status === 401) {
          commit('clearAuthData')
        }
        return false
      }
    }
  }
})