<template>
  <div class="login-container">
    <div class="login-box">
      <h2>教育管理系统登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" label-width="80px">
        <el-form-item label="身份" prop="user_type" class="user-type-selector">
          <el-radio-group v-model="loginForm.user_type">
            <el-radio-button label="student">学生</el-radio-button>
            <el-radio-button label="teacher">教师</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <!-- <el-form-item label="验证码" prop="captcha">
          <div class="captcha-container">
            <el-input v-model="loginForm.captcha" placeholder="请输入验证码" />
            <img :src="captchaUrl" @click="refreshCaptcha" class="captcha-img" />
          </div>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, ElRadioGroup, ElRadioButton } from 'element-plus' // Import FormInstance type and Radio components
import api from '@/utils/api' // 导入配置好的 Axios 实例
import apiEndpoints from '@/utils/apiEndpoints' // 导入 API 端点
import App from '@/App.vue'

const router = useRouter()
const loginFormRef = ref<FormInstance>() // Add type annotation for ref
// const captchaUrl = ref(apiEndpoints.login.captcha)

const loginForm = ref({
  username: '',
  password: '',
  user_type: 'student', // Add user_type, default to 'student'
  // captcha: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  user_type: [{ required: true, message: '请选择登录身份', trigger: 'change' }], // Add rule for user_type
  // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
}

// const refreshCaptcha = () => {
//   captchaUrl.value = `${apiEndpoints.login.captcha}?t=${Date.now()}`
// }

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    // Use optional chaining
    if (!valid) return

    try {
      // 使用配置好的 api 实例发送请求，包含 user_type
      const payload = {
        username: loginForm.value.username,
        password: loginForm.value.password,
        user_type: loginForm.value.user_type, // Include user_type in the payload
      }
      const data = await api.post(apiEndpoints.login.login, payload)
      ElMessage.success('登录成功')

      // 存储 Token 和用户类型到 localStorage
      if (data && data.access_token && data.user_type && data.username && data.name) {
        // Check if data and required fields exist
        localStorage.setItem('authToken', data.access_token)
        localStorage.setItem('userType', data.user_type) // 使用 user_type
        localStorage.setItem('userName', data.name) // 存储姓名
        localStorage.setItem('userUsername', data.username) // 存储用户名
        // 根据用户类型跳转不同页面
        if (data.user_type === 'teacher') {
          router.push('/teacher') // 跳转到教师视图
        } else if (data.user_type === 'student') {
          router.push('/student') // 跳转到学生视图
        } else {
          // 可选：处理未知的用户类型
          ElMessage.warning('未知的用户类型，将跳转到首页')
          router.push('/')
        }
      } else {
        // Handle cases where expected data is missing
        ElMessage.error('登录响应数据格式不正确')
        // refreshCaptcha()
      }
    } catch (error: any) {
      // 错误处理已由 Axios 拦截器处理，这里可以只刷新验证码
      console.error('Login failed:', error)
      // refreshCaptcha()
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e5799 0%, #207cca 51%, #2989d8 100%);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

.user-type-selector {
  margin-bottom: 20px; /* Add margin below the radio group */
  display: flex;
  justify-content: center; /* Center the radio buttons */
}

.user-type-selector .el-form-item__content {
  margin-left: 0 !important; /* Override default label width spacing */
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-box {
  width: 500px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.captcha-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

@media (min-width: 768px) {
  .login-container {
    flex-direction: row;
    justify-content: center;
  }

  .captcha-container {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  .captcha-img {
    margin-left: 20px;
  }
}

.captcha-img {
  margin-left: 10px;
  height: 36px;
  cursor: pointer;
}

@media (max-width: 767px) {
  .captcha-img {
    margin-left: 0;
    margin-top: 10px;
  }
}
</style>
