import { createRouter, createWebHistory } from 'vue-router'

// Default layout import
import HomePage from '@/views/default-page/HomePage.vue'


// user imports
import Login from '@/views/user/auth/Login.vue'
import UserDashboard from '@/views/user/UserDashboard.vue'
import UserProfile from '@/views/user/UserProfile.vue'

// admin imports
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import ManageUsers from '@/views/admin/ManageUsers.vue'

const routes = [
  // Default/public routes
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
 
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // User-specific routes (authenticated)
 
  {
    path: '/user',
    name: 'UserRoot',
    redirect: { name: 'UserDashboard' },
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'UserDashboard',
        component: UserDashboard
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: UserProfile
      }
    ]
  },

  // Admin-specific routes (authenticated & authorized)
  
  {
    path: '/admin',
    name: 'AdminRoot',
    redirect: { name: 'AdminDashboard' },
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'ManageUsers',
        component: ManageUsers
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router