import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, userApi } from '@/api'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function fetchProfile() {
    try {
      const data = await userApi.getProfile()
      user.value = data.data
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      logout()
    }
  }

  async function login(credentials) {
    loading.value = true
    try {
      const res = await authApi.login(credentials)
      user.value = res.data.user
      token.value = res.data.token
      localStorage.setItem('token', token.value)
      return res
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      const res = await authApi.register(userData)
      user.value = res.data.user
      token.value = res.data.token
      localStorage.setItem('token', token.value)
      return res
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (e) {
      // ignore
    }
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
  }

  async function updateProfile(data) {
    const res = await userApi.updateProfile(data)
    user.value = res.data
    return res
  }

  async function fetchPoints() {
    const res = await userApi.getPoints()
    return res.data
  }

  return {
    user,
    token,
    loading,
    isLoggedIn,
    isAdmin,
    fetchProfile,
    login,
    register,
    logout,
    updateProfile,
    fetchPoints
  }
})