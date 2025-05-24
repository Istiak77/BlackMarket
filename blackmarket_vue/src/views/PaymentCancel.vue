<template>
  <div class="section has-text-centered">
    <div class="notification is-warning is-light">
      <h1 class="title is-3">Payment Cancelled ⚠️</h1>
      <p>You have cancelled the payment process.</p>
      <router-link to="/checkout" class="button is-warning mt-4">Back to Checkout</router-link>
    </div>
  </div>
</template>


<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/checkout')
    }
  }
}
</script>