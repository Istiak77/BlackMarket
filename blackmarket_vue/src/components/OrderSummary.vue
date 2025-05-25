<template>
  <div class="box mb-5">
    <div class="columns is-multiline">
      <div class="column is-6">
        <h3 class="is-size-4">Order #{{ order.id }}</h3>
        <p class="has-text-grey">Date: {{ order.created_at }}</p>
      </div>
      <div class="column is-6">
        <p class="has-text-weight-bold">Status: {{ order.status }}</p>
        <p class="has-text-weight-bold">Total: ${{ order.total_price }}</p>
      </div>
    </div>

    <div class="columns is-multiline">
      <div class="column is-12">
        <h4 class="is-size-5">Products</h4>
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td>{{ item.product_name }}</td>
              <td>${{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>${{ item.price * item.quantity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSummary',
  props: {
    order: Object
  }
}
</script>

<style scoped>
.box {
  border: 1px solid #ddd;
}
.mb-5 {
  margin-bottom: 1.5rem;
}
</style>