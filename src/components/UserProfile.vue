<template>
  <div class="user-profile">
    <el-button
      type="primary"
      plain
      @click="goBack"
      style="position: absolute; left: 20px; top: 20px"
      >返回</el-button
    >
    <h2>个人信息</h2>
    <el-form :model="profileForm" :rules="rules" ref="profileFormRef" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="profileForm.username" placeholder="用户名为2到20位数字/英文或下划线" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="profileForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="当前密码" prop="currentPassword">
        <el-input
          v-model="profileForm.currentPassword"
          type="password"
          placeholder="请输入当前密码"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="profileForm.password" type="password" placeholder="留空则不修改密码" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword" v-if="profileForm.password">
        <el-input
          v-model="profileForm.confirmPassword"
          type="password"
          placeholder="密码为6-20位数字/英文或下划线，且至少包含一个字母和一个数字"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateProfile">更新信息</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElForm, ElFormItem, ElInput, ElButton, type FormInstance } from 'element-plus'
import api from '@/utils/api'
import apiEndpoints from '@/utils/apiEndpoints' // 导入 API 端点

interface UserProfile {
  id?: number
  username: string
  name: string
  currentPassword?: string
  password?: string
  confirmPassword?: string
}

const router = useRouter()
const profileFormRef = ref<FormInstance>()

const goBack = () => {
  router.go(-1)
}
const profileForm = ref<UserProfile>({
  username: '',
  name: '',
  currentPassword: '',
  password: '',
  confirmPassword: '',
})

const validateUsername = (rule: any, value: string, callback: any) => {
  const USERNAME_REGEX = /^[a-zA-Z0-9_]{2,20}$/

  //正则验证
  if (!USERNAME_REGEX.test(value)) {
    callback(new Error('用户名必须为2到20位数字/英文或下划线'))
  } else {
    callback()
  }
}

const validatePassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback()
    return
  }
  const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9_]{6,20}$/
  if (!PASSWORD_REGEX.test(value)) {
    callback(new Error('密码为6-20位数字/英文或下划线，且至少包含一个字母和一个数字'))
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (profileForm.value.password && value === '') {
    callback(new Error('请再次输入新密码'))
  } else if (value !== profileForm.value.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [{ required: true, validator: validateUsername, trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  password: [{ validator: validatePassword, trigger: 'blur' }],
  confirmPassword: [{ validator: validatePass, trigger: 'blur' }],
}

const fetchUserProfile = async () => {
  const userType = localStorage.getItem('userType')
  let profileEndpoint = ''

  if (userType === 'teacher') {
    profileEndpoint = apiEndpoints.teacher.profile
  } else if (userType === 'student') {
    profileEndpoint = apiEndpoints.student.profile
  } else {
    console.error('Invalid or missing userType in localStorage for fetching profile')
    ElMessage.error('无法获取用户信息，用户类型未知')
    return
  }

  try {
    const data = await api.get(profileEndpoint)
    if (data) {
      profileForm.value.username = data.username
      profileForm.value.name = data.name
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

const updateProfile = async () => {
  try {
    // const valid = await profileFormRef.value?.validate()
    // if (!valid) {
    //   ElMessage.warning('请检查表单信息是否正确')
    //   return
    // }

    const updateData: Partial<UserProfile> = {
      username: profileForm.value.username,
      name: profileForm.value.name,
    }
    if (profileForm.value.password) {
      updateData.current_password = profileForm.value.currentPassword
      updateData.password = profileForm.value.password
    }

    const userType = localStorage.getItem('userType')
    let updateEndpoint = ''

    if (userType === 'teacher') {
      updateEndpoint = apiEndpoints.teacher.updateProfile
    } else if (userType === 'student') {
      updateEndpoint = apiEndpoints.student.updateProfile
    } else {
      console.error('Invalid or missing userType in localStorage for updating profile')
      ElMessage.error('无法更新用户信息，用户类型未知')
      return
    }

    await api.put(updateEndpoint, updateData)
    ElMessage.success('个人信息更新成功')

    profileForm.value.confirmPassword = ''
    profileForm.value.password = ''
    profileForm.value.confirmPassword = ''
    await fetchUserProfile()
  } catch (error) {
    console.error('更新个人信息失败:', error)
    ElMessage.error('更新个人信息失败', error)
  }
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 20px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  position: relative;
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #303133;
}
</style>
