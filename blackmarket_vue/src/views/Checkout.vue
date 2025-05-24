<template>
  <div class="checkout box">
    <h1 class="title is-3 has-text-centered mb-5">Checkout</h1>

    <div v-if="errors.length" class="notification is-danger">
      <button class="delete" @click="errors = []"></button>
      <ul>
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <form @submit.prevent="submitForm">
      <div class="columns is-multiline">
        <div class="column is-half">
          <div class="field">
            <label class="label">First Name</label>
            <div class="control">
              <input
                type="text"
                placeholder="First name"
                v-model="first_name"
                class="input"
              />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Last Name</label>
            <div class="control">
              <input
                type="text"
                placeholder="Last name"
                v-model="last_name"
                class="input"
              />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input
                type="email"
                placeholder="Email"
                v-model="email"
                class="input"
              />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Phone</label>
            <div class="control">
              <input
                type="text"
                placeholder="Phone"
                v-model="phone"
                class="input"
              />
            </div>
          </div>
        </div>

        <div class="column is-full">
          <div class="field">
            <label class="label">Address</label>
            <div class="control">
              <input
                type="text"
                placeholder="Address"
                v-model="address"
                class="input"
              />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Zip Code</label>
            <div class="control">
              <input
                type="text"
                placeholder="Zip code"
                v-model="zipcode"
                class="input"
              />
            </div>
          </div>
        </div>

        <div class="column is-half">
          <div class="field">
            <label class="label">Place</label>
            <div class="control">
              <input
                type="text"
                placeholder="Place"
                v-model="place"
                class="input"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="field mt-5">
        <div class="control">
          <button
            type="submit"
            class="button is-primary is-fullwidth"
            :class="{ 'is-loading': $store.state.isLoading }"
          >
            Pay with SSLCommerz
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Checkout',
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      zipcode: '',
      place: '',
      errors: []
    }
  },
  computed: {
    cart() {
      return this.$store.state.cart
    }
  },
  methods: {
    async submitForm() {
      this.errors = []

      // Basic validation
      if (!this.first_name) this.errors.push('First name is required.')
      if (!this.last_name) this.errors.push('Last name is required.')
      if (!this.email) this.errors.push('Email is required.')
      if (!this.phone) this.errors.push('Phone is required.')
      if (!this.address) this.errors.push('Address is required.')
      if (!this.zipcode) this.errors.push('Zip code is required.')
      if (!this.place) this.errors.push('Place is required.')

      if (this.errors.length) return

      const items = this.cart.items.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price * item.quantity
      }))

      const orderData = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        phone: this.phone,
        address: this.address,
        zipcode: this.zipcode,
        place: this.place,
        items: items
      }

      try {
        this.$store.commit('setIsLoading', true)

        const response = await axios.post('/api/v1/payment/initiate/', orderData)

        if (response.data && response.data.GatewayPageURL) {
          // Redirect user to SSLCommerz payment page
          window.location.href = response.data.GatewayPageURL
        } else {
          this.errors.push('SSLCommerz gateway error. Please try again.')
        }
      } catch (error) {
        console.error(error)
        this.errors.push('An error occurred during payment initiation.')
      } finally {
        this.$store.commit('setIsLoading', false)
      }
    }
  }
}
</script>

<style scoped>
.checkout {
  max-width: 700px;
  margin: 2rem auto;
}
</style>
