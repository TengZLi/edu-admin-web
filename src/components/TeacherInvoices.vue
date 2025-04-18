<template>
  <div class="teacher-invoices">
    <div class="action-bar">
      <el-button type="primary" @click="showBillDialog">创建账单</el-button>
    </div>
    <el-table :data="bills" border style="width: 100%">
      <el-table-column prop="course.name" label="课程名称" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="student.name" label="学生名称" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" :disabled="scope.row.status !== 0" @click="sendBill(scope.row)">
            发送
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="totalBills > 0"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalBills"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="pagination-container"
    />

    <!-- 账单对话框 -->
    <el-dialog v-model="billDialogVisible" title="账单信息">
      <el-form :model="billForm" label-width="80px">
        <el-form-item label="课程">
          <el-select
            v-model="billForm.course_id"
            placeholder="请选择课程"
            @focus="fetchCourseOptions"
          >
            <el-option
              v-for="course in courseOptions"
              :key="course.id"
              :label="course.name"
              :value="course.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生">
          <el-select v-model="billForm.student_id" placeholder="请选择学生">
            <el-option
              v-for="student in studentOptions"
              :key="student.id"
              :label="student.name"
              :value="student.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input-number v-model="billForm.amount" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="billDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBill">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/utils/api'

interface Course {
  id: number
  name: string
}

interface Student {
  id: number
  name: string
}

interface Bill {
  id: number
  course_id: number
  student_id: number
  teacher_id: number
  amount: string
  status: number
  sent_at: string | null
  created_at: string
  updated_at: string
  transaction_id: string
  course: Course
  student: Student
}

const bills = ref<Bill[]>([])
const currentPage = ref(1)
const pageSize = ref(10) // 默认每页显示10条
const totalBills = ref(0)
const loading = ref(false)

const billDialogVisible = ref(false)
const billForm = ref({
  id: 0,
  course_id: 0,
  student_id: 0,
  amount: 0,
})

const courseOptions = ref<Course[]>([])
const studentOptions = ref<Student[]>([])

// 监听课程选择变化
watch(
  () => billForm.value.course_id,
  async (newCourseId) => {
    if (newCourseId) {
      try {
        const response = await api.get(`/teacher/course/${newCourseId}`)
        studentOptions.value = response.students || []
      } catch (error) {
        console.error('获取课程学生列表失败:', error)
        studentOptions.value = []
      }
    }
  },
)

// 获取教师账单列表
const fetchTeacherInvoices = async () => {
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
    }
    const response = await api.get('/teacher/invoice', { params })
    if (response && typeof response === 'object') {
      bills.value = response.data || []
      totalBills.value = response.total || 0
    } else {
      bills.value = []
      totalBills.value = 0
    }
  } catch (error) {
    ElMessage.error('获取账单列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 获取课程列表
const fetchCourseOptions = async () => {
  try {
    const response = await api.get('/teacher/course/list')
    courseOptions.value = response || []
  } catch (error) {
    console.error('获取课程列表失败:', error)
    courseOptions.value = []
  }
}

const fetchCourses = async () => {
  try {
    const response = await api.get('/teacher/course', { params: { per_page: 100 } })
    courseOptions.value = response.data || []
  } catch (error) {
    console.error('获取课程列表失败:', error)
    courseOptions.value = []
  }
}

// 获取学生列表
const fetchStudents = async () => {
  try {
    const response = await api.get('/teacher/students')
    studentOptions.value = response || []
  } catch (error) {
    console.error('获取学生列表失败:', error)
    studentOptions.value = []
  }
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 页大小改变时，回到第一页
  fetchTeacherInvoices()
}

// 处理当前页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTeacherInvoices()
}

// 显示创建账单对话框
const showBillDialog = () => {
  billForm.value = {
    id: 0,
    course_id: 0,
    student_id: 0,
    amount: 0,
  }
  billDialogVisible.value = true
}

// 发送账单
const sendBill = async (bill: Bill) => {
  try {
    await api.post(`/teacher/invoice/${bill.id}/send`)
    ElMessage.success('账单发送成功')
    fetchTeacherInvoices() // 刷新账单列表
  } catch (error) {
    console.error('发送账单失败:', error)
  }
}

// 保存账单
const saveBill = async () => {
  try {
    await api.post('/teacher/invoice', {
      course_id: billForm.value.course_id,
      student_id: billForm.value.student_id,
      amount: billForm.value.amount,
    })
    ElMessage.success('账单创建成功')
    billDialogVisible.value = false
    fetchTeacherInvoices() // 刷新账单列表
  } catch (error) {
    console.error('保存账单失败:', error)
  }
}

// 获取状态类型
const getStatusType = (status: number): 'info' | 'warning' | 'success' | 'danger' => {
  switch (status) {
    case 0:
      return 'info' // 待处理
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

// 获取状态文本
const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return '待处理'
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

// 组件挂载时获取数据
onMounted(() => {
  fetchTeacherInvoices()
  fetchCourses()
  fetchStudents()
})

// 暴露方法给父组件调用
defineExpose({
  fetchTeacherInvoices,
})
</script>

<style scoped>
.teacher-invoices {
  width: 100%;
}

.action-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
