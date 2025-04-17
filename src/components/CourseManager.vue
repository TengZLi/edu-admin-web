<template>
  <div class="course-manager">
    <h2>课程管理</h2>
    <!-- 课程创建表单 -->
    <el-form :model="courseForm" ref="courseFormRef" label-width="80px">
      <el-form-item label="课程名" prop="name">
        <el-input v-model="courseForm.name" placeholder="请输入课程名" />
      </el-form-item>
      <el-form-item label="年月" prop="year_month">
        <el-date-picker
          v-model="courseForm.year_month"
          type="month"
          placeholder="选择年月"
          format="YYYY-MM"
          value-format="YYYY-MM"
        />
      </el-form-item>
      <el-form-item label="费用" prop="fee">
        <el-input-number v-model="courseForm.fee" :min="0" placeholder="请输入费用" />
      </el-form-item>
      <el-form-item label="学生" prop="student_ids">
        <el-select v-model="courseForm.student_ids" multiple placeholder="请选择学生">
          <el-option
            v-for="student in students"
            :key="student.id"
            :label="student.name"
            :value="student.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onCreateCourse">创建课程</el-button>
      </el-form-item>
    </el-form>

    <!-- 课程列表 -->
    <div class="course-list">
      <h3>课程列表</h3>
      <el-table :data="courses" style="width: 100%">
        <el-table-column prop="name" label="课程名" />
        <el-table-column prop="year_month" label="年月" />
        <el-table-column prop="fee" label="费用" />
        <!-- 可以添加更多列，例如关联的学生 -->
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
  ElDatePicker,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElButton,
  ElTable,
  ElTableColumn,
  type FormInstance,
} from 'element-plus'
import api from '@/utils/api'
import apiEndpoints from '@/utils/apiEndpoints' // 导入 API 端点

interface Student {
  id: number
  name: string
  // 可能还有其他字段
}

interface Course {
  id: number
  name: string
  year_month: string
  fee: number
  // 可能还有其他字段，例如关联的学生列表
}

const courseFormRef = ref<FormInstance>()
const courseForm = ref({
  name: '',
  year_month: '',
  fee: 0,
  student_ids: [] as number[],
})

const students = ref<Student[]>([])
const courses = ref<Course[]>([])

// 获取学生列表
const fetchStudents = async () => {
  try {
    // 假设接口返回 { code: 200, data: [{ id: 1, name: '学生A' }, ...], message: '...' }
    const data = await api.get(apiEndpoints.user.list, { params: { user_type: 'student' } }) // 使用集中的端点
    students.value = data || [] // 直接使用拦截器处理后的 data
  } catch (error) {
    console.error('获取学生列表失败:', error)
    // ElMessage 已在拦截器中处理
  }
}

// 获取课程列表
const fetchCourses = async () => {
  try {
    // 假设接口返回 { code: 200, data: [{ id: 1, name: '课程A', ... }, ...], message: '...' }
    const data = await api.get(apiEndpoints.courses.list) // 使用集中的端点
    courses.value = data || [] // 直接使用拦截器处理后的 data
  } catch (error) {
    console.error('获取课程列表失败:', error)
    // ElMessage 已在拦截器中处理
  }
}

// 创建课程
const onCreateCourse = () => {
  courseFormRef.value?.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('请检查表单信息是否完整且正确')
      return
    }
    try {
      await api.post(apiEndpoints.courses.create, courseForm.value) // 使用集中的端点
      ElMessage.success('课程创建成功')
      // 清空表单
      courseFormRef.value?.resetFields()
      courseForm.value.student_ids = [] // 手动清空 Select
      // 刷新课程列表
      await fetchCourses()
    } catch (error) {
      console.error('创建课程失败:', error)
      // ElMessage 已在拦截器中处理
    }
  })
}

// 组件挂载时获取初始数据
onMounted(() => {
  fetchStudents()
  fetchCourses()
})
</script>

<style scoped>
.course-manager {
  max-width: 800px; /* 适当加宽以容纳表格 */
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.course-list {
  margin-top: 24px;
}

h3 {
  margin-bottom: 16px;
  color: #303133;
}

/* 可以添加更多 Element Plus 组件的样式调整 */
.el-select {
  width: 100%; /* 让下拉选择框宽度适应 */
}
</style>
