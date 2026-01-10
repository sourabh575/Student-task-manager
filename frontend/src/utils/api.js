// --------- API Configuration ----------
// This utility handles all authenticated API requests
// Automatically adds JWT token to Authorization header

const API_BASE_URL = 'http://localhost:5000/api';

// --------- Helper: Get Token from Storage ----------
const getToken = () => {
  return localStorage.getItem('token');
};

// --------- Helper: Remove Token from Storage ----------
const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// --------- Generic Fetch Wrapper ----------
// Adds Authorization header with token if it exists
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Add Authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    // If token expired (401), remove it and redirect to login
    if (response.status === 401) {
      if (data.message && data.message.includes('expired')) {
        removeToken();
        window.location.href = '/login';
      }
    }

    return {
      status: response.status,
      ok: response.ok,
      data
    };
  } catch (err) {
    console.error('API call error:', err);
    return {
      status: 500,
      ok: false,
      data: { message: 'Network error. Please check your connection.' }
    };
  }
};

// --------- API Methods ----------

// Auth Endpoints
export const authAPI = {
  signup: (name, email, password, confirmPassword) =>
    apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword })
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
};

// Task Endpoints
export const taskAPI = {
  getTasks: () =>
    apiCall('/tasks', { method: 'GET' }),

  getTask: (id) =>
    apiCall(`/tasks/${id}`, { method: 'GET' }),

  createTask: (taskData) =>
    apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }),

  updateTask: (id, taskData) =>
    apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    }),

  deleteTask: (id) =>
    apiCall(`/tasks/${id}`, { method: 'DELETE' })
};

// --------- Auth Utilities ----------
export const auth = {
  getToken,
  removeToken,
  isAuthenticated: () => !!getToken(),
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  logout: () => {
    removeToken();
    window.location.href = '/login';
  }
};
