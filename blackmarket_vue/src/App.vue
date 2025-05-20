<template>

  <!--NavBar-->
  <div id="wrapper">
    <nav class="navbar">
      <div class="navbrand my-auto">
        <router-link to="/" class="navbar-item"><strong>Black Market</strong></router-link>

        <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu"
          @click="showMobileMenu = !showMobileMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" id="navbar-menu" v-bind:class="{'is-active': showMobileMenu}">
        <div class="navbar-end">
          <router-link to="/tshirt" class="navbar-item">T-Shirts</router-link>
          <router-link to="/hoodie" class="navbar-item">Hoodies</router-link>
          <router-link to="/accessories" class="navbar-item">Accessories</router-link>
          <div class="navbar-item">
            <div class="buttons">
              <router-link to="/log-in" class="button is-success">Log In</router-link>
              <router-link to="/cart" class="button is-light">
                <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                <span>Cart {{ cartTotalLength }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <!--NavBar-->

    <section class="section">
      <router-view />
    </section>

    <footer class="footer">
      <p class="has-text-centered">Copyright (c) 2025</p>
    </footer>

  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        showMobileMenu: false,
        cart: {
          items: []
        }
      }
    },
    beforeCreate() {
      this.$store.commit('initializeStore')

      const token = this.$store.state.token

      if (token) {
        axios.defaults.headers.common['Authorization'] = "Token " + token
      } else {
        axios.defaults.headers.common['Authorization'] = ""
      }
    },
    mounted() {
      this.cart = this.$store.state.cart
    },
    computed: {
      cartTotalLength() {
        let totalLength = 0

        for (let i = 0; i < this.cart.items.length; i++) {
          totalLength += this.cart.items[i].quantity
        }

        return totalLength
      }
    }
  }
</script>

<style lang="scss">
  @import '../node_modules/bulma';
</style>