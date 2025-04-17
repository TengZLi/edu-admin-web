<template>
  <div class="student-container">
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="我的课程" name="course">
        <StudentCourses ref="coursesRef" />
      </el-tab-pane>

      <el-tab-pane label="我的账单" name="bill">
        <StudentInvoices ref="invoicesRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import StudentCourses from '@/components/StudentCourses.vue'
import StudentInvoices from '@/components/StudentInvoices.vue'

const activeTab = ref('course')
const coursesRef = ref()
const invoicesRef = ref()

// 处理标签切换
const handleTabChange = () => {
  // 使用nextTick确保DOM更新后再访问组件方法
  setTimeout(() => {
    // 根据当前激活的标签刷新对应的数据
    if (activeTab.value === 'course' && coursesRef.value) {
      // 调用课程组件的刷新方法
      if (typeof coursesRef.value.fetchStudentCourses === 'function') {
        coursesRef.value.fetchStudentCourses()
      }
    } else if (activeTab.value === 'bill' && invoicesRef.value) {
      // 调用账单组件的刷新方法
      if (typeof invoicesRef.value.fetchStudentInvoices === 'function') {
        invoicesRef.value.fetchStudentInvoices()
      }
    }
  }, 0)
}

// 组件挂载时初始化数据
onMounted(() => {
  // 初始加载当前激活标签的数据
  handleTabChange()
})
</script>

<style scoped>
.student-container {
  padding: 20px;
}
</style>
