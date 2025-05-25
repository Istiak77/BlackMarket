<template>
  <div class="page-sign-up">
    <div class="columns">
      <div class="column is-4 is-offset-4">
        <h1 class="title">Sign up</h1>

        <form @submit.prevent="submitForm">
          <div class="field">
            <label>Username</label>
            <div class="control">
              <input type="text" class="input" v-model="username" />
            </div>
          </div>

          <div class="field">
            <label>Password</label>
            <div class="control">
              <input type="password" class="input" v-model="password" />
            </div>
          </div>

          <div class="field">
            <label>Repeat password</label>
            <div class="control">
              <input type="password" class="input" v-model="password2" />
            </div>
          </div>

          <div class="notification is-danger" v-if="errors.length">
            <p v-for="error in errors" :key="error">{{ error }}</p>
          </div>

          <div class="field">
            <div class="control">
              <button class="button is-dark">Sign up</button>
            </div>
          </div>

          <hr />

          Or <router-link to="/log-in">click here</router-link> to log in!
        </form>

        <hr />

        <div>
          <button @click="showGoogleLogin" class="button is-success" :disabled="isGoogleLoading">
            <span v-if="!isGoogleLoading">
              <i class="fab fa-google"></i> Sign up with Google
            </span>
            <span v-else>
              <i class="fas fa-spinner fa-spin"></i> Loading...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import { toast } from "bulma-toast";

  export default {
    name: "SignUp",
    data() {
      return {
        username: "",
        password: "",
        password2: "",
        errors: [],
        googleClientId: process.env.VUE_APP_GOOGLE_CLIENT_ID || "1000611960672-7c0qdquqmbu9v0jcmfht1uoe4fi7bh28.apps.googleusercontent.com",
        isGoogleLoading: false,
        googleAuthInitialized: false
      };
    },
    mounted() {
      this.loadGoogleScript();
    },
    methods: {
      async loadGoogleScript() {
        if (window.google?.accounts?.id) return;

        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => {
            this.initializeGoogleAuth();
            resolve();
          };
          script.onerror = () => {
            this.errors = ["Failed to load Google sign-in. Please try the manual form."];
          };
          document.head.appendChild(script);
        });
      },

      initializeGoogleAuth() {
        if (this.googleAuthInitialized) return;

        try {
          window.google.accounts.id.initialize({
            client_id: this.googleClientId,
            callback: (response) => this.handleGoogleCredentialResponse(response),
            ux_mode: 'popup',
            auto_select: false,
            context: 'signup',
            itp_support: true,
            use_fedcm_for_prompt: true
          });
          this.googleAuthInitialized = true;
        } catch (error) {
          console.error("Google auth initialization failed:", error);
          this.errors = ["Google sign-in configuration error. Please use the manual form."];
        }
      },

      showGoogleLogin() {
        this.isGoogleLoading = true;
        this.errors = [];

        if (!window.google?.accounts?.id) {
          this.errors = ["Google sign-in not ready. Please try again."];
          this.isGoogleLoading = false;
          return;
        }

        window.google.accounts.id.prompt(notification => {
          this.isGoogleLoading = false;

          if (notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason();
            console.log("Prompt not displayed:", reason);

            if (reason === 'invalid_client') {
              this.errors = ["Google sign-in is currently unavailable. Please use the manual form."];
            } else if (reason === 'suppressed_by_user') {
              this.errors = ["You previously dismissed Google sign-in. Please refresh to try again."];
            } else {
              this.errors = ["Couldn't load Google sign-in. Please try the manual form."];
            }
          }
        });
      },

async handleGoogleCredentialResponse(response) {
    try {
        this.isGoogleLoading = true;
        this.errors = [];
        
        const res = await axios.post("/api/v1/auth/google/", {
            access_token: response.credential
        });

        // Store all user data
        localStorage.setItem("authToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        
        if (res.data.picture) {
            localStorage.setItem("googleUser", JSON.stringify({
                name: res.data.user.name || res.data.user.username,
                email: res.data.user.email,
                picture: res.data.picture
            }));
        }

        // Update Vuex store
        this.$store.commit('setUser', res.data.user);
        this.$store.commit('setToken', res.data.access);

        // Redirect to home with login success state
        this.$router.push({ 
            path: '/', 
            query: { login: 'success' } 
        });
        
    } catch (error) {
        console.error("Google auth error:", error);
        this.errors = ["Google login failed. Please try again."];
    } finally {
        this.isGoogleLoading = false;
    }
},

      submitForm() {
        this.errors = [];

        if (this.username === "") {
          this.errors.push("The username is missing");
        }
        if (this.password === "") {
          this.errors.push("The password is too short");
        }
        if (this.password !== this.password2) {
          this.errors.push("The passwords don't match");
        }

        if (!this.errors.length) {
          const formData = {
            username: this.username,
            password: this.password,
          };

          axios
            .post("/api/v1/users/", formData)
            .then(() => {
              toast({
                message: "Account created, please log in!",
                type: "is-success",
                dismissible: true,
                pauseOnHover: true,
                duration: 2000,
                position: "bottom-right",
              });
              this.$router.push("/log-in");
            })
            .catch((error) => {
              if (error.response) {
                for (const property in error.response.data) {
                  this.errors.push(
                    `${property}: ${error.response.data[property]}`
                  );
                }
                console.error("Signup error:", error.response.data);
              } else if (error.message) {
                this.errors.push("Something went wrong. Please try again");
                console.error("Signup error:", error);
              }
            });
        }
      }
    }
  };
</script>

<style scoped>
  .page-sign-up {
    padding: 20px;
  }

  .button.is-success {
    background-color: #4285F4;
    border-color: transparent;
    color: white;
    width: 100%;
    padding: 1em;
    font-weight: 500;
  }

  .button.is-success:hover {
    background-color: #357ABD;
  }

  .button.is-success[disabled] {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .fa-google {
    margin-right: 8px;
  }

  .fa-spinner {
    margin-right: 8px;
  }

  .notification.is-danger {
    margin-top: 10px;
    padding: 10px;
  }

  hr {
    margin: 1.5rem 0;
  }
</style>