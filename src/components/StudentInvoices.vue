<template>
  <div class="student-invoices">
    <h2>我的账单</h2>
    <div class="action-bar">
      <el-button type="primary" @click="fetchStudentInvoices">刷新</el-button>
    </div>
    <div class="invoice-list">
      <el-table :data="invoices" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="course.name" label="课程名称" />
        <el-table-column prop="teacher.name" label="教师名称" />
        <el-table-column prop="amount" label="账单费用" />
        <el-table-column label="支付状态">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 1"
              size="small"
              type="primary"
              @click="onPayInvoice(scope.row)"
            >
              支付
            </el-button>
            <el-button v-else size="small" disabled>
              {{ scope.row.status === 2 ? '已支付' : '支付失败' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="totalInvoices > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalInvoices"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination-container"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ElMessage,
  ElMessageBox,
  ElTable,
  ElTableColumn,
  ElTag,
  ElButton,
  ElPagination,
} from 'element-plus'
import api from '@/utils/api'
import apiEndpoints from '@/utils/apiEndpoints' // 导入 API 端点

interface Invoice {
  id: number
  course_id: number
  student_id: number
  teacher_id: number
  amount: string
  status: number // 1.待支付，2.支付成功，3.支付失败
  sent_at: string | null
  created_at: string
  updated_at: string
  transaction_id: string
  course: {
    id: number
    name: string
  }
  teacher: {
    id: number
    name: string
  }
}

const invoices = ref<Invoice[]>([])
const currentPage = ref(1)
const pageSize = ref(10) // 默认每页显示10条
const totalInvoices = ref(0)

// 获取学生自己的账单列表（带分页）

const fetchStudentInvoices = async () => {
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
    }
    // 使用集中的端点获取学生账单数据
    const response = await api.get(apiEndpoints.invoices.student, { params })
    // 确保正确解析API返回的数据结构
    if (response && typeof response === 'object') {
      invoices.value = response.data || [] // 账单列表
      totalInvoices.value = response.total || 0 // 总数
    } else {
      invoices.value = []
      totalInvoices.value = 0
    }
  } catch (error) {
    console.error('获取我的账单列表失败:', error)
    // ElMessage 已在拦截器中处理，但可以根据需要添加特定于此组件的错误提示
    // ElMessage.error('加载账单数据失败，请稍后再试')
  }
}

// 支付账单
const dialogVisible = ref(false)
const paymentUrl = ref('')

const onPayInvoice = async (invoice: Invoice) => {
  try {
    // const response = await api.post(apiEndpoints.invoices.pay(invoice.id))
    const response = {}
    response.payment_url =
      'https://pay.omise.co/payments/pay2_test_63fhj3mdglnklzgivac/authorize?acs=false'
    ElMessage.success('获取支付链接成功')
    if (response.payment_url) {
      paymentUrl.value = response.payment_url
      dialogVisible.value = true
      // 添加打开支付页面和复制链接功能
      ElMessageBox.confirm(
        '支付完成之后请点击刷新按钮刷新数据，只有成功支付状态才会变更',
        '支付链接已生成',
        {
          confirmButtonText: '复制链接',
          cancelButtonText: '打开支付页面',
          showClose: true,
        },
      )
        .then(() => {
          navigator.clipboard.writeText(response.payment_url)
          ElMessage.success('支付链接已复制到剪贴板')
        })
        .catch(() => {
          window.open(response.payment_url, '_blank')
        })
    }
  } catch (error) {
    console.error('获取支付链接失败:', error)
  }
}

// Helper function for status tag type
const getStatusType = (status: number): 'warning' | 'success' | 'danger' | 'info' => {
  switch (status) {
    case 1:
      return 'warning' // 待支付
    case 2:
      return 'success' // 支付成功
    case 3:
      return 'danger' // 支付失败
    default:
      return 'info'
  }
}

// Helper function for status text
const getStatusText = (status: number): string => {
  switch (status) {
    case 1:
      return '待支付'
    case 2:
      return '支付成功'
    case 3:
      return '支付失败'
    default:
      return '未知状态'
  }
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 页大小改变时，回到第一页
  fetchStudentInvoices()
}

// 处理当前页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchStudentInvoices()
}

// Fetch data when component is mounted
onMounted(() => {
  fetchStudentInvoices()
})

defineExpose({
  fetchStudentInvoices,
})
</script>

<style scoped>
.student-invoices {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.invoice-list {
  margin-top: 24px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end; /* 让分页控件靠右 */
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}
</style>
