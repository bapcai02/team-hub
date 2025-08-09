import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Dropdown,
  Button,
  Typography,
  Space,
  Divider,
  Empty,
} from 'antd';
import {
  BellOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { RootState } from '../../app/store';
import {
  fetchNotifications,
  fetchNotificationStats,
  markNotificationAsRead,
} from '../../features/notifications/notificationSlice';
import NotificationList from './NotificationList';

const { Text } = Typography;

const NotificationBell: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const {
    notifications,
    stats,
    notificationsLoading,
  } = useSelector((state: RootState) => state.notifications);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    // Fetch recent notifications (limit to 10 for dropdown)
    dispatch(fetchNotifications({ unread: false }) as any);
    dispatch(fetchNotificationStats() as any);

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchNotifications({ unread: false }) as any);
      dispatch(fetchNotificationStats() as any);
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleNotificationClick = (notification: any) => {
    if (!notification.is_read) {
      dispatch(markNotificationAsRead(notification.id) as any);
    }
    
    // Close dropdown
    setDropdownVisible(false);
    
    // Navigate to action URL if available
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  const handleViewAll = () => {
    setDropdownVisible(false);
    navigate('/notifications');
  };

  const handleManagePreferences = () => {
    setDropdownVisible(false);
    navigate('/notifications?tab=preferences');
  };

  const dropdownContent = (
    <div style={{ width: 400, maxHeight: 500, overflow: 'auto' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space>
          <Text strong>{t('notifications.list.title')}</Text>
          {unreadCount > 0 && (
            <Badge count={unreadCount} size="small" />
          )}
        </Space>
      </div>

      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 20 }}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('notifications.list.noNotifications')}
            />
          </div>
        ) : (
          <NotificationList 
            compact={true} 
            limit={10}
          />
        )}
      </div>

      <Divider style={{ margin: 0 }} />
      
      <div style={{ padding: '8px 16px' }}>
        <Space split={<Divider type="vertical" />}>
          <Button type="link" size="small" onClick={handleViewAll}>
            {t('notifications.management.notifications')}
          </Button>
          <Button 
            type="link" 
            size="small" 
            icon={<SettingOutlined />}
            onClick={handleManagePreferences}
          >
            {t('notifications.management.preferences')}
          </Button>
        </Space>
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      placement="bottomRight"
      open={dropdownVisible}
      onOpenChange={setDropdownVisible}
    >
      <Button 
        type="text" 
        icon={
          <Badge count={unreadCount} size="small" offset={[2, 0]}>
            <BellOutlined style={{ fontSize: 18 }} />
          </Badge>
        }
        loading={notificationsLoading}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: 40,
          width: 40,
        }}
      />
    </Dropdown>
  );
};

export default NotificationBell;