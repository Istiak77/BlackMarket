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
                googleClientId:
                    "1000611960672-7c0qdquqmbu9v0jcmfht1uoe4fi7bh28.apps.googleusercontent.com", // <---- Replace this with your Google OAuth client ID
            };
        },
        mounted() {
            // Load Google Identity Services script
            const script = document.createElement("script");
            script.src = "https://accounts.google.com/gsi/client";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        },
        methods: {
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
                                console.log(JSON.stringify(error.response.data));
                            } else if (error.message) {
                                this.errors.push("Something went wrong. Please try again");
                                console.log(JSON.stringify(error));
                            }
                        });
                }
            },

            loginWithGoogle() {
                if (
                    !window.google ||
                    !window.google.accounts ||
                    !window.google.accounts.id
                ) {
                    this.errors = [
                        "Google API not loaded yet. Please try again in a moment.",
                    ];
                    return;
                }

                window.google.accounts.id.initialize({
                    client_id: this.googleClientId,
                    callback: this.handleGoogleCredentialResponse,
                });

                // Show Google One Tap or Popup sign in
                window.google.accounts.id.prompt();
            },

            handleGoogleCredentialResponse(response) {
                const googleToken = response.credential;

                axios
                    .post("http://localhost:8000/api/v1/auth/google/", {
                        access_token: googleToken,
                    })
                    .then((res) => {
                        const token = res.data.access_token || res.data.token || null;
                        if (token) {
                            localStorage.setItem("authToken", token);
                            toast({
                                message: "Logged in successfully via Google!",
                                type: "is-success",
                                dismissible: true,
                                pauseOnHover: true,
                                duration: 2000,
                                position: "bottom-right",
                            });
                            this.$router.push("/");
                        } else {
                            this.errors = ["Unexpected response from server."];
                        }
                    })
                    .catch((error) => {
                        this.errors = [];
                        if (error.response) {
                            for (const key in error.response.data) {
                                this.errors.push(`${key}: ${error.response.data[key]}`);
                            }
                        } else {
                            this.errors.push("Login failed. Please try again.");
                        }
                    });
            },
        },
    };
</script>