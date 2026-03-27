<template>
  <div class="books-page">
    <div class="container">
      <div class="page-header">
        <h1>图书列表</h1>
        <router-link v-if="userStore.isLoggedIn" to="/upload" class="btn btn-cta">上传图书</router-link>
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label>分类</label>
          <select v-model="filters.categoryId" @change="handleFilter">
            <option value="">全部分类</option>
            <option v-for="cat in bookStore.categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>排序</label>
          <select v-model="filters.sort" @change="handleFilter">
            <option value="hot">热门优先</option>
            <option value="new">最新优先</option>
            <option value="rating">评分优先</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>标签</label>
          <select v-model="filters.tagId" @change="handleFilter">
            <option value="">全部标签</option>
            <option v-for="tag in bookStore.tags" :key="tag.id" :value="tag.id">
              {{ tag.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div v-if="bookStore.loading" class="loading">加载中...</div>
      
      <div v-else class="book-grid">
        <BookCard v-for="book in bookStore.books" :key="book.id" :book="book" />
      </div>
      
      <div v-if="!bookStore.loading && bookStore.books.length === 0" class="empty">
        <p>暂无图书</p>
      </div>
      
      <div v-if="bookStore.pagination.total > bookStore.pagination.pageSize" class="pagination">
        <button 
          class="btn btn-outline" 
          :disabled="bookStore.pagination.page <= 1"
          @click="changePage(-1)"
        >
          上一页
        </button>
        <span class="page-info">
          第 {{ bookStore.pagination.page }} / {{ Math.ceil(bookStore.pagination.total / bookStore.pagination.pageSize) }} 页
        </span>
        <button 
          class="btn btn-outline"
          :disabled="bookStore.pagination.page >= Math.ceil(bookStore.pagination.total / bookStore.pagination.pageSize)"
          @click="changePage(1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useBookStore } from '@/stores/book'
import { useUserStore } from '@/stores/user'
import BookCard from '@/components/common/BookCard.vue'

const bookStore = useBookStore()
const userStore = useUserStore()

const filters = reactive({
  categoryId: '',
  sort: 'hot',
  tagId: ''
})

onMounted(async () => {
  await Promise.all([
    bookStore.fetchBooks(),
    bookStore.fetchCategories(),
    bookStore.fetchTags()
  ])
})

function handleFilter() {
  bookStore.fetchBooks({
    categoryId: filters.categoryId || undefined,
    sort: filters.sort,
    tagId: filters.tagId || undefined
  })
}

function changePage(delta) {
  bookStore.fetchBooks({
    ...filters,
    page: bookStore.pagination.page + delta
  })
}
</script>

<style scoped>
.books-page {
  padding: 32px 0;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 2rem;
}

.filters {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  font-size: 0.875rem;
}

.filter-group select {
  min-width: 150px;
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

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;
}

.page-info {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-group select {
    width: 100%;
  }
}
</style>