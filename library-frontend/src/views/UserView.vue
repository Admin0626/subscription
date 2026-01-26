<template>
  <div class="user-container">
    <el-card>
      <!-- 头部：标题和新增按钮 -->
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="handleAdd">新增用户</el-button>
        </div>
      </template>

      <!-- 搜索表单 -->
      <el-form :inline="true" :model="searchForm" class="search-row">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户表格 -->
      <el-table :data="userList" v-loading="loading" border stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="nickname" label="昵称" width="150" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.role === 'admin'" type="danger">管理员</el-tag>
            <el-tag v-else>普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
              {{ row.status === 'ACTIVE' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleResetPassword(row)">重置密码</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="el-pagination"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        @close="handleDialogClose"
    >
      <el-form
          ref="userFormRef"
          :model="userForm"
          :rules="rules"
          label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
              v-model="userForm.password"
              type="password"
              placeholder="新增用户时必填"
              show-password
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option label="正常" value="ACTIVE" />
            <el-option label="禁用" value="INACTIVE" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog
        v-model="resetPasswordDialogVisible"
        title="重置密码成功"
        width="500px"
    >
      <el-alert
          title="新密码已生成"
          type="success"
          :closable="false"
          show-icon
      />
      <div class="password-display">
        <p>用户：<strong>{{ resetPasswordInfo.username }}</strong></p>
        <p>新密码：<span class="password-text">{{ resetPasswordInfo.newPassword }}</span></p>
        <el-button type="primary" size="small" @click="copyPassword">复制密码</el-button>
      </div>
      <template #footer>
        <el-button type="primary" @click="resetPasswordDialogVisible = false">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUsers, searchUsers, createUser, updateUser, deleteUser, resetUserPassword } from '@/api/user'

// 用户列表数据
const userList = ref([])
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  username: '',
  email: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const userFormRef = ref(null)

// 用户表单
const userForm = reactive({
  id: null,
  username: '',
  password: '',
  nickname: '',
  email: '',
  role: 'user',
  status: 'ACTIVE'
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度必须在2-20个字符之间', trigger: 'blur' }
  ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (!userForm.id && !value) {
          callback(new Error('新增用户时密码不能为空'))
        } else if (value && value.length < 6) {
          callback(new Error('密码长度不能少于6位'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 重置密码弹窗
const resetPasswordDialogVisible = ref(false)
const resetPasswordInfo = reactive({
  userId: null,
  username: '',
  newPassword: ''
})

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    let response
    if (searchForm.username || searchForm.email) {
      // 搜索用户
      const params = {
        username: searchForm.username || undefined,
        email: searchForm.email || undefined,
        page: pagination.currentPage - 1,
        size: pagination.pageSize,
        sort: 'createTime',
        direction: 'desc'
      }
      response = await searchUsers(params)
    } else {
      // 获取所有用户
      const params = {
        page: pagination.currentPage - 1,
        size: pagination.pageSize,
        sort: 'createTime',
        direction: 'desc'
      }
      response = await getUsers(params)
    }

    if (response.code === 200 && response.data) {
      userList.value = response.data.content || []
      pagination.total = response.data.totalElements || 0
    } else {
      ElMessage.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败，请检查后端服务是否启动')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadUsers()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.email = ''
  pagination.currentPage = 1
  loadUsers()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增用户'
  Object.assign(userForm, {
    id: null,
    username: '',
    password: '',
    nickname: '',
    email: '',
    role: 'user',
    status: 'ACTIVE'
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑用户'
  Object.assign(userForm, {
    id: row.id,
    username: row.username,
    password: '',
    nickname: row.nickname,
    email: row.email,
    role: row.role,
    status: row.status
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这个用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await deleteUser(row.id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadUsers()
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败，请重试')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 重置密码
const handleResetPassword = (row) => {
  ElMessageBox.confirm(`确定要重置用户 "${row.username}" 的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await resetUserPassword(row.id)
      if (response.code === 200 && response.data) {
        resetPasswordInfo.userId = response.data.userId
        resetPasswordInfo.username = response.data.username
        resetPasswordInfo.newPassword = response.data.newPassword
        resetPasswordDialogVisible.value = true
      } else {
        ElMessage.error(response.message || '重置密码失败')
      }
    } catch (error) {
      console.error('重置密码失败:', error)
      ElMessage.error('重置密码失败，请重试')
    }
  }).catch(() => {
    ElMessage.info('已取消重置密码')
  })
}

// 复制密码
const copyPassword = () => {
  const password = resetPasswordInfo.newPassword
  navigator.clipboard.writeText(password).then(() => {
    ElMessage.success('密码已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

// 提交表单
const handleSubmit = async () => {
  try {
    const valid = await userFormRef.value.validate()
    if (!valid) return

    const data = {
      username: userForm.username,
      password: userForm.password,
      nickname: userForm.nickname,
      email: userForm.email,
      role: userForm.role,
      status: userForm.status
    }

    let response
    if (userForm.id) {
      // 更新用户（不传密码）
      delete data.password
      response = await updateUser(userForm.id, data)
    } else {
      // 创建用户
      response = await createUser(data)
    }

    if (response.code === 200) {
      ElMessage.success(response.message || '操作成功')
      dialogVisible.value = false
      loadUsers()
    } else {
      ElMessage.error(response.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  userFormRef.value?.resetFields()
}

// 分页变化
const handleSizeChange = (val) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  loadUsers()
}

const handleCurrentChange = (val) => {
  pagination.currentPage = val
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-row {
  margin-bottom: 20px;
}

.el-pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.password-display {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.password-display p {
  margin: 10px 0;
  font-size: 16px;
}

.password-text {
  display: inline-block;
  padding: 8px 16px;
  background-color: #67c23a;
  color: white;
  font-size: 20px;
  font-weight: bold;
  border-radius: 4px;
  letter-spacing: 2px;
}
</style>
