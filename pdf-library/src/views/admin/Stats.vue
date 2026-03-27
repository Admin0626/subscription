<template>
  <div class="admin-stats-page">
    <h2>数据统计</h2>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalUsers }}</span>
          <span class="stat-label">总用户数</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalBooks }}</span>
          <span class="stat-label">总图书数</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalDownloads }}</span>
          <span class="stat-label">总下载量</span>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats.totalPoints }}</span>
          <span class="stat-label">总积分</span>
        </div>
      </div>
    </div>
    
    <div class="charts-section">
      <h3>趋势图表</h3>
      <div class="chart-placeholder">
        <p>图表功能开发中...</p>
        <p class="hint">可以使用 Chart.js 或 ECharts 实现</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { adminApi } from '@/api'

const stats = reactive({
  totalUsers: 0,
  totalBooks: 0,
  totalDownloads: 0,
  totalPoints: 0
})
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await adminApi.getStats()
    Object.assign(stats, res.data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-stats-page h2 {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--surface);
  padding: 24px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 28px;
  height: 28px;
  color: var(--primary);
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.charts-section h3 {
  margin-bottom: 16px;
}

.chart-placeholder {
  background: var(--surface);
  padding: 48px;
  border-radius: var(--radius-lg);
  text-align: center;
  color: var(--text-secondary);
}

.hint {
  font-size: 0.875rem;
  margin-top: 8px;
}

.loading {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>