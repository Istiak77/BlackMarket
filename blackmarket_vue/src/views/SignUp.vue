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
                    <button @click="loginWithGoogle" class="button is-success">
                        Login with Google
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
      isGoogleLoading: false
    };
  },
  mounted() {
    this.initializeGoogleAuth();
  },
  methods: {
    async initializeGoogleAuth() {
      this.isGoogleLoading = true;
      this.errors = [];
      
      try {
        await this.loadGoogleScript();
        
        if (window.google?.accounts?.id) {
          const config = {
            client_id: this.googleClientId,
            callback: this.handleGoogleCredentialResponse,
            ux_mode: 'popup',
            auto_select: false,
            hosted_domain: window.location.hostname === 'localhost' ? 'localhost' : undefined
          };

          // Add FedCM flag only if supported
          if (window.google.accounts.id.useFedcm) {
            config.use_fedcm_for_prompt = true;
          }

          window.google.accounts.id.initialize(config);

          // Backward-compatible prompt handling
          window.google.accounts.id.prompt(notification => {
            // Check for both old and new API versions
            if (typeof notification.isNotDisplayed === 'function') {
              // New FedCM API
              if (notification.isNotDisplayed()) {
                const reason = notification.getNotDisplayedReason?.() || 'unknown_reason';
                this.handlePromptError(reason);
              }
            } else if (typeof notification.isNotDisplayed === 'boolean') {
              // Old API
              if (notification.isNotDisplayed || notification.isSkippedMoment) {
                this.errors = ["Google sign-in popup was blocked. Please allow popups."];
              }
            }
          });
        }
      } catch (error) {
        console.error("Google auth initialization failed:", error);
        this.errors = ["Failed to initialize Google sign-in."];
      } finally {
        this.isGoogleLoading = false;
      }
    },

    handlePromptError(reason) {
      const errorMap = {
        "user_cancel": "Sign-in was canceled",
        "unregistered_origin": "This domain is not authorized",
        "invalid_client": "Invalid client configuration",
        "missing_client_id": "Missing client ID",
        "unknown_reason": "Unknown error occurred"
      };
      
      this.errors = [errorMap[reason] || "Google sign-in failed. Please try again."];
    },

    async loadGoogleScript() {
      return new Promise((resolve) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => {
          this.errors = ["Failed to load Google sign-in. Please refresh."];
        };
        document.head.appendChild(script);
      });
    },

    async handleGoogleCredentialResponse(response) {
      try {
        this.isGoogleLoading = true;
        this.errors = [];
        
        const res = await axios.post("/api/v1/auth/google/", {
          access_token: response.credential,
          id_token: response.credential
        });

        const token = res.data.key || res.data.access_token;
        if (!token) {
          throw new Error("No authentication token received");
        }

        // Store token and set default auth header
        localStorage.setItem("authToken", token);
        axios.defaults.headers.common["Authorization"] = `Token ${token}`;

        toast({
          message: "Logged in successfully via Google!",
          type: "is-success",
          dismissible: true,
          pauseOnHover: true,
          duration: 2000,
          position: "bottom-right",
        });

        this.$router.push("/");
      } catch (error) {
        console.error("Google auth error:", error.response?.data || error.message);
        
        let errorMessage = "Google login failed. Please try again.";
        if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response?.status === 400) {
          errorMessage = "Invalid request to server.";
        } else if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Invalid credentials.";
        }
        
        this.errors = [errorMessage];
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
    .button.is-success {
        background-color: #4285F4;
        border-color: transparent;
        color: white;
    }

    .button.is-success:hover {
        background-color: #357ABD;
    }

    .button.is-success[disabled] {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>