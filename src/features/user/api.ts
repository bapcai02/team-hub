import axios from '../../services/axios'

export const fetchUsers = (params?: any) =>
  axios.get('/users', { params })
