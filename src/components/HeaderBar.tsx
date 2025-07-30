import React from 'react';
import { Layout, Avatar, Dropdown, Menu, Badge, Tooltip, Typography } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  BulbOutlined,
  CheckSquareOutlined,
  MessageOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import { List, Button as AntdButton, Tooltip as AntdTooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { logout as apiLogout } from '../features/auth';
import { message } from 'antd';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const { Header } = Layout;

const notifications = [
  { id: 1, title: 'Bạn có 1 task mới', time: '2 phút trước' },
  { id: 2, title: 'Dự án ABC đã cập nhật', time: '1 giờ trước' },
  { id: 3, title: 'Nguyễn Văn B đã bình luận', time: 'Hôm qua' },
];

const notificationList = (
  <div style={{ width: 340, maxHeight: 380, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(80,80,180,0.10)', padding: 0 }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px 8px 20px', borderBottom: '1px solid #f0f0f0' }}>
      <BellOutlined style={{ color: '#4B48E5', fontSize: 20, marginRight: 8 }} />
      <Typography.Title level={5} style={{ margin: 0, fontSize: 16 }}>Thông báo</Typography.Title>
    </div>
    <List
      dataSource={notifications}
      renderItem={(item: { id: number; title: string; time: string }) => (
        <List.Item
          style={{
            padding: '12px 20px',
            cursor: 'pointer',
            borderBottom: '1px solid #f5f5f5',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => (e.currentTarget.style.background = '#f6f8ff')}
          onMouseOut={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => (e.currentTarget.style.background = '#fff')}
        >
          <List.Item.Meta
            title={<Typography.Text strong style={{ fontSize: 15 }}>{item.title}</Typography.Text>}
            description={<span style={{ color: '#888', fontSize: 12 }}>{item.time}</span>}
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
  
  const user = {
    name: 'Nguyễn Văn A',
    avatar: '',
  };
  const myTaskCount = 5;
  const myMessageCount = 2;

  // Get project info from Redux store
  const project = useSelector((state: RootState) => state.project.detail);

  // Check if we're in a project page
  const isInProject = location.pathname.includes('/projects/') && location.pathname.split('/').length > 2;
  const projectId = location.pathname.split('/')[2]; // Get project ID from URL

  const handleMenuClick = async (e: any) => {
    if (e.key === 'logout') {
      try {
        await apiLogout();
        localStorage.removeItem('user');
        navigate('/login');
      } catch (err: any) {
        message.error(t('logoutFailed') || 'Đăng xuất thất bại!');
      }
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
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isInProject && project ? 'space-between' : 'flex-end',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Project Info */}
      {isInProject && project && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 8,
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            onClick={() => navigate(`/projects/${projectId}`)}
          >
            <ProjectOutlined style={{ color: '#4B48E5', fontSize: 20 }} />
            <div>
              <Typography.Text strong style={{ fontSize: 16, color: '#222' }}>
                {project.name}
              </Typography.Text>
              <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                {project.status && (
                  <span style={{ 
                    color: project.status === 'active' ? '#52c41a' : '#faad14',
                    marginRight: 8 
                  }}>
                    ● {project.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                  </span>
                )}
                {project.total_tasks && (
                  <span style={{ marginRight: 8 }}>
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

      {/* Right side icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Tooltip title="Task của bạn">
          <Badge count={myTaskCount} size="small">
            <CheckSquareOutlined style={{ fontSize: 22, color: '#4B48E5', cursor: 'pointer' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Tin nhắn cần trả lời">
          <Badge count={myMessageCount} size="small">
            <MessageOutlined style={{ fontSize: 22, color: '#4B48E5', cursor: 'pointer' }} />
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
              <BellOutlined style={{ fontSize: 22, color: '#4B48E5', cursor: 'pointer' }} />
            </Badge>
          </span>
        </Dropdown>
        <Tooltip title="Chuyển chế độ sáng/tối">
          <BulbOutlined style={{ fontSize: 22, color: '#4B48E5', cursor: 'pointer' }} />
        </Tooltip>
        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <Avatar
            size={36}
            src={user.avatar || undefined}
            style={{
              background: user.avatar ? undefined : '#e0e0e0',
              color: '#555',
              marginLeft: 12,
              cursor: 'pointer',
              border: '1px solid #eee',
              boxShadow: 'none',
            }}
            icon={!user.avatar ? <UserOutlined style={{ fontSize: 20 }} /> : undefined}
          />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;