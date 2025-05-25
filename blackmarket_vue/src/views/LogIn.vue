<template>
  <div class="page-log-in">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Log in</h1>

        <form @submit.prevent="submitForm">
          <div class="field">
            <label>Username</label>
            <div class="control">
              <input type="text" class="input" v-model="username" required>
            </div>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="control">
              <input type="password" class="input" v-model="password" required>
            </div>
          </div>

          <div class="notification is-danger" v-if="authError">
            <p>{{ authError }}</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-dark" :disabled="isLoading">
                {{ isLoading ? 'Logging in...' : 'Log in' }}
              </button>
            </div>
          </div>

          <hr>

          Or <router-link to="/sign-up">click here</router-link> to sign up!
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    authError() {
      return this.$store.state.authError
    }
  },
  mounted() {
    document.title = 'Log In | Black Market'
    this.$store.commit('setAuthError', null) // Clear any previous errors
  },
  methods: {
    async submitForm() {
      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
        
        const toPath = this.$route.query.to || '/cart'
        this.$router.push(toPath)
      } catch (error) {
        console.error("Login error:", error)
      }
    }
  }
}
</script>