import TeacherCourses from '@/components/TeacherCourses.vue' import TeacherInvoices from
'@/components/TeacherInvoices.vue'

<template>
  <div class="teacher-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="课程管理" name="course">
        <TeacherCourses ref="coursesRef" />
      </el-tab-pane>

      <el-tab-pane label="账单管理" name="bill">
        <TeacherInvoices ref="invoicesRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import TeacherCourses from '@/components/TeacherCourses.vue'
import TeacherInvoices from '@/components/TeacherInvoices.vue'

const coursesRef = ref()
const invoicesRef = ref()

const activeTab = ref('course')

const handleTabChange = (tab) => {
  // 使用nextTick确保DOM更新后再访问组件方法
  setTimeout(() => {
    // 根据当前激活的标签刷新对应的数据
    if (activeTab.value === 'course' && coursesRef.value) {
      // 调用课程组件的刷新方法
      if (typeof coursesRef.value.fetchTeacherCourses === 'function') {
        coursesRef.value.fetchTeacherCourses()
      }
    } else if (activeTab.value === 'bill' && invoicesRef.value) {
      // 调用账单组件的刷新方法
      if (typeof invoicesRef.value.fetchTeacherInvoices === 'function') {
        invoicesRef.value.fetchTeacherInvoices()
      }
    }
  }, 0)
}

const courseDialogVisible = ref(false)
const courseForm = ref({
  id: 0,
  name: '',
  date: '',
  fee: 0,
  students: [],
})

// 账单相关数据
const bills = ref([])

const billDialogVisible = ref(false)
const billForm = ref({
  id: 0,
  courseId: 0,
  amount: 0,
  remark: '',
})

const courseOptions = ref([])

// 课程操作方法
const showCourseDialog = () => {
  courseForm.value = {
    id: 0,
    name: '',
    date: '',
    fee: 0,
    students: [],
  }
  courseDialogVisible.value = true
}

const editCourse = (course: {
  id: number
  name: string
  date: string
  fee: number
  students: number[]
}) => {
  courseForm.value = { ...course }
  courseDialogVisible.value = true
}

const deleteCourse = (course: { id: number }) => {
  courses.value = courses.value.filter((c) => c.id !== course.id)
  ElMessage.success('删除成功')
}

const saveCourse = () => {
  if (courseForm.value.id) {
    // 更新课程
    const index = courses.value.findIndex((c) => c.id === courseForm.value.id)
    if (index !== -1) {
      courses.value[index] = { ...courseForm.value }
    }
  } else {
    // 新增课程
    courseForm.value.id = courses.value.length + 1
    courses.value.push({ ...courseForm.value })
  }
  courseDialogVisible.value = false
  ElMessage.success('保存成功')
}

// 账单操作方法
const showBillDialog = () => {
  billForm.value = {
    id: 0,
    courseId: 0,
    amount: 0,
    remark: '',
  }
  billDialogVisible.value = true
}

const sendBill = (bill: { id: number; status: string }) => {
  const index = bills.value.findIndex((b) => b.id === bill.id)
  if (index !== -1) {
    bills.value[index].status = '已发送'
    ElMessage.success('账单发送成功')
  }
}

const saveBill = () => {
  const course = courseOptions.value.find((c) => c.id === billForm.value.courseId)

  if (billForm.value.id) {
    // 更新账单
    const index = bills.value.findIndex((b) => b.id === billForm.value.id)
    if (index !== -1) {
      bills.value[index] = {
        ...billForm.value,
        courseName: course?.name || '',
        status: '未发送',
      }
    }
  } else {
    // 新增账单
    billForm.value.id = bills.value.length + 1
    bills.value.push({
      ...billForm.value,
      courseName: course?.name || '',
      status: '未发送',
    })
  }
  billDialogVisible.value = false
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.teacher-container {
  padding: 20px;
}

.action-bar {
  margin-bottom: 20px;
}
</style>
