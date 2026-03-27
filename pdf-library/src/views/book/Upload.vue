<template>
  <div class="upload-page">
    <div class="container">
      <h1>上传图书</h1>
      
      <form @submit.prevent="handleSubmit" class="upload-form">
        <div class="input-group">
          <label>上传 PDF 文件</label>
          <div 
            class="dropzone" 
            :class="{ dragging: isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <input type="file" id="file" accept=".pdf" @change="handleFileChange">
            <label for="file" class="dropzone-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span v-if="!selectedFile">拖拽或点击上传 PDF 文件</span>
              <span v-else>{{ selectedFile.name }}</span>
            </label>
          </div>
        </div>
        
        <div class="input-group">
          <label for="title">书名</label>
          <input v-model="form.title" type="text" id="title" required>
        </div>
        
        <div class="input-group">
          <label for="author">作者</label>
          <input v-model="form.author" type="text" id="author" required>
        </div>
        
        <div class="input-group">
          <label for="category">分类</label>
          <select v-model="form.categoryId" id="category" required>
            <option value="">选择分类</option>
            <option v-for="cat in bookStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        
        <div class="input-group">
          <label for="tags">标签 (逗号分隔)</label>
          <input v-model="form.tags" type="text" id="tags" placeholder="技术,编程,前端">
        </div>
        
        <div class="input-group">
          <label for="description">简介</label>
          <textarea v-model="form.description" id="description" rows="4"></textarea>
        </div>
        
        <div class="input-group">
          <label>封面图片 (可选)</label>
          <input type="file" accept="image/*" @change="handleCoverChange">
        </div>
        
        <p v-if="error" class="error-message">{{ error }}</p>
        
        <button type="submit" class="btn btn-primary" :disabled="loading || !selectedFile">
          {{ loading ? '上传中...' : '提交审核' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookStore } from '@/stores/book'

const router = useRouter()
const bookStore = useBookStore()

const selectedFile = ref(null)
const coverFile = ref(null)
const isDragging = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  title: '',
  author: '',
  categoryId: '',
  tags: '',
  description: ''
})

onMounted(() => {
  bookStore.fetchCategories()
  bookStore.fetchTags()
})

function handleFileChange(e) {
  const file = e.target.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    error.value = '请上传 PDF 文件'
  }
}

function handleDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    error.value = '请上传 PDF 文件'
  }
}

function handleCoverChange(e) {
  coverFile.value = e.target.files[0]
}

async function handleSubmit() {
  error.value = ''
  loading.value = true
  
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('title', form.title)
    formData.append('author', form.author)
    formData.append('categoryId', form.categoryId)
    formData.append('tags', form.tags)
    formData.append('description', form.description)
    if (coverFile.value) {
      formData.append('cover', coverFile.value)
    }
    
    await bookStore.createBook(formData)
    alert('上传成功，等待审核！')
    router.push('/')
  } catch (e) {
    error.value = e.message || '上传失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.upload-page {
  padding: 48px 0;
}

.upload-page h1 {
  margin-bottom: 32px;
}

.upload-form {
  max-width: 600px;
  background: var(--surface);
  padding: 32px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.dropzone {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 48px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.dropzone.dragging {
  border-color: var(--primary);
  background: var(--bg);
}

.dropzone input {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);
}

.dropzone-content svg {
  width: 48px;
  height: 48px;
}

.error-message {
  color: var(--error);
  margin-bottom: 16px;
}
</style>