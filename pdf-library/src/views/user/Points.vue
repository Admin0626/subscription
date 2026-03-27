<template>
  <div class="points-page">
    <div class="container">
      <h1>我的积分</h1>
      
      <div class="points-card">
        <div class="points-balance">
          <span class="balance-label">当前积分</span>
          <span class="balance-value">{{ pointsData.points || 0 }}</span>
        </div>
        
        <div class="free-downloads">
          <span>本月免费下载次数: {{ pointsData.freeDownloads || 0 }}</span>
        </div>
      </div>
      
      <h2>积分记录</h2>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="history.length" class="history-list">
        <div v-for="item in history" :key="item.id" class="history-item">
          <div class="history-info">
            <span class="history-type">{{ item.type }}</span>
            <span class="history-desc">{{ item.description }}</span>
          </div>
          <span class="history-amount" :class="item.amount > 0 ? 'positive' : 'negative'">
            {{ item.amount > 0 ? '+' : '' }}{{ item.amount }}
          </span>
        </div>
      </div>
      
      <div v-else class="empty">
        <p>暂无积分记录</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { userApi } from '@/api'

const pointsData = reactive({
  points: 0,
  freeDownloads: 0
})
const history = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [pointsRes, historyRes] = await Promise.all([
      userApi.getPoints(),
      userApi.getPointsHistory()
    ])
    pointsData.points = pointsRes.data.points
    pointsData.freeDownloads = pointsRes.data.freeDownloads
    history.value = historyRes.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.points-page {
  padding: 48px 0;
}

.points-page h1 {
  margin-bottom: 32px;
}

.points-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow);
  margin-bottom: 48px;
  text-align: center;
}

.points-balance {
  margin-bottom: 16px;
}

.balance-label {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.balance-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
}

.free-downloads {
  color: var(--text-secondary);
}

h2 {
  margin-bottom: 24px;
}

.history-list {
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
}

.history-item:last-child {
  border-bottom: none;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-type {
  font-weight: 600;
}

.history-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.history-amount {
  font-size: 1.25rem;
  font-weight: 600;
}

.history-amount.positive {
  color: var(--success);
}

.history-amount.negative {
  color: var(--error);
}

.loading, .empty {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>