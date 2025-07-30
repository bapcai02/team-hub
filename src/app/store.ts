import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/project/projectSlice';
import userReducer from '../features/user/userSlice';
import chatReducer from '../features/chat/chatSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    user: userReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;