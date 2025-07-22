import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/project/projectSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;