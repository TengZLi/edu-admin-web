<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <div class="header" v-if="!isLoginPage">
      <div class="logo">教育管理系统</div>
      <div class="user-info">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userName || '用户' }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">修改个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue' // 引入 onMounted
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import api from '@/utils/api'
import apiEndpoints from '@/utils/apiEndpoints'

const router = useRouter()
const route = useRoute()
const userName = ref('')

// 检查用户是否已登录
const isLoggedIn = computed(() => {
  return localStorage.getItem('authToken') !== null
})

// 检查当前是否为登录页
const isLoginPage = computed(() => {
  return route.name === 'Login'
})

// Function to fetch and update user info from API
const fetchAndUpdateUserInfo = async () => {
  const userType = localStorage.getItem('userType')
  let profileEndpoint = ''

  if (userType === 'teacher') {
    profileEndpoint = apiEndpoints.teacher.profile
  } else if (userType === 'student') {
    profileEndpoint = apiEndpoints.student.profile
  } else {
    console.warn('User type not found in localStorage, cannot fetch profile.')
    // Attempt to use existing localStorage value if fetch isn't possible
    const storedName = localStorage.getItem('userName')
    if (storedName && !userName.value) {
      // Only set if userName is currently empty
      userName.value = storedName
    }
    return
  }

  try {
    const response = await api.get(profileEndpoint)
    if (response.data && response.data.name && response.data.username) {
      const fetchedName = response.data.name
      const fetchedUsername = response.data.username
      // Update ref only if different from localStorage to avoid unnecessary reactivity triggers
      if (userName.value !== fetchedName) {
        userName.value = fetchedName
      }
      // Always update localStorage with the latest info
      localStorage.setItem('userName', fetchedName)
      localStorage.setItem('userUsername', fetchedUsername)
    } else {
      console.warn('Fetched user info is incomplete or missing name/username.')
      // Fallback to localStorage if fetch is incomplete and userName isn't already set
      const storedName = localStorage.getItem('userName')
      if (storedName && !userName.value) {
        userName.value = storedName
      }
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
    // Fallback to localStorage on fetch error if userName isn't already set
    const storedName = localStorage.getItem('userName')
    if (storedName && !userName.value) {
      userName.value = storedName
      console.log(`Username set from localStorage due to fetch error: ${storedName}`)
    } else if (!storedName) {
      console.warn('Failed to fetch user info and no userName found in localStorage.')
    }
  }
}

// Initialize userName from localStorage on component mount if logged in
onMounted(() => {
  console.log('App.vue mounted.')
  if (isLoggedIn.value) {
    const storedName = localStorage.getItem('userName')
    if (storedName) {
      userName.value = storedName
      console.log(`Username initialized from localStorage on mount: ${storedName}`)
      // Fetch latest info in background
      fetchAndUpdateUserInfo()
    } else {
      console.log('Logged in on mount, but no userName in localStorage. Fetching...')
      fetchAndUpdateUserInfo() // Fetch if logged in but no name stored
    }
  } else {
    console.log('Not logged in on mount.')
  }
})

// Watch for route changes to update username after login or navigation
watch(
  () => route.name, // Watch the route name
  (newRouteName, oldRouteName) => {
    console.log(`Route changed from ${String(oldRouteName)} to ${String(newRouteName)}`)
    const token = localStorage.getItem('authToken')
    const storedName = localStorage.getItem('userName')

    if (newRouteName !== 'Login' && token) {
      // If not on login page and logged in
      if (storedName) {
        userName.value = storedName
        console.log(`Username updated from localStorage on route change: ${storedName}`)
      } else {
        // If name isn't in localStorage for some reason, try fetching it
        console.log('Username not found in localStorage after route change, fetching...')
        fetchAndUpdateUserInfo()
      }
      // Optionally fetch user info every time user navigates away from login
      // fetchAndUpdateUserInfo(); // Uncomment if fresh data is needed on every navigation
    } else if (newRouteName === 'Login') {
      // Clear username if navigating to login page (e.g., after logout)
      userName.value = ''
      console.log('Navigated to Login page, cleared username.')
    }
  },
  { immediate: false }, // Run on mount is handled by onMounted
)

// Handle dropdown commands (logout, profile)
const handleCommand = async (command: string) => {
  if (command === 'profile') {
    router.push({ name: 'Profile' })
  } else if (command === 'logout') {
    const userType = localStorage.getItem('userType')
    let logoutEndpoint = ''

    if (userType === 'teacher') {
      logoutEndpoint = apiEndpoints.teacher.logout
    } else if (userType === 'student') {
      logoutEndpoint = apiEndpoints.student.logout
    } else {
      console.error('Cannot determine user type for logout.')
      // Force clear local storage and redirect
      localStorage.removeItem('authToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('userName')
      localStorage.removeItem('userUsername')
      userName.value = '' // Clear the reactive variable
      router.push({ name: 'Login' })
      ElMessage.warning('无法确定用户类型，已强制退出并清除本地登录状态')
      return
    }

    try {
      await api.post(logoutEndpoint)
      // Clear local storage after successful API call
      localStorage.removeItem('authToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('userName')
      localStorage.removeItem('userUsername')
      userName.value = '' // Clear the reactive variable
      router.push({ name: 'Login' })
      ElMessage.success('已成功退出登录')
    } catch (error) {
      console.error('退出登录失败:', error)
      // Attempt to clear local storage even if API call fails
      localStorage.removeItem('authToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('userName')
      localStorage.removeItem('userUsername')
      userName.value = '' // Clear the reactive variable
      router.push({ name: 'Login' })
      ElMessage.error('退出登录时发生错误，已尝试清除本地状态')
    }
  }
}
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.user-info {
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  padding: 5px 10px; /* 增加内边距 */
  background-color: #ecf5ff; /* 添加淡蓝色背景 */
  border-radius: 4px; /* 添加圆角 */
  color: #409eff; /* 更改颜色使其更显眼 */
  cursor: pointer; /* 明确鼠标指针为手型 */
}

.el-dropdown-link:hover {
  background-color: #d9ecff; /* 悬停时背景色加深 */
  color: #66b1ff; /* 悬停时颜色变浅 */
  text-decoration: none; /* 移除下划线，因为背景色已足够区分 */
}
</style>
