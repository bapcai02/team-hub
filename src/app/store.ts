// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/project/projectSlice';
// import các slice khác...

export const store = configureStore({
  reducer: {
    project: projectReducer,
    // user: userReducer,
    // auth: authReducer,
    // ...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;