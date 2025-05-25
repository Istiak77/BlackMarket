import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '../views/HomeView.vue'

import Product from '../views/Product.vue'
import Category from '../views/Category.vue'
import Search from '../views/Search.vue'
import Cart from '../views/Cart.vue'
import SignUp from '../views/SignUp.vue'
import LogIn from '../views/LogIn.vue'
import MyAccount from '../views/MyAccount.vue'
import Checkout from '../views/Checkout.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue'
import PaymentFail from '../views/PaymentFail.vue'
import PaymentCancel from '../views/PaymentCancel.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/log-in',
    name: 'LogIn',
    component: LogIn
  },
{
  path: '/my-account',
  name: 'MyAccount',
  component: MyAccount,
  meta: { requiresAuth: true }
},
{
  path: '/my-orders',
  name: 'MyOrders',
  component: MyAccount, // Same component with different view
  meta: { requiresAuth: true }
},
  {
    path: '/search',
    name: 'Search',
    component: Search
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/cart/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  {
    path: '/payment/fail',
    name: 'PaymentFail',
    component: PaymentFail
  },
  {
    path: '/payment/cancel',
    name: 'PaymentCancel',
    component: PaymentCancel
  },

  {
    path: '/:category_slug/:product_slug',
    name: 'Product',
    component: Product
  },
  {
    path: '/:category_slug',
    name: 'Category',
    component: Category
  }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('token')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/log-in', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router