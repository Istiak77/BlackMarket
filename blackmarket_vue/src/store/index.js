import { createStore } from 'vuex'

export default createStore({
  state: {
    cart: {
      items: [],
    },
    isAuthenticated: false,
    token: '',
    isLoading: false,
    user: null  // Added user object to state
  },
  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated,
    cartTotalItems: (state) => {
      return state.cart.items.reduce((total, item) => total + item.quantity, 0)
    }
  },
  mutations: {
    initializeStore(state) {
      // Initialize cart
      if (localStorage.getItem('cart')) {
        state.cart = JSON.parse(localStorage.getItem('cart'))
      } else {
        localStorage.setItem('cart', JSON.stringify(state.cart))
      }

      // Initialize authentication
      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
        state.isAuthenticated = true
        
        // Initialize user if exists
        if (localStorage.getItem('user')) {
          state.user = JSON.parse(localStorage.getItem('user'))
        }
      } else {
        this.commit('clearAuthData')
      }
    },

    setIsLoading(state, status) {
      state.isLoading = status
    },

    setToken(state, token) {
      state.token = token
      state.isAuthenticated = true
      localStorage.setItem('token', token)
    },

    setUser(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    clearAuthData(state) {
      state.token = ''
      state.isAuthenticated = false
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('googleUser')  // Clear Google auth data if exists
    },

    addToCart(state, item) {
      const exists = state.cart.items.filter(i => i.product.id === item.product.id)

      if (exists.length) {
        exists[0].quantity = parseInt(exists[0].quantity) + parseInt(item.quantity)
      } else {
        state.cart.items.push(item)
      }
      localStorage.setItem('cart', JSON.stringify(state.cart))
    },

    clearCart(state) {
      state.cart.items = []
      localStorage.setItem('cart', JSON.stringify(state.cart))
    }
  },
  actions: {
    async loadUser({ commit }) {
      try {
        if (localStorage.getItem('token')) {
          const response = await axios.get('/api/v1/users/me/')
          commit('setUser', response.data)
        }
      } catch (error) {
        console.error("Error loading user:", error)
        commit('clearAuthData')
      }
    },

    logout({ commit }) {
      commit('clearAuthData')
      axios.defaults.headers.common['Authorization'] = ""
    }
  },
  modules: {
  }
})