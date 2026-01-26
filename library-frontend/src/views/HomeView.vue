<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-content">
        <h1>📚 图书馆管理系统</h1>
        <div class="user-info">
          <el-dropdown @command="handleCommand">
    <span class="user-dropdown">
      <el-avatar :size="40" :src="userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
      <span>{{ userInfo?.nickname || userInfo?.username || (userStore.isAdmin ? '管理员' : '读者') }}</span>
    </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 主体内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-menu
            default-active="1"
            class="el-menu-vertical"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
        >
          <el-menu-item index="/">
            <el-icon><House /></el-icon>
            <span>首页概览</span>
          </el-menu-item>
          <el-menu-item index="/books">
            <el-icon><Reading /></el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.isAdmin" index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/borrows">
            <el-icon><Document /></el-icon>
            <span>借阅记录</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-main>
        <el-card class="welcome-card">
          <h2>欢迎来到图书馆管理系统</h2>
          <p>系统功能模块：</p>
          <ul>
            <li>图书信息管理（新增、编辑、删除、查询）</li>
            <li>读者信息管理（读者注册、信息维护）</li>
            <li>借阅记录管理（借书、还书、逾期处理）</li>
            <li>数据统计分析（借阅排行、库存统计）</li>
          </ul>
        </el-card>

        <!-- 数据统计卡片 -->
        <el-row :gutter="20" class="stats-row">
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <el-icon :size="40" color="#409eff"><Reading /></el-icon>
                <div class="stat-info">
                  <h3>图书总数</h3>
                  <p class="stat-number">{{ bookCount }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <el-icon :size="40" color="#67c23a"><User /></el-icon>
                <div class="stat-info">
                  <h3>读者总数</h3>
                  <p class="stat-number">{{ readerCount }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <el-icon :size="40" color="#e6a23c"><Document /></el-icon>
                <div class="stat-info">
                  <h3>今日借阅</h3>
                  <p class="stat-number">{{ todayBorrow }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card class="stat-card">
              <div class="stat-content">
                <el-icon :size="40" color="#f56c6c"><Warning /></el-icon>
                <div class="stat-info">
                  <h3>逾期未还</h3>
                  <p class="stat-number">{{ overdueCount }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getStats } from '@/api/stats'
import { ElMessage } from 'element-plus'
import { Document, House, Reading, User, Warning } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 统计数据
const bookCount = ref(0)
const readerCount = ref(0)
const todayBorrow = ref(0)
const overdueCount = ref(0)

// 确保 store 已从 localStorage 恢复（如从子页返回）
const loadUserInfo = () => {
  userStore.loadFromStorage()
}

// 加载统计数据
const loadStats = async () => {
  try {
    const response = await getStats()

    if (response.code === 200 && response.data) {
      bookCount.value = response.data.bookCount || 0
      readerCount.value = response.data.readerCount || 0
      todayBorrow.value = response.data.todayBorrowedCount || 0
      overdueCount.value = response.data.overdueCount || 0
    } else {
      ElMessage.error(response.message || '获取统计数据失败')
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败，请检查后端服务是否启动')
  }
}

// 下拉菜单命令处理
const handleCommand = (command) => {
  if (command === 'logout') {
    handleLogout()
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中...')
  }
}

// 退出登录
const handleLogout = () => {
  userStore.clearUser()
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/login')
}

onMounted(() => {
  loadUserInfo()
  loadStats()
})
</script>

<style scoped>
.home-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #409eff;
  color: white;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  width: 100%;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-card h2 {
  margin-top: 0;
  color: #303133;
}

.welcome-card ul {
  list-style: none;
  padding: 0;
}

.welcome-card li {
  padding: 8px 0;
  color: #606266;
}

.stats-row {
  margin-top: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #909399;
}

.stat-number {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.user-dropdown:hover {
  opacity: 0.8;
}
</style>