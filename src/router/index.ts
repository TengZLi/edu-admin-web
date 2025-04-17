import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import TeacherView from '../views/TeacherView.vue'
import StudentView from '../views/StudentView.vue'
import UserProfile from '../components/UserProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login', // Changed path to /login for clarity
      name: 'Login', // Changed name to Login
      component: LoginView,
      meta: { requiresAuth: false }, // Login page doesn't require auth
    },
    {
      path: '/teacher',
      name: 'Teacher',
      component: TeacherView,
      // requiresAuth should be true, userType specifies allowed type
      meta: { requiresAuth: true, userType: 'teacher' },
    },
    {
      path: '/student',
      name: 'Student',
      component: StudentView,
      // requiresAuth should be true, userType specifies allowed type
      meta: { requiresAuth: true, userType: 'student' },
    },
    // Add a default redirect for the root path, perhaps to login
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/profile',
      name: 'Profile',
      component: UserProfile,
      meta: { requiresAuth: true }, // 需要登录但不限制用户类型
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiredUserType = to.meta.userType as string | undefined
  const token = localStorage.getItem('authToken')
  const userType = localStorage.getItem('userType')

  // If trying to access login page while already logged in
  if (to.name === 'Login' && token) {
    // Redirect to appropriate dashboard based on userType
    if (userType === 'teacher') {
      next({ name: 'Teacher' })
    } else if (userType === 'student') {
      next({ name: 'Student' })
    } else {
      // Fallback if userType is somehow invalid, maybe clear storage and go to login
      localStorage.removeItem('authToken')
      localStorage.removeItem('userType')
      next({ name: 'Login' })
    }
    return // Important to return after calling next()
  }

  // Check if the route requires authentication
  if (requiresAuth) {
    // Check if user is logged in (has token)
    if (!token) {
      // Not logged in, redirect to login page
      next({ name: 'Login' })
    } else {
      // Logged in, check if the user type matches the required type for the route
      if (requiredUserType && userType !== requiredUserType) {
        // User type does not match, redirect based on actual user type
        if (userType === 'teacher') {
          next({ name: 'Teacher' }) // Redirect teacher to teacher page
        } else if (userType === 'student') {
          next({ name: 'Student' }) // Redirect student to student page
        } else {
          // Invalid user type stored, redirect to login
          localStorage.removeItem('authToken')
          localStorage.removeItem('userType')
          next({ name: 'Login' })
        }
      } else {
        // User is logged in and has the correct type (or route doesn't require a specific type)
        next()
      }
    }
  } else {
    // Route does not require authentication, allow access
    next()
  }
})

export default router
