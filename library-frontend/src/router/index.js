import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import HomeView from '../views/HomeView.vue'
import BookView from '../views/BookView.vue'
import BorrowView from '../views/BorrowView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import UserView from '@/views/UserView.vue'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/books',
      name: 'books',
      component: BookView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UserView,
      meta: { title: '用户管理', requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/borrows',
      name: 'borrows',
      component: BorrowView,
      meta: { title: '借阅记录', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStore = useUserStore()

  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  if (to.path === '/login' || to.path === '/register') {
    if (token) next('/')
    else next()
    return
  }
  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    ElMessage.warning('无权限访问，仅管理员可操作')
    next('/')
    return
  }
  next()
})

export default router