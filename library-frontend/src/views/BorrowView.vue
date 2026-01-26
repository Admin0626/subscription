<template>
  <div class="borrow-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="default" @click="goHome" circle>
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <span style="margin-left: 10px;">借阅记录</span>
          </div>
        </div>
      </template>

      <!-- 标签页：我的借阅 / 全部借阅（管理员） -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="我的借阅" name="mine" />
        <el-tab-pane v-if="userStore.isAdmin" label="全部借阅" name="all" />
      </el-tabs>

      <!-- 逾期提示（管理员 + 有逾期时） -->
      <el-alert
        v-if="userStore.isAdmin && overdueList.length > 0"
        type="warning"
        :closable="false"
        show-icon
        class="overdue-alert"
      >
        <template #title>
          共 {{ overdueList.length }} 条逾期未还记录
          <el-button type="warning" size="small" link @click="showOverdue = true">查看详情</el-button>
        </template>
      </el-alert>

      <!-- 借阅表格 -->
      <el-table
        :data="recordList"
        v-loading="loading"
        stripe
        style="width: 100%; margin-top: 16px;"
      >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="bookTitle" label="书名" min-width="140" show-overflow-tooltip />
        <el-table-column prop="bookAuthor" label="作者" width="100" />
        <el-table-column prop="isbn" label="ISBN" width="130" />
        <el-table-column prop="quantity" label="数量" width="70" />
        <el-table-column prop="borrowDate" label="借阅日期" width="165">
          <template #default="{ row }">
            {{ formatDateTime(row.borrowDate) }}
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="应还日期" width="120">
          <template #default="{ row }">
            {{ row.dueDate || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="returnDate" label="归还日期" width="120">
          <template #default="{ row }">
            {{ row.returnDate || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'BORROWED'" type="primary">借阅中</el-tag>
            <el-tag v-else-if="row.status === 'RETURNED'" type="success">已归还</el-tag>
            <el-tag v-else-if="row.status === 'OVERDUE'" type="danger">已逾期</el-tag>
            <el-tag v-else>{{ row.status || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="userStore.isAdmin" prop="username" label="借阅人" width="100" />
        <el-table-column v-if="userStore.isAdmin" prop="overdueDays" label="逾期天数" width="90">
          <template #default="{ row }">
            <span v-if="row.isOverdue && row.overdueDays != null" class="overdue-days">
              {{ row.overdueDays }} 天
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="160">
          <template #default="{ row }">
            <template v-if="isMine && (row.status === 'BORROWED' || row.status === 'OVERDUE')">
              <el-button type="primary" size="small" link @click="handleExtend(row)">续借</el-button>
              <el-button type="danger" size="small" link @click="handleReturn(row)">还书</el-button>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        @size-change="loadRecords"
        @current-change="loadRecords"
      />
    </el-card>

    <!-- 逾期详情弹窗（管理员） -->
    <el-dialog
      v-model="showOverdue"
      title="逾期未还记录"
      width="800px"
    >
      <el-table :data="overdueList" stripe max-height="400">
        <el-table-column prop="bookTitle" label="书名" min-width="140" />
        <el-table-column prop="username" label="借阅人" width="100" />
        <el-table-column prop="dueDate" label="应还日期" width="120" />
        <el-table-column prop="overdueDays" label="逾期天数" width="90">
          <template #default="{ row }">
            {{ row.overdueDays != null ? row.overdueDays + ' 天' : '-' }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import {
  getMyRecords,
  getAllRecords,
  getOverdueRecords,
  returnBook,
  extendBorrow
} from '@/api/borrow'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref(userStore.isAdmin ? 'all' : 'mine')
const loading = ref(false)
const recordList = ref([])
const overdueList = ref([])
const showOverdue = ref(false)

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const isMine = computed(() => activeTab.value === 'mine')

function formatDateTime(val) {
  if (!val) return '-'
  if (typeof val === 'string') return val
  if (val instanceof Date) return val.toLocaleString('zh-CN')
  return String(val)
}

async function loadRecords() {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage - 1,
      size: pagination.pageSize,
      sort: 'borrowDate',
      direction: 'desc'
    }
    const api = isMine.value ? getMyRecords : getAllRecords
    const res = await api(params)

    if (res?.code === 200 && res?.data) {
      recordList.value = res.data.content || []
      pagination.total = res.data.totalElements ?? 0
    } else {
      ElMessage.error(res?.message || '获取借阅记录失败')
    }
  } catch (e) {
    console.error(e)
    ElMessage.error('获取借阅记录失败，请检查后端服务')
  } finally {
    loading.value = false
  }
}

async function loadOverdue() {
  if (!userStore.isAdmin) return
  try {
    const res = await getOverdueRecords()
    if (res?.code === 200 && Array.isArray(res?.data)) {
      overdueList.value = res.data
    }
  } catch {
    overdueList.value = []
  }
}

function handleExtend(row) {
  ElMessageBox.confirm(`确定续借《${row.bookTitle}》30 天？`, '续借', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(async () => {
      try {
        const res = await extendBorrow(row.id, 30)
        if (res?.code === 200) {
          ElMessage.success('续借成功')
          loadRecords()
        } else {
          ElMessage.error(res?.message || '续借失败')
        }
      } catch (e) {
        console.error(e)
        ElMessage.error('续借失败，请重试')
      }
    })
    .catch(() => {})
}

function handleReturn(row) {
  ElMessageBox.confirm(`确定归还《${row.bookTitle}》？`, '还书', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  })
    .then(async () => {
      try {
        const res = await returnBook({ borrowRecordId: row.id, quantity: row.quantity ?? 1 })
        if (res?.code === 200) {
          ElMessage.success('还书成功')
          loadRecords()
        } else {
          ElMessage.error(res?.message || '还书失败')
        }
      } catch (e) {
        console.error(e)
        ElMessage.error('还书失败，请重试')
      }
    })
    .catch(() => {})
}

function goHome() {
  router.push('/')
}

watch(activeTab, () => {
  pagination.currentPage = 1
  loadRecords()
})

onMounted(() => {
  loadRecords()
  loadOverdue()
})
</script>

<style scoped>
.borrow-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overdue-alert {
  margin-top: 12px;
}

.overdue-days {
  color: var(--el-color-danger);
  font-weight: 500;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
  display: flex;
}
</style>
