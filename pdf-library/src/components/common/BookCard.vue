<template>
  <div class="book-card" @click="goToDetail">
    <div class="book-cover">
      <img v-if="book.cover_url" :src="book.cover_url" :alt="book.title">
      <div v-else class="cover-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      </div>
      <div class="book-overlay">
        <span>查看详情</span>
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <div class="book-meta">
        <span class="meta-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {{ book.download_count || 0 }}
        </span>
        <span class="meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          {{ book.rating_avg?.toFixed(1) || '0.0' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function goToDetail() {
  router.push(`/books/${props.book.id}`)
}
</script>

<style scoped>
.book-card {
  cursor: pointer;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface);
  box-shadow: var(--shadow);
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.book-cover {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
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
  width: 48px;
  height: 48px;
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(79, 70, 229, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.book-overlay span {
  color: white;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid white;
  border-radius: var(--radius);
}

.book-info {
  padding: 16px;
}

.book-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.book-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.meta-item svg {
  width: 14px;
  height: 14px;
}

.meta-item:last-child svg {
  color: var(--warning);
}
</style>