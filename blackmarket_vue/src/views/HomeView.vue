<template>
  <div class="home">
    <section class="hero is-medium is-dark mb-6">
      <div class="hero-body has-text-centered">
        <p class="title mb-6">
          Welcome To Black Market
        </p>
        <p class="subtitle">
          The go to store for minimalists
        </p>
      </div>
    </section>

    <div class="column is-3" v-for="product in latestProducts" v-bind:key="product.id">
      <div class="box">
        <figure class="image mb-4">
          <img :src="product.get_thumbnail" alt="Product image">
        </figure>
        <h3 class="is-size-4">{{ product.name }}</h3>
        <p class="is-size-6 has-text-grey">TK {{ product.price }}</p>
        <router-link v-bind:to="product.get_absolute_url" class="button is-dark mt-4">View Details</router-link>
      </div>
    </div>


  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Home',
    data() {
      return {
        latestProducts: []
      }
    },
    components: {
    },
    mounted() {
      this.getLatestProducts()

      document.title = 'Home | Black Market'
    },
    methods: {
      async getLatestProducts() {

        this.$store.commit('setIsLoading', true)

        await axios
          .get('/api/v1/latest-products/')
          .then(response => {
            this.latestProducts = response.data
          })
          .catch(error => {
            console.log(error)
          })
          this.$store.commit('setIsLoading', false)
      }
    }
  }
</script>

<style scoped>
  .image {
    margin-top: -1.25rem;
    margin-left: -1.25rem;
    margin-right: -1.25rem;
  }
</style>