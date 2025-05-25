<template>
  <div class="page-my-account">
    <div class="columns is-multiline">
      <div class="column is-12">
        <h1 class="title">My Account</h1>
        
        <div class="box">
          <div class="media">
            <div class="media-left" v-if="user.picture">
              <figure class="image is-64x64">
                <img :src="user.picture" class="is-rounded">
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ user.name || user.username }}</p>
              <p class="subtitle is-6">{{ user.email }}</p>
              <p class="tag is-info" v-if="isGoogleUser">
                <span class="icon">
                  <i class="fab fa-google"></i>
                </span>
                <span>Google Account</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="column is-12">
        <h2 class="subtitle">My Orders</h2>

        <div class="notification is-info" v-if="orders.length === 0">
          You haven't placed any orders yet.
        </div>

        <OrderSummary
          v-for="order in orders"
          v-bind:key="order.id"
          v-bind:order="order" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import OrderSummary from '@/components/OrderSummary.vue'

export default {
  name: 'MyAccount',
  components: {
    OrderSummary
  },
  data() {
    return {
      orders: [],
      user: {},
      isGoogleUser: false
    }
  },
  async mounted() {
    document.title = 'My account | Black Market'
    
    await this.fetchUserData()
    await this.getMyOrders()
  },
  methods: {
    async fetchUserData() {
      try {
        // Check for Google user first
        const googleUser = JSON.parse(localStorage.getItem('googleUser'))
        if (googleUser) {
          this.user = {
            ...googleUser,
            username: googleUser.name
          }
          this.isGoogleUser = true
        } else {
          // Fetch regular user data
          const response = await axios.get('/api/v1/users/me/')
          this.user = response.data
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        this.$router.push('/log-in')
      }
    },
    async getMyOrders() {
    this.$store.commit('setIsLoading', true)

    try {
        const response = await axios.get('/api/v1/orders/')  // Changed endpoint
        this.orders = response.data
    } catch (error) {
        console.error("Error fetching orders:", error)
        
        if (error.response && error.response.status === 401) {
            this.$router.push('/log-in')
        }
    } finally {
        this.$store.commit('setIsLoading', false)
    }
}
  },
  beforeRouteEnter(to, from, next) {
    const isAuthenticated = localStorage.getItem('token')
    if (!isAuthenticated) {
      next('/log-in')
    } else {
      next()
    }
  }
}
</script>

<style scoped>
.tag {
  margin-top: 0.5rem;
}
</style>