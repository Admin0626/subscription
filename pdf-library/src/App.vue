<template>
  <div id="app">
    <nav class="navbar">
      <div class="container nav-content">
        <router-link to="/" class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
          <span>PDF图书馆</span>
        </router-link>
        
        <div class="nav-links">
          <router-link to="/books">图书</router-link>
          <router-link to="/search">搜索</router-link>
        </div>
        
        <div class="nav-actions">
          <template v-if="userStore.isLoggedIn">
            <router-link to="/upload" class="btn btn-cta">上传图书</router-link>
            <router-link to="/notifications" class="nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </router-link>
            <router-link to="/user" class="user-avatar">
              <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" alt="avatar">
              <span v-else>{{ userStore.user?.nickname?.[0] || '?' }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline">登录</router-link>
            <router-link to="/register" class="btn btn-primary">注册</router-link>
          </template>
        </div>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="footer">
      <div class="container">
        <p>&copy; 2024 PDF图书馆 - 让知识触手可及</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  padding: 16px 0;
}

.nav-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.nav-links {
  display: flex;
  gap: 32px;
}

.nav-links a {
  color: var(--text);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: var(--radius);
  transition: all 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--primary);
  background: var(--bg);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.nav-icon:hover {
  background: var(--bg);
  color: var(--primary);
}

.nav-icon svg {
  width: 20px;
  height: 20px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.main-content {
  min-height: calc(100vh - 200px);
  padding: 32px 0;
}

.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 24px 0;
  text-align: center;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .nav-content {
    gap: 16px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 0.875rem;
  }
}</style>