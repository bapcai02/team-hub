import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Badge, Tooltip, Typography, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { List } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout as apiLogout } from '../features/auth';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import NotificationBell from './notifications/NotificationBell';
import './HeaderBar.css';

const { Header } = Layout;

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const user = {
    name: 'Nguyễn Văn A',
    avatar: '',
  };
  const myTaskCount = 5;
  const myMessageCount = 2;
  const project = useSelector((state: RootState) => state.project.detail);
  const isInProject = location.pathname.includes('/projects/') && location.pathname.split('/').length > 2;
  const projectId = location.pathname.split('/')[2];

  const handleMenuClick = async (e: any) => {
    if (e.key === 'logout') {
      try {
        await apiLogout();
        message.success(t('logoutSuccess') || 'Đăng xuất thành công!');
      } catch (err: any) {
        console.warn('Logout API failed, but continuing with local logout:', err);
      } finally {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('access_token');
        sessionStorage.clear();
        navigate('/login');
      }
    } else if (e.key === 'profile') {
      navigate('/profile');
    }
  };
  
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<UserOutlined />}>{t('profile') || 'Trang cá nhân'}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger>{t('logout') || 'Đăng xuất'}</Menu.Item>
    </Menu>
  );

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Left side - Project Info */}
      <div className="header-left">
        {isInProject && project && (
          <div className="project-info">
            <ProjectOutlined style={{ fontSize: 20, color: '#4f46e5', marginRight: 8 }} />
            <div>
              <Typography.Text strong style={{ fontSize: 16 }}>
                {project.name}
              </Typography.Text>
              <br />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {t('project')} • {project.members?.length || 0} {t('members')}
              </Typography.Text>
            </div>
          </div>
        )}
      </div>

      {/* Right side - All Icons */}
      <div className="header-actions">
        {/* My Tasks */}
        <Tooltip title={t('myTasks') || 'Công việc của tôi'}>
          <Button
            type="text"
            icon={
              <Badge count={myTaskCount} size="small" offset={[2, 0]}>
                <CheckSquareOutlined style={{ fontSize: 18 }} />
              </Badge>
            }
            onClick={() => navigate('/tasks')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 40,
              width: 40,
            }}
          />
        </Tooltip>

        {/* Messages */}
        <Tooltip title={t('messages') || 'Tin nhắn'}>
          <Button
            type="text"
            icon={
              <Badge count={myMessageCount} size="small" offset={[2, 0]}>
                <MessageOutlined style={{ fontSize: 18 }} />
              </Badge>
            }
            onClick={() => navigate('/chat')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 40,
              width: 40,
            }}
          />
        </Tooltip>

        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Button
            type="text"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: 40,
              width: 40,
              padding: 0,
            }}
          >
            <Avatar 
              size={32} 
              icon={<UserOutlined />} 
              src={user.avatar}
              style={{ 
                backgroundColor: '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            />
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;