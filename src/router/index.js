import { createRouter, createWebHistory } from 'vue-router';

// Import Layout Components
import PublicLayout from '@/layouts/PublicLayout.vue';
import UserLayout from '@/layouts/UserLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

// Import public pages
import HomePage from '@/views/publicPages/HomePage.vue';
import UserDashboard from '@/views/user/UserDashboard.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';

const routes = [
  // Public Routes with PublicLayout
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomePage },
    
    ]
  },

  // User Routes with UserLayout
  {
    path: '/user',
    component: UserLayout,
    children: [
      { path: 'dashboard', name: 'UserDashboard', component: UserDashboard, meta: { requiresAuth: true } },
      // ...other user routes
    ]
  },

  // Admin Routes with AdminLayout
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
      // ...other admin routes
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;