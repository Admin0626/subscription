<template>
  <div class="notifications-page">
    <div class="container">
      <h1>通知中心</h1>
      
      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="notifications.length" class="notification-list">
        <div 
          v-for="notif in notifications" 
          :key="notif.id" 
          class="notification-item"
          :class="{ unread: !notif.is_read }"
          @click="handleRead(notif)"
        >
          <div class="notif-icon">
            <svg v-if="notif.type === 'review'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          
          <div class="notif-content">
            <h3>{{ notif.title }}</h3>
            <p>{{ notif.content }}</p>
            <span class="notif-time">{{ formatTime(notif.created_at) }}</span>
          </div>
          
          <div v-if="!notif.is_read" class="unread-dot"></div>
        </div>
      </div>
      
      <div v-else class="empty">
        <p>暂无通知</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { notificationApi } from '@/api'

const notifications = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await notificationApi.getAll()
    notifications.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

async function handleRead(notif) {
  if (!notif.is_read) {
    try {
      await notificationApi.markRead(notif.id)
      notif.is_read = true
    } catch (e) {
      console.error(e)
    }
  }
}

function formatTime(time) {
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.notifications-page {
  padding: 48px 0;
}

.notifications-page h1 {
  margin-bottom: 32px;
}

.notification-list {
  background: var(--surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.notification-item {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: var(--bg);
}

.notification-item.unread {
  background: rgba(79, 70, 229, 0.05);
}

.notification-item:last-child {
  border-bottom: none;
}

.notif-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon svg {
  width: 20px;
  height: 20px;
  color: var(--primary);
}

.notif-content {
  flex: 1;
}

.notif-content h3 {
  font-size: 1rem;
  margin-bottom: 4px;
}

.notif-content p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 8px;
}

.notif-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
}

.loading, .empty {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}
</style>