import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if we're in the browser
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    // Create form data for OAuth2 compatibility
    const formData = new URLSearchParams();
    formData.append('username', email); // OAuth2 uses 'username' field
    formData.append('password', password);
    
    return api.post('/auth/login', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  register: (userData: any) => 
    api.post('/auth/register', userData),
  
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) => 
    api.post('/auth/reset-password', { token, password }),
  
  verifyEmail: (token: string) => 
    api.post('/auth/verify-email', { token }),
};

// Users API
export const usersAPI = {
  getCurrentUser: () => 
    api.get('/users/me'),
  
  updateProfile: (userData: any) => 
    api.put('/users/me', userData),
  
  getUserByUsername: (username: string) => 
    api.get(`/users/${username}`),
};

// Posts API
export const postsAPI = {
  getPosts: (params?: any) => 
    api.get('/posts', { params }),
  
  getPostBySlug: (slug: string) => 
    api.get(`/posts/${slug}`),
  
  getPostById: (postId: string) => 
    api.get(`/posts/id/${postId}`),
  
  createPost: (postData: any) => 
    api.post('/posts', postData),
  
  updatePost: (postId: string, postData: any) => 
    api.put(`/posts/${postId}`, postData),
  
  deletePost: (postId: string) => 
    api.delete(`/posts/${postId}`),
  
  likePost: (postId: string) => 
    api.post(`/posts/${postId}/like`),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params?: any) => 
    api.get('/categories', { params }),
  
  getNestedCategories: () => 
    api.get('/categories/nested'),
  
  getCategoryById: (categoryId: string) => 
    api.get(`/categories/${categoryId}`),
  
  getCategoryBySlug: (slug: string) => 
    api.get(`/categories/slug/${slug}`),
  
  createCategory: (categoryData: any) => 
    api.post('/categories', categoryData),
  
  updateCategory: (categoryId: string, categoryData: any) => 
    api.put(`/categories/${categoryId}`, categoryData),
  
  deleteCategory: (categoryId: string) => 
    api.delete(`/categories/${categoryId}`),
};

// Tags API
export const tagsAPI = {
  getTags: (params?: any) => 
    api.get('/tags', { params }),
  
  getTagById: (tagId: string) => 
    api.get(`/tags/${tagId}`),
  
  getTagBySlug: (slug: string) => 
    api.get(`/tags/slug/${slug}`),
  
  createTag: (tagData: any) => 
    api.post('/tags', tagData),
  
  updateTag: (tagId: string, tagData: any) => 
    api.put(`/tags/${tagId}`, tagData),
  
  deleteTag: (tagId: string) => 
    api.delete(`/tags/${tagId}`),
};

// Comments API
export const commentsAPI = {
  getCommentsByPost: (postId: string, params?: any) => 
    api.get(`/comments/post/${postId}`, { params }),
  
  getCommentById: (commentId: string) => 
    api.get(`/comments/${commentId}`),
  
  createComment: (commentData: any) => 
    api.post('/comments', commentData),
  
  updateComment: (commentId: string, commentData: any) => 
    api.put(`/comments/${commentId}`, commentData),
  
  deleteComment: (commentId: string) => 
    api.delete(`/comments/${commentId}`),
  
  likeComment: (commentId: string) => 
    api.post(`/comments/${commentId}/like`),
  
  approveComment: (commentId: string) => 
    api.post(`/comments/${commentId}/approve`),
};

export default api; 