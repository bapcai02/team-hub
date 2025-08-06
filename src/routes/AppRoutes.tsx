import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ProjectList from '../pages/project/ProjectList';
import ProjectDetail from '../pages/project/ProjectDetail';
import ProjectEdit from '../pages/project/ProjectEdit';
import TaskDetail from '../pages/project/TaskDetail';
import TaskList from '../pages/project/TaskList';
import TaskKanban from '../pages/project/TaskKanban';
import Login from '../pages/auth/Login';
import EmployeeList from '../pages/employee/EmployeeList';
import EmployeeDetail from '../pages/employee/EmployeeDetail';
import AttendanceList from '../pages/attendance/AttendanceList';
import LeaveList from '../pages/leave/LeaveList';
import ChatList from '../pages/chat/ChatList';
import MeetingList from '../pages/meeting/MeetingList';
import CalendarPage from '../pages/calendar/CalendarPage';
import DocumentsPage from '../pages/documents/DocumentsPage';
import DevicesPage from '../pages/devices/DevicesPage';
import DeviceCategoriesPage from '../pages/devices/DeviceCategoriesPage';
import DeviceStatsPage from '../pages/devices/DeviceStatsPage';
import PayrollPage from '../pages/finance/PayrollPage';
import ExpensePage from '../pages/finance/ExpensePage';
import SalaryComponentPage from '../pages/finance/SalaryComponentPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import React from 'react';

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return { isAuthenticated: !!user, user };
};

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === 'admin' ? <>{children}</> : <Navigate to="/" />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
      <Route path="/projects" element={
        <PrivateRoute>
          <ProjectList />
        </PrivateRoute>
      } />
      <Route path="/projects/:id" element={
        <PrivateRoute>
          <ProjectDetail />
        </PrivateRoute>
      } />
      <Route path="/projects/:id/edit" element={
        <PrivateRoute>
          <ProjectEdit />
        </PrivateRoute>
      } />
      <Route path="/projects/:id/tasks" element={
        <PrivateRoute>
          <TaskList />
        </PrivateRoute>
      } />
      <Route path="/projects/:id/kanban" element={
        <PrivateRoute>
          <TaskKanban />
        </PrivateRoute>
      } />
      <Route path="/projects/task/:id" element={
        <PrivateRoute>
          <TaskDetail />
        </PrivateRoute>
      } />
      <Route path="/projects/task/:id/kaban" element={
        <PrivateRoute>
          <TaskKanban />
        </PrivateRoute>
      } />
      <Route path="/chat" element={
        <PrivateRoute>
          <ChatList />
        </PrivateRoute>
      } />
      <Route path="/meetings" element={
        <PrivateRoute>
          <MeetingList />
        </PrivateRoute>
      } />
      <Route path="/calendar" element={
        <PrivateRoute>
          <CalendarPage />
        </PrivateRoute>
      } />
      <Route path="/documents" element={
        <PrivateRoute>
          <DocumentsPage />
        </PrivateRoute>
      } />
      <Route path="/devices" element={
        <PrivateRoute>
          <DevicesPage />
        </PrivateRoute>
      } />
                        <Route path="/devices/categories" element={
                    <PrivateRoute>
                      <DeviceCategoriesPage />
                    </PrivateRoute>
                  } />
                              <Route path="/devices/stats" element={
              <PrivateRoute>
                <DeviceStatsPage />
              </PrivateRoute>
            } />
            
            {/* Finance Routes */}
            <Route path="/finance/payroll" element={
              <PrivateRoute>
                <PayrollPage />
              </PrivateRoute>
            } />
            <Route path="/finance/expenses" element={
              <PrivateRoute>
                <ExpensePage />
              </PrivateRoute>
            } />
            <Route path="/finance/salary-components" element={
              <PrivateRoute>
                <SalaryComponentPage />
              </PrivateRoute>
            } />
            
            {/* Analytics Routes */}
            <Route path="/analytics" element={
              <PrivateRoute>
                <AnalyticsPage />
              </PrivateRoute>
            } />
      
      {/* HRM Routes */}
      <Route path="/employees" element={
        <PrivateRoute>
          <EmployeeList />
        </PrivateRoute>
      } />
      <Route path="/employees/:id" element={
        <PrivateRoute>
          <EmployeeDetail />
        </PrivateRoute>
      } />
      <Route path="/attendance" element={
        <PrivateRoute>
          <AttendanceList />
        </PrivateRoute>
      } />
      <Route path="/leaves" element={
        <PrivateRoute>
          <LeaveList />
        </PrivateRoute>
      } />
      
      <Route path="/admin" element={
        <AdminRoute>
          <div>Admin Site</div>
        </AdminRoute>
      } />
      {/* Thêm route khác ở đây */}
    </Routes>
  );
}