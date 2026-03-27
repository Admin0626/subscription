import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home/Index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/Register.vue')
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('@/views/book/List.vue')
  },
  {
    path: '/books/:id',
    name: 'book-detail',
    component: () => import('@/views/book/Detail.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/book/Search.vue')
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('@/views/book/Upload.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'user-profile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('@/views/user/Favorites.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/points',
    name: 'points',
    component: () => import('@/views/user/Points.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: () => import('@/views/user/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/Index.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        redirect: '/admin/pending'
      },
      {
        path: 'pending',
        name: 'admin-pending',
        component: () => import('@/views/admin/Pending.vue')
      },
      {
        path: 'books',
        name: 'admin-books',
        component: () => import('@/views/admin/Books.vue')
      },
      {
        path: 'users',
        name: 'admin-users',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'stats',
        name: 'admin-stats',
        component: () => import('@/views/admin/Stats.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresAdmin && userStore.user?.role !== 'admin') {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router