import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router' // 假设你的路由实例导出为 router
import { ca } from 'element-plus/es/locales.mjs'

const Domain = 'http://local.poper.edu.com'
// const Domain = import.meta.env.API_URL || 'https://edu-admin-api-597da8eb180c.herokuapp.com'

const api = axios.create({
  baseURL: Domain + '/api', // 设置基础URL
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 尝试从 localStorage 获取 token
    const token = localStorage.getItem('authToken')
    if (token) {
      // 如果存在 token，则添加到请求头中
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const res = response.data
    // 检查是否存在 code 字段
    if (typeof res.code !== 'undefined') {
      switch (res.code) {
        case 0:
          // code: 0 代表成功，直接返回 data
          return res.data
        case 1:
          // code: 1 代表失败，弹窗提示 message
          ElMessage.error(res.message || '操作失败')
          return Promise.reject(new Error(res.message || '操作失败'))
        case 401:
          // code: 401 代表未登录，提示后返回到登录页面
          ElMessage.error(res.message || '认证失败或 Token 过期，请重新登录')
          try {
            localStorage.removeItem('authToken')
            localStorage.removeItem('userType') // 确保移除 userType
          } catch (e) {}

          router.push('/login') // 假设登录路由名称为 Login 或路径为 /login
          return Promise.reject(new Error(res.message || '认证失败或 Token 过期，请重新登录'))
        case 500:
          // code: 500 代表服务器错误，弹窗提示 message
          ElMessage.error(res.message || '服务器内部错误')
          return Promise.reject(new Error(res.message || '服务器内部错误'))
        default:
          // 处理未知的 code 值
          ElMessage.warning(`未知的业务状态码: ${res.code}`)
          return Promise.reject(new Error(`未知的业务状态码: ${res.code}`))
      }
    } else {
      // 如果响应没有 code 字段，可能是非标准响应或文件下载等
      // 这种情况下，直接返回整个响应体，由调用方处理
      // 或者根据项目约定进行处理
      console.warn('Received response without standard code field:', response)
      return response // 或者 return res，取决于是否需要 axios 的响应头等信息
    }
  },
  (error) => {
    console.error('Response error:', error)
    if (error.response) {
      const { status, data } = error.response
      let message = data?.message || '请求失败'

      switch (status) {
        case 401:
          message = data?.message || '认证失败或 Token 过期，请重新登录'
          localStorage.removeItem('authToken')
          localStorage.removeItem('userType') // 确保移除 userType
          // router.push({ name: 'Login' }) // 路由跳转已在 code: 401 处理，此处可注释或移除避免重复
          break
        case 403:
          message = '您没有权限执行此操作'
          break
        case 404:
          message = '请求的资源未找到'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          break
      }
      ElMessage.error(message)
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      ElMessage.error('网络错误，请检查您的连接')
    } else {
      // 在设置请求时触发了一个错误
      ElMessage.error('请求配置错误')
    }
    return Promise.reject(error)
  },
)

export default api
