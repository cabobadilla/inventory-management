import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from './views/Dashboard.vue'
import Inventory from './views/Inventory.vue'
import Orders from './views/Orders.vue'
import Demand from './views/Demand.vue'
import Spending from './views/Spending.vue'
import Reports from './views/Reports.vue'
import Backlog from './views/Backlog.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',         component: Dashboard, meta: { title: 'Dashboard', icon: 'dashboard',  showFilters: true  } },
    { path: '/inventory',component: Inventory, meta: { title: 'Inventory', icon: 'inventory',  showFilters: true  } },
    { path: '/orders',   component: Orders,    meta: { title: 'Orders',    icon: 'orders',     showFilters: true  } },
    { path: '/demand',   component: Demand,    meta: { title: 'Demand',    icon: 'demand',     showFilters: false } },
    { path: '/spending', component: Spending,  meta: { title: 'Spending',  icon: 'spending',   showFilters: true  } },
    { path: '/reports',  component: Reports,   meta: { title: 'Reports',   icon: 'reports',    showFilters: false } },
    { path: '/backlog',  component: Backlog,   meta: { title: 'Backlog',   icon: 'backlog',    showFilters: false } },
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
