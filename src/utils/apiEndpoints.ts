/**
 * Centralized API endpoints for the application.
 */
const apiEndpoints = {
  login: {
    captcha: '/login/captcha',
    login: '/auth/login',
  },
  user: {
    // Generic or fallback endpoints (if needed)
    profile: '/user/profile', // Consider removing if always role-specific
    list: '/user/list',
    update: '/user/update', // Consider removing if always role-specific
  },
  teacher: {
    profile: '/teacher/user',
    updateProfile: '/teacher/profile',
    logout: '/teacher/auth/logout',
  },
  student: {
    profile: '/student/user',
    updateProfile: '/student/profile',
    logout: '/student/auth/logout',
  },
  // Add other modules like courses, invoices, etc.
  courses: {
    list: '/course/list',
    create: '/course/create',
    student: '/student/course', // Added for student courses
    // update: (id: number) => `/courses/${id}`,
    // delete: (id: number) => `/courses/${id}`,
  },
  invoices: {
    list: '/invoice/list',
    create: '/invoice/create',
    send: (id: number) => `/invoice/send/${id}`,
    student: '/student/invoice', // Added for student invoices
    pay: (id: number) => `/invoice/pay/${id}`, // Added for student payment
  },
}

export default apiEndpoints
