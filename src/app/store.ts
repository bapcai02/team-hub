import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import projectReducer from '../features/project/projectSlice';
import userReducer from '../features/user/userSlice';
import chatReducer from '../features/chat/chatSlice';
import meetingReducer from '../features/meeting/meetingSlice';
import calendarReducer from '../features/calendar/calendarSlice';
import documentsReducer from '../features/documents/documentsSlice';
import devicesReducer from '../features/devices/devicesSlice';
import attendanceReducer from '../features/attendance/attendanceSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import financeReducer from '../features/finance/financeSlice';
import analyticsReducer from '../features/analytics/analyticsSlice';
import guestReducer from '../features/guest/guestSlice';
import holidayReducer from '../features/holiday/holidaySlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    user: userReducer,
    chat: chatReducer,
    meeting: meetingReducer,
    calendar: calendarReducer,
    documents: documentsReducer,
    devices: devicesReducer,
    attendance: attendanceReducer,
    dashboard: dashboardReducer,
    finance: financeReducer,
    analytics: analyticsReducer,
    guest: guestReducer,
    holiday: holidayReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;