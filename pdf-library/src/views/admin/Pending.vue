<template>
  <div class="pending-page">
    <h2>待审核图书</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="pendingBooks.length" class="book-list">
      <div v-for="book in pendingBooks" :key="book.id" class="book-item">
        <div class="book-info">
          <h3>{{ book.title }}</h3>
          <p>作者: {{ book.author }}</p>
          <p>上传者: {{ book.uploader?.nickname || book.uploader?.email }}</p>
          <p>上传时间: {{ formatDate(book.created_at) }}</p>
        </div>
        
        <div class="book-actions">
          <button class="btn btn-primary" @click="handleReview(book.id, 'approve')">通过</button>
          <button class="btn btn-outline" @click="openRejectModal(book.id)">拒绝</button>
        </div>
      </div>
    </div>
    
    <div v-else class="empty">
      <p>暂无待审核的图书</p>
    </div>
    
    <div v-if="showRejectModal" class="modal-overlay" @click.self="showRejectModal = false">
      <div class="modal">
        <h3>拒绝原因</h3>
        <textarea v-model="rejectReason" placeholder="请输入拒绝原因..."></textarea>
        <div class="modal-actions">
          <button class="btn btn-outline" @click="showRejectModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmReject">确认拒绝</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api'

const pendingBooks = ref([])
const loading = ref(true)
const showRejectModal = ref(false)
const rejectReason = ref('')
const currentBookId = ref(null)

onMounted(async () => {
  await fetchPending()
})

async function fetchPending() {
  try {
    const res = await adminApi.getPendingBooks()
    pendingBooks.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleReview(id, action) {
  try {
    await adminApi.reviewBook(id, action)
    await fetchPending()
    alert('操作成功')
  } catch (e) {
    alert(e.message)
  }
}

function openRejectModal(id) {
  currentBookId.value = id
  rejectReason.value = ''
  showRejectModal.value = true
}

async function confirmReject() {
  try {
    await adminApi.reviewBook(currentBookId.value, 'reject', rejectReason.value)
    showRejectModal.value = false
    await fetchPending()
    alert('已拒绝')
  } catch (e) {
    alert(e.message)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.pending-page h2 {
  margin-bottom: 24px;
}

.book-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface);
  padding: 20px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.book-info h3 {
  font-size: 1.125rem;
  margin-bottom: 8px;
}

.book-info p {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.book-actions {
  display: flex;
  gap: 12px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--surface);
  padding: 24px;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 400px;
}

.modal h3 {
  margin-bottom: 16px;
}

.modal textarea {
  width: 100%;
  min-height: 100px;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.loading, .empty {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>