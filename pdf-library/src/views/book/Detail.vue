<template>
  <div class="book-detail-page">
    <div class="container">
      <div v-if="bookStore.loading" class="loading">加载中...</div>
      
      <div v-else-if="bookStore.currentBook" class="book-detail">
        <div class="book-header">
          <div class="book-cover">
            <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title">
            <div v-else class="cover-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
          </div>
          
          <div class="book-info">
            <h1>{{ book.title }}</h1>
            <p class="author">作者: {{ book.author }}</p>
            
            <div class="meta">
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {{ book.download_count || 0 }} 次下载
              </span>
              <span class="meta-item">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {{ book.rating_avg?.toFixed(1) || '0.0' }} ({{ book.rating_count || 0 }} 人评分)
              </span>
            </div>
            
            <div v-if="book.category" class="category">
              <span class="badge badge-primary">{{ book.category.name }}</span>
            </div>
            
            <div v-if="book.tags?.length" class="tags">
              <span v-for="tag in book.tags" :key="tag.id" class="badge">{{ tag.name }}</span>
            </div>
            
            <p class="description">{{ book.description || '暂无简介' }}</p>
            
            <div class="actions">
              <button class="btn btn-cta" @click="handleDownload">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下载
              </button>
              <button class="btn btn-outline" @click="handleFavorite">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                收藏
              </button>
            </div>
          </div>
        </div>
        
        <div class="rating-section">
          <h3>评分</h3>
          <div class="rating-stars" @click="handleRate">
            <svg v-for="i in 5" :key="i" viewBox="0 0 24 24" :class="{ active: i <= userRating }">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/book'
import { useUserStore } from '@/stores/user'
import { favoriteApi } from '@/api'

const route = useRoute()
const bookStore = useBookStore()
const userStore = useUserStore()

const userRating = ref(0)

const book = computed(() => bookStore.currentBook)

onMounted(() => {
  bookStore.fetchBookDetail(route.params.id)
})

async function handleDownload() {
  if (!userStore.isLoggedIn) {
    return
  }
  try {
    await bookStore.downloadBook(book.value.id)
    alert('下载成功！')
  } catch (e) {
    alert(e.message)
  }
}

async function handleFavorite() {
  if (!userStore.isLoggedIn) {
    return
  }
  try {
    await favoriteApi.add(book.value.id)
    alert('收藏成功！')
  } catch (e) {
    alert(e.message)
  }
}

async function handleRate(e) {
  if (!userStore.isLoggedIn) {
    return
  }
  const rect = e.target.getBoundingClientRect()
  const x = e.clientX - rect.left
  const rating = Math.ceil((x / rect.width) * 5)
  userRating.value = rating
  
  try {
    await bookStore.rateBook(book.value.id, rating)
    alert('评分成功！')
  } catch (e) {
    alert(e.message)
  }
}
</script>

<style scoped>
.book-detail-page {
  padding: 48px 0;
}

.loading {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}

.book-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 48px;
  margin-bottom: 48px;
}

.book-cover {
  aspect-ratio: 3/4;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.5;
}

.cover-placeholder svg {
  width: 64px;
  height: 64px;
}

.book-info h1 {
  font-size: 2rem;
  margin-bottom: 16px;
}

.author {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.meta {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
}

.meta-item svg {
  width: 18px;
  height: 18px;
}

.meta-item:last-child svg {
  color: var(--warning);
}

.category, .tags {
  margin-bottom: 24px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  background: var(--bg);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
}

.description {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 32px;
}

.actions {
  display: flex;
  gap: 16px;
}

.actions .btn svg {
  width: 18px;
  height: 18px;
}

.rating-section h3 {
  margin-bottom: 16px;
}

.rating-stars {
  display: flex;
  gap: 8px;
  cursor: pointer;
}

.rating-stars svg {
  width: 40px;
  height: 40px;
  fill: var(--border);
  transition: fill 0.2s;
}

.rating-stars svg.active {
  fill: var(--warning);
}

@media (max-width: 768px) {
  .book-header {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .book-cover {
    max-width: 200px;
    margin: 0 auto;
  }
}
</style>