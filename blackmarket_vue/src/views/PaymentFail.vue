<template>
  <div class="section has-text-centered">
    <div class="notification is-danger is-light">
      <h1 class="title is-3">Payment Failed ❌</h1>
      <p>Unfortunately, your payment could not be completed.</p>
      <router-link to="/checkout" class="button is-danger mt-4">Try Again</router-link>
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