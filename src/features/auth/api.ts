import axios from '../../services/axios';

export const login = (data: { email: string; password: string }) =>
  axios.post('/login', data);

export const logout = () => axios.post('/logout', {});