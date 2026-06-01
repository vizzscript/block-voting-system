import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if unauthorized and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (refreshToken) {
        try {
          // Make direct call using standard axios to avoid loop
          const res = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refreshToken }
          );
          
          const { accessToken, refreshToken: newRefreshToken } = res.data;
          
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Clear credentials and force login if refresh token fails
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_role');
          window.location.href = '/login?expired=true';
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
