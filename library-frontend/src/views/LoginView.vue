<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>📚 图书馆管理系统</h2>
          <p>用户登录</p>
        </div>
      </template>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="0">
        <el-form-item prop="username">
          <el-input
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="large" style="width: 100%;" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>

        <el-form-item>
          <div class="register-link">
            还没有账号？
            <el-link type="primary" @click="goToRegister">立即注册</el-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  try {
    const valid = await loginFormRef.value.validate()
    if (!valid) return

    const response = await login({
      username: loginForm.username,
      password: loginForm.password
    })

    const isSuccess = response.success || response.code === 200
    const data = response.data || response

    if (isSuccess && data) {
      const { password, ...safe } = data
      const userInfo = { ...safe, role: data.role || 'USER' }
      localStorage.setItem('userInfo', JSON.stringify(userInfo))

      const token = data.token || data.accessToken || 'mock-token-' + Date.now()
      localStorage.setItem('token', token)

      userStore.setUser(userInfo)
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      const msg = response?.message || '登录失败，请检查用户名和密码'
      ElMessage.error(msg)
    }
  } catch (err) {
    console.error('登录失败:', err)
    const msg = err?.response?.data?.message || '登录失败，请检查用户名和密码'
    ElMessage.error(msg)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0 0 10px 0;
  color: #303133;
}

.card-header p {
  margin: 0;
  color: #909399;
}

.register-link {
  width: 100%;
  text-align: center;
  color: #606266;
}
</style>