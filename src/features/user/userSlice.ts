import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as userApi from './api'
import type { SerializedError } from '@reduxjs/toolkit'

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (params, thunkAPI) => {
    const res = await userApi.fetchUsers(params)
    return res.data
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    list: [],
    loading: false,
    error: null as null | SerializedError,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUsers.pending, state => { state.loading = true })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload.data.users
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  }
})

export default userSlice.reducer
