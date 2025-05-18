<template>
<div id="wrapper">
    <nav class="navbar is-dark">
      <div class="navbrand">
        <router-link to="/" class="navbar-item"><strong>Black Market</strong></router-link>
        
        <a  class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbar-menu">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" id="navbar-menu">
        <div class="navbar-end">
          <router-link to="/tshirt" class="navbar-item">T-Shirts</router-link>
          <router-link to="/hoodie" class="navbar-item">Hoodies</router-link>
          <div class="navbar-item">
            <div class="buttons">
              <router-link to="/log-in" class="button is-light">Log In</router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
</div>
</template>

<style lang="scss">
@import '../node_modules/bulma';
</style>
