import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AuthLayout from '../layouts/AuthLayout.vue'
import MainLayout from '../layouts/AppLayout.vue'

// Views
import Dashboard from "../views/Dashboard.vue";
import Products from "../views/Products.vue";
import Login from "../views/Login.vue";
import CustomerManagement from "../views/CustomerManagement.vue"
import CustomerDetails from "../views/CustomerDetails.vue"
// import Register from "../views/Register.vue"; // Add this
import Orders from '../views/Orders.vue'
import NotFound from '../views/NotFound.vue'
import StoreConfig from '../views/StoreConfig.vue'
import Requests from '../views/Requests.vue'

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    meta: { public: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login
      },
      {
        path: '/login',
        redirect: '/auth/login'
      }
    ]
  },

  // Protected Routes (uses MainLayout)
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'dashboard',
        redirect: { name: 'dashboard' }
      },
      {
        path: 'products',
        name: 'Products',
        component: Products
      },
      {
        path: 'orders',
        name: 'orders',
        component: Orders
      },
      {
        path: 'config',
        name: 'Configration',
        component: StoreConfig
      },
      {
        path: 'requests',
        name: 'Requests',
        component: Requests
      },
      {
        path: 'CustomerManagement',
        name: 'CustomerManagement',
        component: CustomerManagement
      },
      {
        path: 'CustomerDetails/:id',
        name: 'CustomerDetails',
        component: CustomerDetails
      }
    ]
  },

  // 404 Catch-all
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: { public: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Improved Auth Guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem("token");

//   // Redirect logged-in users away from auth pages
//   if (to.meta.public && isAuthenticated) {
//     return next({ name: "dashboard" });
//   }

//   // Protect non-public routes
//   if (!to.meta.public && !isAuthenticated) {
//     return next({ name: "login" });
//   }

//   next();
// });

export default router
