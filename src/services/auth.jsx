import api from './api';

export const authService = {

  async getUserProfile() {
          const response = await api.get(`/api/v1/customers/me/`);
          return response.data;
      },
  
  async login(username, password) {
    try{
      const response = await api.post('/api/v1/login/', { username, password });
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);

      if (response.data.user){
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error: ', error);
      throw error;
    }
  },

  async registerCustomer(data) {
    const response = await api.post('/register/customer/', data);
    return response.data;
  },

  async registerDriver(data) {
    const response = await api.post('/register/driver/', data);
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  getCachedUser() {
    try {
      const cachedUser = localStorage.getItem('user');
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (e) {
      console.error('Failed to parse cached user:', e);
      localStorage.removeItem('user');
      return null;
    }
  },

  async getCurrentUser() {
    try {
      const cachedUser = this.getCachedUser();
      if (cachedUser) {
        return cachedUser;
      }
      const endpoints = ['customers/me', 'drivers/me'];
      for (const endpoint of endpoints){
        try{
          const response = await api.get(endpoint);
          localStorage.setItem('user', JSON.stringify(response.data))
          return response.data
        }catch(err){
          if (err.response?.status === 401){
            this.logout();
            window.location.href = '/signin';
            return null;
          }
        }
      }

    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
        window.location.href = '/signin';
      }
      throw error;
    }
  },

  async updateCurrentUser(userData) {
    try {
      const response = await api.patch('/customers/update_profile/', userData);
      
      const currentUser = this.getCachedUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  isAuthenticated() {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      
      if (Date.now() >= expiry - 5000) {
        console.log('Token expired or about to expire');
        return false;
      }
      
      return true;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.logout();
        window.location.href = '/signin';
      }
      console.error('Token validation error:', error);
      return false;
    }
  },
};