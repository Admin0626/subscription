<template>
  <div class="favorites-page">
    <div class="container">
      <h1>我的收藏</h1>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="favorites.length" class="book-grid">
        <BookCard v-for="book in favorites" :key="book.id" :book="book" />
      </div>
      
      <div v-else class="empty">
        <p>暂无收藏</p>
        <router-link to="/books" class="btn btn-primary">浏览图书</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { favoriteApi } from '@/api'
import BookCard from '@/components/common/BookCard.vue'

const favorites = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await favoriteApi.getAll()
    favorites.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.favorites-page {
  padding: 48px 0;
}

.favorites-page h1 {
  margin-bottom: 32px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.loading, .empty {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>