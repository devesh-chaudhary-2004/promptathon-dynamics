import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; university?: string; major?: string }) =>
    api.post('/auth/signup', data),
  
  login: (data: { email: string; password: string; rememberMe?: boolean }) =>
    api.post('/auth/login', data),
  
  getMe: () => api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.post(`/auth/reset-password/${token}`, { password }),
  
  verifyEmail: (token: string) =>
    api.get(`/auth/verify/${token}`),
  
  resendVerification: () =>
    api.post('/auth/resend-verification'),
  
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }),
  
  googleAuth: (credential: string, profile: any) =>
    api.post('/auth/google', { credential, profile }),
};

// Users API
export const usersAPI = {
  getAll: (params?: { search?: string; university?: string; skills?: string; page?: number; limit?: number; sortBy?: string }) =>
    api.get('/users', { params }),
  
  getById: (id: string) =>
    api.get(`/users/${id}`),
  
  updateProfile: (data: any) =>
    api.put('/users/profile', data),
  
  updateAvatar: (avatar: string) =>
    api.put('/users/avatar', { avatar }),
  
  getSkills: (userId: string) =>
    api.get(`/users/${userId}/skills`),
  
  getReviews: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/users/${userId}/reviews`, { params }),
  
  deleteAccount: () =>
    api.delete('/users/account'),
};

// Skills API
export const skillsAPI = {
  getAll: (params?: { 
    search?: string; 
    category?: string; 
    expertise?: string; 
    pricingType?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string; 
    page?: number; 
    limit?: number 
  }) => api.get('/skills', { params }),
  
  getFeatured: () =>
    api.get('/skills/featured'),
  
  getCategories: () =>
    api.get('/skills/categories'),
  
  getById: (id: string) =>
    api.get(`/skills/${id}`),
  
  create: (data: any) =>
    api.post('/skills', data),
  
  update: (id: string, data: any) =>
    api.put(`/skills/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/skills/${id}`),
  
  save: (id: string) =>
    api.post(`/skills/${id}/save`),
  
  getByUser: (userId: string) =>
    api.get(`/skills/user/${userId}`),
};

// Courses API
export const coursesAPI = {
  getAll: (params?: { 
    search?: string; 
    category?: string; 
    level?: string; 
    isFree?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string; 
    page?: number; 
    limit?: number 
  }) => api.get('/courses', { params }),
  
  getFeatured: () =>
    api.get('/courses/featured'),
  
  getMyCourses: () =>
    api.get('/courses/my-courses'),
  
  getTeaching: () =>
    api.get('/courses/teaching'),
  
  getById: (id: string) =>
    api.get(`/courses/${id}`),
  
  create: (data: any) =>
    api.post('/courses', data),
  
  update: (id: string, data: any) =>
    api.put(`/courses/${id}`, data),
  
  enroll: (id: string) =>
    api.post(`/courses/${id}/enroll`),
  
  updateProgress: (id: string, data: { lessonId: string; moduleId: string; completed: boolean }) =>
    api.post(`/courses/${id}/progress`, data),
  
  delete: (id: string) =>
    api.delete(`/courses/${id}`),
};

// Swaps API
export const swapsAPI = {
  getAll: (params?: { status?: string; type?: string; page?: number; limit?: number }) =>
    api.get('/swaps', { params }),
  
  getById: (id: string) =>
    api.get(`/swaps/${id}`),
  
  create: (data: { 
    skillId: string; 
    type: 'exchange' | 'paid';
    offeredSkill?: string; 
    offeredSkillDescription?: string;
    amount?: number;
    message: string;
    proposedSchedule?: { date: string; time: string; duration: number };
  }) => api.post('/swaps', data),
  
  accept: (id: string) =>
    api.put(`/swaps/${id}/accept`),
  
  reject: (id: string, reason?: string) =>
    api.put(`/swaps/${id}/reject`, { reason }),
  
  start: (id: string) =>
    api.put(`/swaps/${id}/start`),
  
  complete: (id: string, notes?: string) =>
    api.put(`/swaps/${id}/complete`, { notes }),
  
  cancel: (id: string, reason?: string) =>
    api.put(`/swaps/${id}/cancel`, { reason }),
  
  submitReview: (id: string, data: { rating: number; content: string; detailedRatings?: any }) =>
    api.post(`/swaps/${id}/review`, data),
};

// Messages API
export const messagesAPI = {
  getConversations: (params?: { page?: number; limit?: number }) =>
    api.get('/messages/conversations', { params }),
  
  getConversation: (id: string, params?: { page?: number; limit?: number }) =>
    api.get(`/messages/conversations/${id}`, { params }),
  
  createConversation: (userId: string, swapRequestId?: string) =>
    api.post('/messages/conversations', { userId, swapRequestId }),
  
  sendMessage: (data: { conversationId: string; content: string; type?: string; attachment?: any }) =>
    api.post('/messages', data),
  
  editMessage: (id: string, content: string) =>
    api.put(`/messages/${id}`, { content }),
  
  deleteMessage: (id: string) =>
    api.delete(`/messages/${id}`),
  
  getUnreadCount: () =>
    api.get('/messages/unread-count'),
  
  markAsRead: (conversationId: string) =>
    api.post(`/messages/mark-read/${conversationId}`),
};

// Dashboard API
export const dashboardAPI = {
  get: () =>
    api.get('/dashboard'),
  
  getStats: (period?: string) =>
    api.get('/dashboard/stats', { params: { period } }),
  
  getActivity: (params?: { page?: number; limit?: number }) =>
    api.get('/dashboard/activity', { params }),
  
  getNotifications: (params?: { page?: number; limit?: number; unreadOnly?: string }) =>
    api.get('/dashboard/notifications', { params }),
  
  markNotificationsRead: (notificationIds?: string[]) =>
    api.put('/dashboard/notifications/read', { notificationIds }),
  
  deleteNotification: (id: string) =>
    api.delete(`/dashboard/notifications/${id}`),
};

export default api;
