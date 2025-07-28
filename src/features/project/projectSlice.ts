import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as projectApi from './api';
import type { SerializedError } from '@reduxjs/toolkit';
import type { Project, CreateProjectData, ProjectState } from './types';

export const getProjects = createAsyncThunk(
  'project/getProjects',
  async (query: string, thunkAPI) => {
    const res = await projectApi.fetchProjects(query);
    return res.data;
  }
);

export const getProjectDetail = createAsyncThunk(
  'project/getProjectDetail',
  async (id: string | number, thunkAPI) => {
    const res = await projectApi.fetchProjectDetail(id);
    return res.data;
  }
);

export const createNewProject = createAsyncThunk(
  'project/createNewProject',
  async (projectData: CreateProjectData, thunkAPI) => {
    const res = await projectApi.createProject(projectData);
    return res.data;
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ id, data }: { id: string | number, data: CreateProjectData }, thunkAPI) => {
    const res = await projectApi.updateProject(id, data);
    return res.data;
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (id: string | number, thunkAPI) => {
    const res = await projectApi.deleteProject(id);
    return { id, data: res.data };
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    list: [] as Project[],
    detail: null as Project | null,
    loading: false,
    error: null as null | SerializedError,
  } as ProjectState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProjects.pending, state => { state.loading = true; })
      .addCase(getProjects.fulfilled, (state, action) => {        
        state.loading = false;
        state.list = action.payload.data.projects;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(createNewProject.pending, state => {
        state.loading = true;
      })
      .addCase(createNewProject.fulfilled, (state, action) => {
        state.loading = false;
        // Thêm project mới vào danh sách
        state.list = [...state.list, action.payload.data];
      })
      .addCase(createNewProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(updateProject.pending, state => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        // Cập nhật project trong danh sách
        const index = state.list.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) {
          state.list[index] = action.payload.data;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(deleteProject.pending, state => {
        state.loading = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        // Xóa project khỏi danh sách
        state.list = state.list.filter(p => p.id !== action.payload.id);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      })
      .addCase(getProjectDetail.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload.data;
      })
      .addCase(getProjectDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  }
});

export default projectSlice.reducer;
