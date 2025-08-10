import axios from '../../services/axios';

export const login = (data: { email: string; password: string }) =>
  axios.post('/login', data);

export const logout = () => {
  // Clear tokens from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('access-token');
  localStorage.removeItem('user');
  
  // Call logout API
  return axios.post('/logout', {});
};