<template>
  <div class="invoice-manager">
    <h2>账单管理</h2>
    <!-- 创建账单表单 -->
    <el-form :model="invoiceForm" ref="invoiceFormRef" label-width="100px">
      <el-form-item label="账单名称" prop="name">
        <el-input v-model="invoiceForm.name" placeholder="请输入账单名称" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input-number v-model="invoiceForm.amount" :min="0" placeholder="请输入金额" />
      </el-form-item>
      <el-form-item label="关联课程" prop="course_id">
        <el-select v-model="invoiceForm.course_id" placeholder="请选择关联课程">
          <el-option
            v-for="course in courses"
            :key="course.id"
            :label="`${course.name} (${course.year_month})`"
            :value="course.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onCreateInvoice">创建账单</el-button>
      </el-form-item>
    </el-form>

    <!-- 账单列表 -->
    <div class="invoice-list">
      <h3>账单列表</h3>
      <el-table :data="invoices" style="width: 100%">
        <el-table-column prop="name" label="账单名称" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="course.name" label="关联课程" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'pending' ? 'warning' : 'success'">
              {{ scope.row.status === 'pending' ? '待发送' : '已发送' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.status === 'pending'"
              size="small"
              type="primary"
              @click="onSendInvoice(scope.row)"
            >
              发送
            </el-button>
            <el-button v-else size="small" disabled>已发送</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
  ElTag,
  type FormInstance,
} from 'element-plus'
import api from '@/utils/api'
import apiEndpoints from '@/utils/apiEndpoints' // 导入 API 端点

interface Course {
  id: number
  name: string
  year_month: string
  // 可能还有其他字段
}

interface Invoice {
  id: number
  name: string
  amount: number
  course_id: number
  status: 'pending' | 'sent' | 'paid' // 根据接口文档调整状态
  course?: Course // 关联的课程信息，可能由后端在列表接口中提供
}

const invoiceFormRef = ref<FormInstance>()
const invoiceForm = ref({
  name: '',
  amount: 0,
  course_id: null as number | null,
})

const courses = ref<Course[]>([])
const invoices = ref<Invoice[]>([])

// 获取课程列表 (用于下拉选择)
const fetchCourses = async () => {
  try {
    const data = await api.get(apiEndpoints.courses.list) // 使用集中的端点
    courses.value = data || []
  } catch (error) {
    console.error('获取课程列表失败:', error)
  }
}

// 获取账单列表
const fetchInvoices = async () => {
  try {
    // 假设接口返回 { code: 200, data: [{ id: 1, name: '账单A', ..., course: { id: 1, name: '课程A' } }, ...], message: '...' }
    const data = await api.get(apiEndpoints.invoices.list) // 使用集中的端点
    invoices.value = data || []
  } catch (error) {
    console.error('获取账单列表失败:', error)
  }
}

// 创建账单
const onCreateInvoice = () => {
  invoiceFormRef.value?.validate(async (valid) => {
    if (!valid || !invoiceForm.value.course_id) {
      ElMessage.warning('请检查表单信息是否完整且正确')
      return
    }
    try {
      await api.post(apiEndpoints.invoices.create, invoiceForm.value) // 使用集中的端点
      ElMessage.success('账单创建成功')
      invoiceFormRef.value?.resetFields()
      invoiceForm.value.course_id = null // 手动清空 Select
      await fetchInvoices() // 刷新列表
    } catch (error) {
      console.error('创建账单失败:', error)
    }
  })
}

// 发送账单
const onSendInvoice = async (invoice: Invoice) => {
  try {
    // 假设发送接口需要账单 ID
    await api.post(apiEndpoints.invoices.send(invoice.id)) // 使用集中的端点
    ElMessage.success('账单发送成功')
    // 更新该账单状态或重新获取列表
    // 方式一：直接修改前端状态
    const index = invoices.value.findIndex((inv) => inv.id === invoice.id)
    if (index !== -1) {
      invoices.value[index].status = 'sent'
    }
    // 方式二：重新获取列表（如果发送后后端状态会更新）
    // await fetchInvoices();
  } catch (error) {
    console.error('发送账单失败:', error)
  }
}

// 组件挂载时获取初始数据
onMounted(() => {
  fetchCourses()
  fetchInvoices()
})
</script>

<style scoped>
.invoice-manager {
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

h3 {
  margin-bottom: 16px;
  color: #303133;
}

.el-select {
  width: 100%;
}
</style>
