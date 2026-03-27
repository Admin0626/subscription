<template>
  <div class="admin-books-page">
    <div class="page-header">
      <h2>图书管理</h2>
      <router-link to="/upload" class="btn btn-cta">上传图书</router-link>
    </div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>书名</th>
            <th>作者</th>
            <th>分类</th>
            <th>状态</th>
            <th>下载量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.category?.name || '-' }}</td>
            <td>
              <span class="badge" :class="getStatusClass(book.status)">
                {{ getStatusText(book.status) }}
              </span>
            </td>
            <td>{{ book.download_count || 0 }}</td>
            <td>
              <button class="btn-link" @click="handleDelete(book.id)">删除</button>
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

const books = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await adminApi.getAllBooks()
    books.value = res.data.list
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function getStatusClass(status) {
  const map = {
    approved: 'badge-success',
    pending: 'badge-warning',
    rejected: 'badge-error'
  }
  return map[status] || ''
}

function getStatusText(status) {
  const map = {
    approved: '已发布',
    pending: '待审核',
    rejected: '已拒绝'
  }
  return map[status] || status
}

async function handleDelete(id) {
  if (confirm('确定要删除这本书吗？')) {
    try {
      await adminApi.deleteBook(id)
      books.value = books.value.filter(b => b.id !== id)
      alert('删除成功')
    } catch (e) {
      alert(e.message)
    }
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: var(--error);
  background: none;
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>