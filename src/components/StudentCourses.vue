<template>
  <div class="student-courses">
    <h2>我的课程</h2>
    <div class="course-list">
      <el-table :data="courses" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="teacher.name" label="教师名称" />
        <el-table-column prop="year_month" label="年月" />
        <el-table-column prop="fee" label="费用" />
      </el-table>

      <el-pagination
        v-if="totalCourses > 0"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCourses"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="pagination-container"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElTable, ElTableColumn, ElPagination, ElMessage } from 'element-plus' // 导入 ElPagination 和 ElMessage
import api from '@/utils/api'
import apiEndpoints from '@/utils/apiEndpoints' // 导入 API 端点

interface Course {
  id: number
  name: string
  year_month: string | number
  fee: string | number
  teacher_id: number
  teacher: {
    id: number
    name: string
  }
  pivot?: {
    student_id: number
    course_id: number
  }
}

const courses = ref<Course[]>([])
const currentPage = ref(1)
const pageSize = ref(10) // 默认每页显示10条
const totalCourses = ref(0)

// 获取学生自己的课程列表（带分页）

const fetchStudentCourses = async () => {
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
    }
    const response = await api.get(apiEndpoints.courses.student, { params })
    // console.log('获取我的课程列表成功:', response)
    if (response && typeof response === 'object') {
      courses.value = response.data || [] // 课程列表
      totalCourses.value = response.total || 0 // 总数
    } else {
      courses.value = []
      totalCourses.value = 0
    }
  } catch (error) {
    console.error('获取我的课程列表失败:', error)
    // ElMessage 已在拦截器中处理，但可以根据需要添加特定于此组件的错误提示
    // ElMessage.error('加载课程数据失败，请稍后再试')
  }
}
// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 页大小改变时，回到第一页
  fetchStudentCourses()
}

// 处理当前页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchStudentCourses()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchStudentCourses()
})
defineExpose({
  fetchStudentCourses,
})
</script>
<style scoped>
.student-courses {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.course-list {
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
