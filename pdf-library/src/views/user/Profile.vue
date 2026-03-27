<template>
  <div class="profile-page">
    <div class="container">
      <div class="profile-card">
        <div class="profile-header">
          <div class="avatar" @click="triggerUpload">
            <img v-if="previewUrl" :src="previewUrl" alt="avatar">
            <span v-else>{{ userStore.user?.nickname?.[0] || '?' }}</span>
            <input type="file" ref="avatarInput" accept="image/*" @change="handleAvatarChange" hidden>
          </div>
          <div class="user-info">
            <h1>{{ userStore.user?.nickname }}</h1>
            <p>{{ userStore.user?.email }}</p>
            <span class="badge" :class="userStore.user?.role === 'admin' ? 'badge-primary' : 'badge-success'">
              {{ userStore.user?.role === 'admin' ? '管理员' : '用户' }}
            </span>
          </div>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-value">{{ userStore.user?.points || 0 }}</span>
            <span class="stat-label">积分</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ userStore.user?.free_downloads || 0 }}</span>
            <span class="stat-label">免费下载次数</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.sharedBooks }}</span>
            <span class="stat-label">分享图书</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.downloadedBooks }}</span>
            <span class="stat-label">下载图书</span>
          </div>
        </div>
        
        <form @submit.prevent="handleUpdate" class="profile-form">
          <div class="input-group">
            <label for="nickname">昵称</label>
            <input v-model="form.nickname" type="text" id="nickname">
          </div>
          
          <div class="input-group">
            <label for="bio">个人简介</label>
            <textarea v-model="form.bio" id="bio" rows="3"></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary">保存修改</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const avatarInput = ref(null)
const previewUrl = ref('')
const loading = ref(false)

const form = reactive({
  nickname: '',
  bio: ''
})

const stats = reactive({
  sharedBooks: 0,
  downloadedBooks: 0
})

onMounted(async () => {
  await userStore.fetchProfile()
  form.nickname = userStore.user?.nickname || ''
  form.bio = userStore.user?.bio || ''
  previewUrl.value = userStore.user?.avatar || ''
})

function triggerUpload() {
  avatarInput.value.click()
}

function handleAvatarChange(e) {
  const file = e.target.files[0]
  if (file) {
    previewUrl.value = URL.createObjectURL(file)
  }
}

async function handleUpdate() {
  loading.value = true
  try {
    await userStore.updateProfile({
      nickname: form.nickname,
      bio: form.bio
    })
    alert('保存成功！')
  } catch (e) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  padding: 48px 0;
}

.profile-card {
  max-width: 600px;
  margin: 0 auto;
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow);
}

.profile-header {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  overflow: hidden;
  cursor: pointer;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h1 {
  font-size: 1.5rem;
  margin-bottom: 4px;
}

.user-info p {
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: var(--bg);
  border-radius: var(--radius);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.profile-form {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>