<template>

<!--NavBar-->
<div id="wrapper">
    <nav class="navbar">
      <div class="navbrand my-auto">
        <router-link to="/" class="navbar-item"><strong>Black Market</strong></router-link>
        
        <a  class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu" @click="showMobileMenu = !showMobileMenu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" id="navbar-menu" v-bind:class = "{'is-active': showMobileMenu}">
        <div class="navbar-end">
          <router-link to="/tshirt" class="navbar-item">T-Shirts</router-link>
          <router-link to="/hoodie" class="navbar-item">Hoodies</router-link>
          <router-link to="/accessories" class="navbar-item">Accessories</router-link>
          <div class="navbar-item">
            <div class="buttons">
              <router-link to="/log-in" class="button is-success">Log In</router-link>
              <router-link to="/cart" class="button is-light">
                <span class="icon"><i class="fas fa-shopping-cart"></i></span>
                <span>Cart</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
<!--NavBar-->  

<section class="section">
  <router-view/>
</section>

<footer class="footer">
  <p class="has-text-centered">Copyright (c) 2025</p>
</footer>

</div>
</template>

<script>
  export default{
    data(){
      return{showMobileMenu:false,}
    }
  }
</script>

<style lang="scss">
@import '../node_modules/bulma';
</style>
