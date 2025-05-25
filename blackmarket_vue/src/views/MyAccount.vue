<template>
    <div class="page-my-account">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h1 class="title">My account</h1>
                
                <!-- User Info Section -->
                <div class="box" v-if="userInfo">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-64x64">
                                <img 
                                    v-if="userInfo.picture" 
                                    :src="userInfo.picture" 
                                    alt="Profile picture"
                                    class="is-rounded"
                                >
                                <span v-else class="icon is-large">
                                    <i class="fas fa-user-circle fa-3x"></i>
                                </span>
                            </figure>
                        </div>
                        <div class="media-content">
                            <p class="title is-4">{{ userInfo.name || username }}</p>
                            <p class="subtitle is-6">{{ userInfo.email }}</p>
                            <p v-if="isGoogleUser" class="tag is-info">
                                <span class="icon">
                                    <i class="fab fa-google"></i>
                                </span>
                                <span>Google Account</span>
                            </p>
                            <p v-else class="tag is-light">Regular Account</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="column is-12">
                <button @click="logout()" class="button is-danger">
                    <span class="icon">
                        <i class="fas fa-sign-out-alt"></i>
                    </span>
                    <span>Log out</span>
                </button>
            </div>

            <hr>

            <div class="column is-12">
                <h2 class="subtitle">My orders</h2>

                <OrderSummary
                    v-for="order in orders"
                    v-bind:key="order.id"
                    v-bind:order="order" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'MyAccount',
    data() {
        return {
            orders: [],
            userInfo: null,
            username: localStorage.getItem('username') || '',
            isGoogleUser: false
        }
    },
    mounted() {
        document.title = 'My account | Black Market'
        this.getUserInfo()
        this.getMyOrders()
    },
    methods: {
        async getUserInfo() {
            try {
                // Check for Google user data
                const googleData = JSON.parse(localStorage.getItem('googleUser'))
                if (googleData) {
                    this.userInfo = {
                        name: googleData.name,
                        email: googleData.email,
                        picture: googleData.picture
                    }
                    this.isGoogleUser = true
                } else {
                    // For regular users, fetch from your API if needed
                    const response = await axios.get('/api/v1/users/me/')
                    this.userInfo = {
                        name: response.data.username,
                        email: response.data.email
                    }
                }
            } catch (error) {
                console.error("Error fetching user info:", error)
                // Fallback to basic info
                this.userInfo = {
                    name: this.username,
                    email: ''
                }
            }
        },
        logout() {
            // Clear all auth data
            axios.defaults.headers.common["Authorization"] = ""
            
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            localStorage.removeItem("userid")
            localStorage.removeItem("googleUser")
            localStorage.removeItem("authToken")

            this.$store.commit('removeToken')

            // Redirect to home with logout message
            this.$router.push('/?logout=true')
        },
        async getMyOrders() {
            this.$store.commit('setIsLoading', true)

            try {
                const response = await axios.get('/api/v1/orders/')
                this.orders = response.data
            } catch (error) {
                console.error("Error fetching orders:", error)
                this.$toast.error("Failed to load orders")
            } finally {
                this.$store.commit('setIsLoading', false)
            }
        }
    }
}
</script>

<style scoped>
.box {
    margin-bottom: 2rem;
}
.tag {
    margin-top: 0.5rem;
}
.media-content {
    padding-left: 1rem;
}
.image.is-rounded img {
    border-radius: 50%;
}
.button.is-danger .icon {
    margin-right: 0.5em;
}
</style>