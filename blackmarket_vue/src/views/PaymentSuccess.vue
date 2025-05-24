<template>
  <div class="section has-text-centered">
    <div class="notification is-success is-light">
      <h1 class="title is-3">Payment Successful 🎉</h1>
      <p>Your payment was processed successfully. Thank you for your order!</p>
      <router-link to="/" class="button is-link mt-4">Go Home</router-link>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    goHome() {
      this.$router.push('/')
      this.$store.commit('clearCart') // Clear cart after success
    }
  }
}
</script>
