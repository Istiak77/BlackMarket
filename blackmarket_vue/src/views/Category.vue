<template>
    <div class="page-category">
        <div class="columns is-multiline">
            <div class="column is-12">
                <h2 class="is-size-2 has-text-centered">{{ category.name }}</h2>
            </div>
            <ProductBox v-for="product in category.products" v-bind:key="product.id" v-bind:product="product" />
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { toast } from 'bulma-toast'
    import ProductBox from '@/components/ProductBox'

    export default {
        name: 'Category',

        components: {
            ProductBox
        },

        data() {
            return {
                category: {
                    products: []
                }
            }
        },
        mounted() {
            this.getCategory()
        },

        watch: {
            $route(to, from) {
                if (to.name === 'Category') {
                    this.getCategory()
                }
            }
        },

methods: {
  async getCategory() {
    const categorySlug = this.$route.params.category_slug

    // If categorySlug is not a valid slug (e.g. 'payment-success'), handle differently
    if (categorySlug === 'payment-success') {
      // Redirect or show an error, or simply return
      console.warn(`Invalid category slug: ${categorySlug}`)
      return
    }

    this.$store.commit('setIsLoading', true)

    try {
      const response = await axios.get(`/api/v1/products/${categorySlug}/`)
      console.log('Category API response:', response.data)  // Debug log
      this.category = response.data
      document.title = this.category.name + ' | Black Market'
    } catch (error) {
      console.log(error)
      toast({
        message: 'Something went wrong. Please try again.',
        type: 'is-danger',
        dismissible: true,
        pauseOnHover: true,
        duration: 2000,
        position: 'bottom-right',
      })
    } finally {
      this.$store.commit('setIsLoading', false)
    }
  }
}

    }
</script>