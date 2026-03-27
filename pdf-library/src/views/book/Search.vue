<template>
  <div class="search-page">
    <div class="container">
      <div class="search-header">
        <div class="search-box">
          <input 
            v-model="keyword" 
            type="text" 
            placeholder="搜索图书标题、作者..."
            @keyup.enter="handleSearch"
          >
          <button class="btn btn-primary" @click="handleSearch">搜索</button>
        </div>
      </div>
      
      <div v-if="bookStore.loading" class="loading">搜索中...</div>
      
      <div v-else>
        <p class="search-result">找到 {{ bookStore.pagination.total }} 个结果</p>
        
        <div class="book-grid">
          <BookCard v-for="book in bookStore.books" :key="book.id" :book="book" />
        </div>
        
        <div v-if="bookStore.books.length === 0" class="empty">
          <p>未找到相关图书</p>
          <p class="hint">尝试不同的关键词或浏览所有图书</p>
          <router-link to="/books" class="btn btn-outline">浏览全部</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBookStore } from '@/stores/book'
import BookCard from '@/components/common/BookCard.vue'

const route = useRoute()
const bookStore = useBookStore()
const keyword = ref('')

onMounted(() => {
  if (route.query.q) {
    keyword.value = route.query.q
    handleSearch()
  }
})

watch(() => route.query.q, (newVal) => {
  if (newVal) {
    keyword.value = newVal
    handleSearch()
  }
})

function handleSearch() {
  if (keyword.value.trim()) {
    bookStore.searchBooks({ q: keyword.value })
  }
}
</script>

<style scoped>
.search-page {
  padding: 48px 0;
}

.search-header {
  margin-bottom: 32px;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 16px;
}

.search-box input {
  flex: 1;
}

.search-result {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.loading, .empty {
  text-align: center;
  padding: 48px;
}

.hint {
  color: var(--text-secondary);
  margin: 16px 0;
}
</style>