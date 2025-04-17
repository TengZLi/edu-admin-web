<template>
  <div class="teacher-courses">
    <div class="action-bar">
      <el-button type="primary" @click="showCourseDialog">创建课程</el-button>
    </div>
    <el-table :data="courses" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="课程名称" />
      <el-table-column prop="year_month" label="年月" />
      <el-table-column prop="fee" label="费用" />
      <el-table-column label="学生人数">
        <template #default="scope">
          {{ scope.row.students ? scope.row.students.length : 0 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="editCourse(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
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

    <!-- 课程对话框 -->
    <el-dialog v-model="courseDialogVisible" title="课程信息">
      <el-form :model="courseForm" label-width="80px">
        <el-form-item label="课程名称">
          <el-input v-model="courseForm.name" :disabled="isEditing" />
        </el-form-item>
        <el-form-item label="年月">
          <el-input
            v-model="courseForm.year_month"
            placeholder="请输入6位数字，如202504"
            :disabled="isEditing"
          />
        </el-form-item>
        <el-form-item label="费用">
          <el-input-number v-model="courseForm.fee" :min="0" :disabled="isEditing" />
        </el-form-item>
        <el-form-item label="学生">
          <el-select v-model="courseForm.student_ids" multiple placeholder="请选择学生">
            <el-option
              v-for="student in studentOptions"
              :key="student.id"
              :label="student.name"
              :value="student.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="courseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCourse">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '@/utils/api'

interface Student {
  id: number
  name: string
  username?: string
  pivot?: {
    course_id: number
    student_id: number
  }
}

interface Course {
  id: number
  name: string
  year_month: number | string
  fee: string | number
  teacher_id: number
  created_at: string
  updated_at: string
  students: Student[]
}

const courses = ref<Course[]>([])
const currentPage = ref(1)
const pageSize = ref(10) // 默认每页显示10条
const totalCourses = ref(0)

const courseDialogVisible = ref(false)
const isEditing = ref(false)
const courseForm = ref({
  id: 0,
  name: '',
  year_month: '',
  fee: 0,
  student_ids: [] as number[],
})

const studentOptions = ref<Student[]>([])

// 获取教师课程列表
const fetchTeacherCourses = async () => {
  try {
    const params = {
      page: currentPage.value,
      per_page: pageSize.value,
    }
    const response = await api.get('/teacher/course', { params })
    if (response && response.data) {
      courses.value = response.data
      totalCourses.value = response.total || 0
    } else {
      courses.value = []
      totalCourses.value = 0
    }
  } catch (error) {
    console.error('获取教师课程列表失败:', error)
    ElMessage.error('获取教师课程列表失败')
  }
}

// 获取学生列表
const fetchStudents = async () => {
  try {
    const response = await api.get('/teacher/students')
    if (response) {
      studentOptions.value = response
    } else {
      studentOptions.value = []
    }
  } catch (error) {
    console.error('获取学生列表失败:', error)
    ElMessage.error('获取学生列表失败')
    studentOptions.value = []
  }
}

// 处理每页显示数量变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1 // 页大小改变时，回到第一页
  fetchTeacherCourses()
}

// 处理当前页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchTeacherCourses()
}

// 显示创建课程对话框
const showCourseDialog = () => {
  isEditing.value = false
  courseForm.value = {
    id: 0,
    name: '',
    year_month: '',
    fee: 0,
    student_ids: [],
  }
  courseDialogVisible.value = true
}

// 编辑课程
const editCourse = async (course: Course) => {
  try {
    // 获取课程详情
    const response = await api.get(`/teacher/course/${course.id}`)
    isEditing.value = true
    courseForm.value = {
      id: response.id,
      name: response.name,
      year_month: response.year_month,
      fee: parseFloat(response.fee),
      student_ids: response.students.map((student: Student) => student.id),
    }
    courseDialogVisible.value = true
  } catch (error) {
    console.error('获取课程详情失败:', error)
  }
}

// 保存课程
const saveCourse = async () => {
  try {
    if (courseForm.value.id) {
      // 更新课程
      await api.put(`/teacher/course/${courseForm.value.id}`, {
        name: courseForm.value.name,
        year_month: courseForm.value.year_month,
        fee: courseForm.value.fee,
        student_ids: courseForm.value.student_ids,
      })
      ElMessage.success('课程更新成功')
    } else {
      // 新增课程
      await api.post('/teacher/course', {
        name: courseForm.value.name,
        year_month: courseForm.value.year_month,
        fee: courseForm.value.fee,
        student_ids: courseForm.value.student_ids,
      })
      ElMessage.success('课程创建成功')
    }
    courseDialogVisible.value = false
    fetchTeacherCourses() // 刷新课程列表
  } catch (error) {
    console.error('保存课程失败:', error)
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTeacherCourses()
  fetchStudents()
})

// 暴露方法给父组件调用
defineExpose({
  fetchTeacherCourses,
})
</script>

<style scoped>
.teacher-courses {
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
