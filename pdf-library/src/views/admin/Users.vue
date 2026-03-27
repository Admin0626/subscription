<template>
  <div class="admin-users-page">
    <h2>用户管理</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>邮箱</th>
            <th>昵称</th>
            <th>角色</th>
            <th>积分</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.email }}</td>
            <td>{{ user.nickname }}</td>
            <td>
              <span class="badge" :class="user.role === 'admin' ? 'badge-primary' : ''">
                {{ user.role === 'admin' ? '管理员' : '用户' }}
              </span>
            </td>
            <td>{{ user.points }}</td>
            <td>
              <span class="badge" :class="user.status === 'active' ? 'badge-success' : 'badge-error'">
                {{ user.status === 'active' ? '正常' : '禁用' }}
              </span>
            </td>
            <td>
              <button class="btn-link" @click="handleToggleStatus(user)">
                {{ user.status === 'active' ? '禁用' : '启用' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'

const users = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await adminApi.getAllUsers()
    users.value = res.data.list
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function handleToggleStatus(user) {
  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  try {
    await adminApi.updateUser(user.id, { status: newStatus })
    user.status = newStatus
    alert('操作成功')
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.admin-users-page h2 {
  margin-bottom: 24px;
}

.table-wrapper {
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

th {
  background: var(--bg);
  font-weight: 600;
}

tr:last-child td {
  border-bottom: none;
}

.btn-link {
  color: var(--primary);
  background: none;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>