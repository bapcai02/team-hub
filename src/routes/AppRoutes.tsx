import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ProjectList from '../pages/project/ProjectList';
import ProjectDetail from '../pages/project/ProjectDetail';
import ProjectEdit from '../pages/project/ProjectEdit';
import TaskDetail from '../pages/project/TaskDetail';
import TaskList from '../pages/project/TaskList';
import TaskKanban from '../pages/project/TaskKanban';
import Login from '../pages/auth/Login';
import ChatList from '../pages/chat/ChatList';
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
      <Route path="/admin" element={
        <AdminRoute>
          <div>Admin Site</div>
        </AdminRoute>
      } />
      {/* Thêm route khác ở đây */}
    </Routes>
  );
}