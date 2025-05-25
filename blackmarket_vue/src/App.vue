<template>
  <div id="wrapper">
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <router-link to="/" class="navbar-item"><strong>Black Market</strong></router-link>

        <a class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click="showMobileMenu = !showMobileMenu">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div class="navbar-menu" id="navbar-menu" v-bind:class="{'is-active': showMobileMenu }">
        <div class="navbar-start">
          <div class="navbar-item">
            <form method="get" action="/search">
              <div class="field has-addons">
                <div class="control">
                  <input type="text" class="input" placeholder="What are you looking for?" name="query">
                </div>

                <div class="control">
                  <button class="button is-success">
                    <span class="icon">
                      <i class="fas fa-search"></i>
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div class="navbar-end">
          <router-link to="/summer" class="navbar-item">Summer</router-link>
          <router-link to="/winter" class="navbar-item">Winter</router-link>

          <div class="navbar-item">
            <div class="buttons">
              <template v-if="$store.state.isAuthenticated">
                <div class="dropdown is-hoverable is-right">
                  <div class="dropdown-trigger">
                    <button class="button is-light" aria-haspopup="true" aria-controls="account-menu">
                      <template v-if="$store.state.user && $store.state.user.picture">
                        <figure class="image is-24x24" style="margin-right: 8px;">
                          <img :src="$store.state.user.picture" class="is-rounded">
                        </figure>
                      </template>
                      <span>My Account</span>
                    </button>
                  </div>
                  <div class="dropdown-menu" id="account-menu" role="menu">
                    <div class="dropdown-content">
                      <router-link to="/my-account" class="dropdown-item">
                        <span class="icon">
                          <i class="fas fa-user"></i>
                        </span>
                        Profile
                      </router-link>
                      <router-link to="/my-orders" class="dropdown-item">
                        <span class="icon">
                          <i class="fas fa-box-open"></i>
                        </span>
                        My Orders
                      </router-link>
                      <hr class="dropdown-divider">
                      <a class="dropdown-item" @click="logout">
                        <span class="icon">
                          <i class="fas fa-sign-out-alt"></i>
                        </span>
                        Logout
                      </a>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else>
                <router-link to="/log-in" class="button is-light">Log in</router-link>
                <router-link to="/sign-up" class="button is-light">Sign up</router-link>
              </template>

              <router-link to="/cart" class="button is-success">
                <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                <span>Cart ({{ cartTotalLength }})</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="is-loading-bar has-text-centered" v-bind:class="{'is-loading': $store.state.isLoading }">
      <div class="lds-dual-ring"></div>
    </div>

    <section class="section">
      <router-view/>
    </section>

    <footer class="footer">
      <p class="has-text-centered">Copyright (c) 2023</p>
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
    const user = JSON.parse(localStorage.getItem('user'))

    if (token) {
      axios.defaults.headers.common['Authorization'] = "Token " + token
      this.$store.commit('setUser', user)
      this.$store.commit('setIsAuthenticated', true)
    } else {
      axios.defaults.headers.common['Authorization'] = ""
    }
  },
  mounted() {
    this.cart = this.$store.state.cart
  },
  methods: {
    logout() {
      axios.defaults.headers.common['Authorization'] = ""
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('googleUser')
      this.$store.commit('removeToken')
      this.$store.commit('setIsAuthenticated', false)
      this.$store.commit('setUser', null)

      // Redirect to home with logout message
      this.$router.push('/?logout=success')
    }
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

.lds-dual-ring {
  display: inline-block;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #ccc;
  border-color: #ccc transparent #ccc transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.is-loading-bar {
  height: 0;
  overflow: hidden;
  transition: all 0.3s;

  &.is-loading {
    height: 80px;
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;

  .icon {
    margin-right: 0.5rem;
  }
}

.image.is-24x24 {
  height: 24px;
  width: 24px;

  img {
    height: 24px;
    width: 24px;
  }
}
</style>