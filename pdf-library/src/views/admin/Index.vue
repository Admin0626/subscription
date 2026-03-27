<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h2>管理后台</h2>
      <nav>
        <router-link to="/admin/pending">待审核</router-link>
        <router-link to="/admin/books">图书管理</router-link>
        <router-link to="/admin/users">用户管理</router-link>
        <router-link to="/admin/stats">数据统计</router-link>
      </nav>
    </aside>
    
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 140px);
}

.admin-sidebar {
  width: 240px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 24px;
}

.admin-sidebar h2 {
  font-size: 1.25rem;
  margin-bottom: 24px;
  color: var(--primary);
}

.admin-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.admin-sidebar a {
  padding: 12px 16px;
  border-radius: var(--radius);
  color: var(--text);
  transition: all 0.2s;
}

.admin-sidebar a:hover,
.admin-sidebar a.router-link-active {
  background: var(--bg);
  color: var(--primary);
}

.admin-content {
  flex: 1;
  padding: 24px;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>