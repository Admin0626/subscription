<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <svg class="auth-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
        <h1>欢迎回来</h1>
        <p>登录您的账户</p>
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="email">邮箱</label>
          <input v-model="form.email" type="email" id="email" placeholder="your@email.com" required>
        </div>
        
        <div class="input-group">
          <label for="password">密码</label>
          <input v-model="form.password" type="password" id="password" placeholder="••••••••" required>
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <p class="auth-footer">
        还没有账户？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  email: '',
  password: ''
})
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  
  try {
    await userStore.login(form)
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-lg);
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo {
  width: 48px;
  height: 48px;
  color: var(--primary);
  margin-bottom: 16px;
}

.auth-header h1 {
  font-size: 1.75rem;
  color: var(--text);
  margin-bottom: 8px;
}

.auth-header p {
  color: var(--text-secondary);
}

.btn-full {
  width: 100%;
  margin-top: 8px;
}

.error-message {
  color: var(--error);
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  color: var(--text-secondary);
}

.auth-footer a {
  font-weight: 600;
}
</style>