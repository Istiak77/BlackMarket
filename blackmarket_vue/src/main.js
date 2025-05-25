// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// Axios configuration
axios.defaults.baseURL = 'http://localhost:8000/'

// Request interceptor
axios.interceptors.request.use(config => {
  store.commit('setIsLoading', true)
  const token = store.state.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor
axios.interceptors.response.use(
  response => {
    store.commit('setIsLoading', false)
    return response
  },
  error => {
    store.commit('setIsLoading', false)
    
    if (error.response?.status === 401) {
      store.commit('clearAuthData')
      router.push('/login')
    }
    
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.use(store)
app.use(router)

// Initialize store
store.commit('initializeStore')
// Check auth status on app load
store.dispatch('checkAuth')

app.mount('#app')