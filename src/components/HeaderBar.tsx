import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Badge, Tooltip, Typography, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  BulbOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  ProjectOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { List } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout as apiLogout } from '../features/auth';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useTheme } from '../contexts/ThemeContext';
import './HeaderBar.css';

const { Header } = Layout;

const notifications = [
  { id: 1, title: 'Bạn có 1 task mới', time: '2 phút trước' },
  { id: 2, title: 'Dự án ABC đã cập nhật', time: '1 giờ trước' },
  { id: 3, title: 'Nguyễn Văn B đã bình luận', time: 'Hôm qua' },
];

const notificationList = (
  <div className="notification-dropdown">
    <div className="notification-header">
      <BellOutlined style={{ color: '#4f46e5', fontSize: 20, marginRight: 8 }} />
      <Typography.Title level={5} className="notification-title">Thông báo</Typography.Title>
    </div>
    <List
      dataSource={notifications}
      renderItem={(item: { id: number; title: string; time: string }) => (
        <List.Item className="notification-item">
          <List.Item.Meta
            title={<Typography.Text className="notification-item-title">{item.title}</Typography.Text>}
            description={<span className="notification-item-time">{item.time}</span>}
          />
        </List.Item>
      )}
      locale={{ emptyText: <div style={{ textAlign: 'center', color: '#aaa', padding: '32px 0' }}>Không có thông báo mới.</div> }}
      style={{ borderRadius: 12, background: 'transparent' }}
    />
  </div>
);

const HeaderBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();
  
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
            <div 
              className="project-card"
              onClick={() => navigate(`/projects/${projectId}`)}
            >
              <ProjectOutlined className="project-icon" />
              <div>
                <Typography.Text className="project-name">
                  {project.name}
                </Typography.Text>
                <div className="project-details">
                  {project.status && (
                    <span className={`project-status ${project.status === 'active' ? 'status-active' : 'status-paused'}`}>
                      ● {project.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                    </span>
                  )}
                  {project.total_tasks && (
                    <span>
                      📋 {project.total_tasks} tasks
                    </span>
                  )}
                  {project.members && (
                    <span>
                      👥 {project.members.length} thành viên
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side - All Icons */}
      <div className="header-actions">
        <Tooltip title="Task của bạn">
          <Badge count={myTaskCount} size="small">
            <CheckSquareOutlined className="header-icon" />
          </Badge>
        </Tooltip>
        <Tooltip title="Tin nhắn cần trả lời">
          <Badge count={myMessageCount} size="small">
            <MessageOutlined className="header-icon" />
          </Badge>
        </Tooltip>
        <Dropdown
          overlay={notificationList}
          placement="bottomRight"
          trigger={['click']}
          arrow
        >
          <span>
            <Badge count={notifications.length} size="small">
              <BellOutlined className="header-icon" />
            </Badge>
          </span>
        </Dropdown>
        <Tooltip title={isDarkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}>
          <Button
            type="text"
            icon={isDarkMode ? <BulbOutlined /> : <BulbFilled />}
            onClick={toggleTheme}
            className="theme-toggle"
          />
        </Tooltip>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Avatar
            size={36}
            src={user.avatar || undefined}
            className="user-avatar"
            icon={!user.avatar ? <UserOutlined style={{ fontSize: 20 }} /> : undefined}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;