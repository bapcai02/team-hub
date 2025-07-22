import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as projectApi from './api';
import type { SerializedError } from '@reduxjs/toolkit';

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

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    list: [],
    detail: null,
    loading: false,
    error: null as null | SerializedError,
  },
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
      });
  }
});

export default projectSlice.reducer;
