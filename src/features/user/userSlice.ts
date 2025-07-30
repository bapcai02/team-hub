import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as userApi from './api'
import type { SerializedError } from '@reduxjs/toolkit'

// User type definition (Added)
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  role?: string;
  department?: string;
  position?: string;
}

// User state interface (Added)
interface UserState {
  list: User[];
  loading: boolean;
  error: null | SerializedError;
}

const initialState: UserState = { // Changed
  list: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'https://via.placeholder.com/40/7B7FFF/FFFFFF?text=J',
      isOnline: true,
      role: 'admin',
      department: 'Engineering',
      position: 'Senior Developer'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      avatar: 'https://via.placeholder.com/40/4B4BFF/FFFFFF?text=J',
      isOnline: true,
      role: 'user',
      department: 'Design',
      position: 'UI/UX Designer'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      avatar: 'https://via.placeholder.com/40/52C41A/FFFFFF?text=M',
      isOnline: false,
      lastSeen: '2024-01-15T08:30:00Z',
      role: 'user',
      department: 'Engineering',
      position: 'Frontend Developer'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      avatar: 'https://via.placeholder.com/40/FA8C16/FFFFFF?text=S',
      isOnline: true,
      role: 'user',
      department: 'Marketing',
      position: 'Marketing Manager'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@company.com',
      avatar: 'https://via.placeholder.com/40/722ED1/FFFFFF?text=D',
      isOnline: false,
      lastSeen: '2024-01-15T07:45:00Z',
      role: 'user',
      department: 'Engineering',
      position: 'Backend Developer'
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      avatar: 'https://via.placeholder.com/40/13C2C2/FFFFFF?text=E',
      isOnline: true,
      role: 'user',
      department: 'Design',
      position: 'Graphic Designer'
    },
    {
      id: 7,
      name: 'Alex Thompson',
      email: 'alex.thompson@company.com',
      avatar: 'https://via.placeholder.com/40/EB2F96/FFFFFF?text=A',
      isOnline: false,
      lastSeen: '2024-01-15T06:20:00Z',
      role: 'user',
      department: 'Sales',
      position: 'Sales Representative'
    },
    {
      id: 8,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      avatar: 'https://via.placeholder.com/40/52C41A/FFFFFF?text=L',
      isOnline: true,
      role: 'user',
      department: 'HR',
      position: 'HR Manager'
    }
  ],
  loading: false,
  error: null,
}

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (params, thunkAPI) => {
    const res = await userApi.fetchUsers(params)
    return res.data
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState, // Changed
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUsers.pending, state => { state.loading = true })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false
        // Only update if we get real data from API
        if (action.payload && action.payload.data && action.payload.data.users) {
          state.list = action.payload.data.users
        }
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error
      })
  }
})

export default userSlice.reducer
