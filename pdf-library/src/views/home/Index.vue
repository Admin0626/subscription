<template>
  <div class="home-page">
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">探索知识的海洋</h1>
        <p class="hero-subtitle">发现、分享、探索 PDF 图书资源</p>
        
        <div class="search-box">
          <input 
            v-model="searchKeyword" 
            type="text" 
            placeholder="搜索图书标题、作者..."
            @keyup.enter="goSearch"
          >
          <button class="btn btn-cta" @click="goSearch">搜索</button>
        </div>
      </div>
    </section>
    
    <section class="section">
      <div class="container">
        <div v-if="homeStore.announcements.length" class="announcements">
          <div v-for="item in homeStore.announcements" :key="item.id" class="announcement">
            <span class="announcement-badge">公告</span>
            <span>{{ item.title }}</span>
          </div>
        </div>
        
        <h2 class="section-title">热门推荐</h2>
        <div class="book-grid">
          <BookCard v-for="book in homeStore.hotBooks" :key="book.id" :book="book" />
        </div>
        
        <h2 class="section-title">随机发现</h2>
        <div class="book-grid">
          <BookCard v-for="book in homeStore.randomBooks" :key="book.id" :book="book" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHomeStore } from '@/stores/home'
import BookCard from '@/components/common/BookCard.vue'

const router = useRouter()
const homeStore = useHomeStore()
const searchKeyword = ref('')

onMounted(() => {
  homeStore.fetchHomeData()
})

function goSearch() {
  router.push({ name: 'search', query: { q: searchKeyword.value } })
}
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 40px;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.search-box input {
  flex: 1;
  border: none;
  padding: 20px 24px;
  font-size: 1rem;
}

.search-box input:focus {
  box-shadow: none;
}

.search-box .btn {
  padding: 20px 32px;
  border-radius: 0;
}

.section {
  padding: 48px 0;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--text);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.announcements {
  margin-bottom: 32px;
}

.announcement {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--surface);
  border-radius: var(--radius);
  border-left: 4px solid var(--cta);
}

.announcement-badge {
  background: var(--cta);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .hero {
    padding: 48px 0;
  }
  
  .search-box {
    flex-direction: column;
  }
  
  .search-box .btn {
    width: 100%;
  }
}
</style>