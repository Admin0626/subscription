<template>
  <div class="book-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button type="default" @click="goHome" circle>
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <span style="margin-left: 10px;">图书管理</span>
          </div>
          <el-button v-if="userStore.isAdmin" type="primary" @click="handleAdd">新增图书</el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-row :gutter="20" class="search-row">
        <el-col :span="8">
          <el-input
              v-model="searchForm.title"
              placeholder="请输入书名"
              clearable
              @clear="loadBooks"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-input
              v-model="searchForm.author"
              placeholder="请输入作者"
              clearable
              @clear="loadBooks"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-col>
      </el-row>

      <!-- 图书表格 -->
      <el-table :data="bookList" stripe style="width: 100%; margin-top: 20px;">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="isbn" label="ISBN" width="150" />
        <el-table-column prop="title" label="书名" width="200" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="publisher" label="出版社" width="150" />
        <el-table-column prop="publishDate" label="出版日期" width="120" />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span>¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="availableStock" label="库存" width="80">
          <template #default="{ row }">
            <el-tag :type="row.availableStock > 0 ? 'success' : 'danger'">
              {{ row.availableStock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column v-if="userStore.isAdmin" label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
          style="margin-top: 20px; justify-content: flex-end;"
          @size-change="loadBooks"
          @current-change="loadBooks"
      />
    </el-card>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="500px"
        @close="handleDialogClose"
    >
      <el-form :model="bookForm" :rules="rules" ref="bookFormRef" label-width="100px">
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="bookForm.isbn" placeholder="请输入ISBN" />
        </el-form-item>
        <el-form-item label="书名" prop="title">
          <el-input v-model="bookForm.title" placeholder="请输入书名" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="出版社" prop="publisher">
          <el-input v-model="bookForm.publisher" placeholder="请输入出版社" />
        </el-form-item>
        <el-form-item label="出版日期" prop="publishDate">
          <el-date-picker
              v-model="bookForm.publishDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="bookForm.price" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="bookForm.stock" :min="0" :precision="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="bookForm.category" placeholder="请选择分类" style="width: 100%;">
            <el-option label="文学" value="文学" />
            <el-option label="科技" value="科技" />
            <el-option label="历史" value="历史" />
            <el-option label="哲学" value="哲学" />
            <el-option label="艺术" value="艺术" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBooks, searchBooks, createBook, updateBook, deleteBook } from '@/api/book'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// 图书列表数据
const bookList = ref([])

// 搜索表单
const searchForm = reactive({
  title: '',
  author: ''
})

// 分页
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增图书')
const bookFormRef = ref(null)

// 图书表单
const bookForm = reactive({
  id: null,
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  publishDate: '',
  price: 0,
  stock: 0,
  category: ''
})

// 表单验证规则
const rules = {
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }],
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  publisher: [{ required: true, message: '请输入出版社', trigger: 'blur' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }]
}

// 加载图书列表
const loadBooks = async () => {
  try {
    // 判断是否使用搜索
    let response
    if (searchForm.title || searchForm.author) {
      // 使用搜索接口
      const params = {
        title: searchForm.title || undefined,
        author: searchForm.author || undefined,
        page: pagination.currentPage - 1, // 后端从0开始，前端从1开始
        size: pagination.pageSize,
        sort: 'createTime',
        direction: 'desc'
      }
      response = await searchBooks(params)
    } else {
      // 使用普通查询接口
      const params = {
        page: pagination.currentPage - 1,
        size: pagination.pageSize,
        sort: 'createTime',
        direction: 'desc'
      }
      response = await getBooks(params)
    }

    // 后端返回格式：{ success: true, data: { content: [], totalElements: 0 } }
    if (response.code === 200 && response.data) {
      bookList.value = response.data.content || []
      pagination.total = response.data.totalElements || 0
    } else {
      ElMessage.error(response.message || '获取图书列表失败')
    }
  } catch (error) {
    console.error('获取图书列表失败:', error)
    ElMessage.error('获取图书列表失败，请检查后端服务是否启动')
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadBooks()
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.author = ''
  pagination.currentPage = 1
  loadBooks()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增图书'
  Object.assign(bookForm, {
    id: null,
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    publishDate: '',
    price: 0,
    stock: 0,
    category: ''
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑图书'
  Object.assign(bookForm, {
    id: row.id,
    isbn: row.isbn,
    title: row.title,
    author: row.author,
    category: row.category,
    publisher: row.publisher || '',
    publishDate: row.publishDate || '',
    price: row.price || 0,
    stock: row.availableStock || row.totalStock || 0
  })
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      const response = await deleteBook(row.id)
      if (response.code === 200) {
        ElMessage.success('删除成功')
        loadBooks()
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

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    const valid = await bookFormRef.value.validate()
    if (!valid) return

    // 准备提交数据
    const data = {
      isbn: bookForm.isbn,
      title: bookForm.title,
      author: bookForm.author,
      category: bookForm.category,
      publisher: bookForm.publisher,
      publishDate: bookForm.publishDate,
      price: Number(bookForm.price),
      totalStock: bookForm.stock
    }

    let response
    if (bookForm.id) {
      // 编辑
      response = await updateBook(bookForm.id, data)
    } else {
      // 新增
      response = await createBook(data)
    }

    if (response.code === 200) {
      ElMessage.success(response.message || '操作成功')
      dialogVisible.value = false
      loadBooks()
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
  bookFormRef.value?.resetFields()
}

// 返回首页
const goHome = () => {
  router.push('/')
}

onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.book-container {
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
}
</style>