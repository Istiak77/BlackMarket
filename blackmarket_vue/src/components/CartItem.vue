<template>
  <tr>
    <td>
      <router-link :to="item.product.get_absolute_url">{{ item.product.name }}</router-link>
    </td>
    <td>Tk {{ item.product.price }}</td>
    <td class="has-text-centered">
      <button class="button is-small is-rounded-2 is-danger mx-1" @click="decrementQuantity(item)">-</button>
      <span class="quantity-display has-text-weight-bold has-text-primary mx-2">{{ item.quantity }}</span>
      <button class="button is-small is-rounded-2 is-success mx-1" @click="incrementQuantity(item)">+</button>
    </td>
    <td>Tk {{ getItemTotal(item).toFixed(2) }}</td>
    <td>
      <button class="delete" @click="removeFromCart(item)"></button>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'CartItem',
  props: {
    initialItem: Object
  },
  data() {
    return {
      item: this.initialItem
    }
  },
  methods: {
    getItemTotal(item) {
      return item.quantity * item.product.price
    },
    decrementQuantity(item) {
      item.quantity -= 1

      if (item.quantity === 0) {
        this.$emit('removeFromCart', item)
      }

      this.updateCart()
    },
    incrementQuantity(item) {
      item.quantity += 1

      this.updateCart()
    },
    updateCart() {
      localStorage.setItem('cart', JSON.stringify(this.$store.state.cart))
    },
    removeFromCart(item) {
      this.$emit('removeFromCart', item)

      this.updateCart()
    },
  },
}
</script>

<style scoped>
.quantity-display {
  font-size: 1.1rem;
  padding: 0 0.5em;
  display: inline-block;
  min-width: 1.5em;
  text-align: center;
}
</style>
