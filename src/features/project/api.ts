import axios from '../../services/axios';

// Lấy danh sách project
export const fetchProjects = (query?: any) =>
  axios.get(`/projects${query}`);

// Lấy chi tiết 1 project
export const fetchProjectDetail = (id: string | number) =>
  axios.get(`/projects/${id}`);

// Tạo mới project
export const createProject = (data: any) =>
  axios.post('/projects', data);

// Cập nhật project
export const updateProject = (id: string | number, data: any) =>
  axios.put(`/projects/${id}`, data);

// Xóa project
export const deleteProject = (id: string | number) =>
  axios.delete(`/projects/${id}`);