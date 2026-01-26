import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

/**
 * 用户状态 store
 * 管理登录用户信息，支持按角色（USER/ADMIN）动态控制 UI
 */
export const useUserStore = defineStore('user', () => {
  const userInfo = ref(null)

  /** 是否为管理员（兼容 ADMIN / admin） */
  const isAdmin = computed(() => {
    const r = userInfo.value?.role
    return r === 'ADMIN' || r === 'admin'
  })

  /** 当前用户角色 */
  const role = computed(() => userInfo.value?.role || '')

  function setUser(info) {
    userInfo.value = info || null
  }

  function clearUser() {
    userInfo.value = null
  }

  /** 从 localStorage 恢复用户信息（刷新页面后） */
  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('userInfo')
      if (raw) {
        const data = JSON.parse(raw)
        userInfo.value = data
      } else {
        userInfo.value = null
      }
    } catch (e) {
      console.error('解析 userInfo 失败', e)
      userInfo.value = null
    }
  }

  return {
    userInfo,
    isAdmin,
    role,
    setUser,
    clearUser,
    loadFromStorage
  }
})
