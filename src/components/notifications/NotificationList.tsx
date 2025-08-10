import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  List,
  Card,
  Badge,
  Button,
  Select,
  Switch,
  Tag,
  Typography,
  Space,
  Empty,
  Spin,
  message,
  Popconfirm,
} from 'antd';
import {
  BellOutlined,
  MailOutlined,
  MessageOutlined,
  MobileOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { RootState } from '../../app/store';
import {
  fetchNotifications,
  fetchNotificationOptions,
  markNotificationAsRead,
  markAllAsRead,
  setSelectedCategory,
  setShowUnreadOnly,
} from '../../features/notifications/notificationSlice';
import { Notification } from '../../features/notifications/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface NotificationListProps {
  compact?: boolean;
  limit?: number;
}

const NotificationList: React.FC<NotificationListProps> = ({ compact = false, limit }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const {
    notifications,
    notificationsLoading,
    notificationsError,
    categories,
    channels,
    priorities,
    selectedCategory,
    showUnreadOnly,
  } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    const filters: any = {};
    if (selectedCategory) {
      filters.category = selectedCategory;
    }
    if (showUnreadOnly) {
      filters.unread = true;
    }

    console.log('NotificationList Debug - Fetching with filters:', filters);
    dispatch(fetchNotifications(filters) as any);
  }, [dispatch, selectedCategory, showUnreadOnly]);

  useEffect(() => {
    console.log('NotificationList Debug - Fetching options');
    dispatch(fetchNotificationOptions() as any);
  }, [dispatch]);

  // Debug logging
  console.log('NotificationList Debug:', {
    notifications: notifications.length,
    notificationsLoading,
    notificationsError,
    categories: Object.keys(categories).length,
    channels: Object.keys(channels).length,
    priorities: Object.keys(priorities).length,
    selectedCategory,
    showUnreadOnly,
    unreadCount: notifications.filter(n => !n.is_read).length
  });

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.is_read) return;

    setLoadingIds(prev => [...prev, notification.id]);
    try {
      await dispatch(markNotificationAsRead(notification.id) as any);
      message.success(t('notifications.markReadSuccess'));
    } catch (error) {
      message.error(t('notifications.markReadError'));
    } finally {
      setLoadingIds(prev => prev.filter(id => id !== notification.id));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllAsRead(selectedCategory || undefined) as any);
      message.success(t('notifications.markAllReadSuccess'));
    } catch (error) {
      message.error(t('notifications.markAllReadError'));
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <MailOutlined />;
      case 'push':
        return <BellOutlined />;
      case 'sms':
        return <MobileOutlined />;
      case 'in_app':
        return <MessageOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'normal':
        return 'blue';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t('common.justNow');
    } else if (diffInHours < 24) {
      return t('common.hoursAgo', { count: Math.floor(diffInHours) });
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = limit 
    ? notifications.slice(0, limit)
    : notifications;

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div>
      {!compact && (
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Select
              placeholder={t('notifications.selectCategory')}
              allowClear
              value={selectedCategory}
              onChange={(value) => dispatch(setSelectedCategory(value))}
              style={{ width: 200 }}
            >
              {Object.entries(categories).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>

            <Switch
              checked={showUnreadOnly}
              onChange={(checked) => dispatch(setShowUnreadOnly(checked))}
              checkedChildren={t('notifications.unreadOnly')}
              unCheckedChildren={t('notifications.showAll')}
            />

            {unreadCount > 0 && (
              <Popconfirm
                title={t('notifications.markAllReadConfirm')}
                onConfirm={handleMarkAllAsRead}
                okText={t('common.yes')}
                cancelText={t('common.no')}
              >
                <Button type="primary">
                  {t('notifications.markAllAsRead')} ({unreadCount})
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      )}

      <Spin spinning={notificationsLoading}>
        {notificationsError && (
          <Card>
            <Text type="danger">{notificationsError}</Text>
          </Card>
        )}

        {filteredNotifications.length === 0 ? (
          <Empty
            description={t('notifications.noNotifications')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={filteredNotifications}
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
            }}
            renderItem={(notification: Notification) => (
              <List.Item
                key={notification.id}
                className={`${!notification.is_read ? 'notification-unread' : ''}`}
                style={{
                  backgroundColor: !notification.is_read ? '#f6ffed' : '#ffffff',
                  cursor: 'pointer',
                  padding: compact ? '12px 16px' : '16px',
                  borderBottom: '1px solid #f0f0f0',
                  margin: 0,
                  transition: 'background-color 0.2s ease',
                }}
                onClick={() => handleMarkAsRead(notification)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = !notification.is_read ? '#f0f9ff' : '#fafafa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = !notification.is_read ? '#f6ffed' : '#ffffff';
                }}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ position: 'relative' }}>
                      {getChannelIcon(notification.channel)}
                      {!notification.is_read && (
                        <Badge
                          dot
                          style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            backgroundColor: '#ff4d4f',
                          }}
                        />
                      )}
                    </div>
                  }
                  title={
                    <Space>
                      <Text 
                        strong={!notification.is_read}
                        style={{ 
                          fontSize: compact ? '14px' : '16px',
                          color: !notification.is_read ? '#262626' : '#595959',
                        }}
                      >
                        {notification.title}
                      </Text>
                      <Tag color={getPriorityColor(notification.priority)}>
                        {priorities[notification.priority] || notification.priority}
                      </Tag>
                      <Tag color={getStatusColor(notification.status)}>
                        {notification.status}
                      </Tag>
                    </Space>
                  }
                  description={
                    <div>
                      <Paragraph 
                        ellipsis={{ rows: compact ? 1 : 2 }}
                        style={{ 
                          marginBottom: 8,
                          fontSize: compact ? '12px' : '14px',
                          color: '#8c8c8c',
                        }}
                      >
                        {notification.message}
                      </Paragraph>
                      <Space size="small">
                        {notification.category && (
                          <Tag>
                            {categories[notification.category] || notification.category}
                          </Tag>
                        )}
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <ClockCircleOutlined style={{ marginRight: 4 }} />
                          {formatDate(notification.sent_at || notification.created_at)}
                        </Text>
                        {notification.action_url && (
                          <a 
                            href={notification.action_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{ fontSize: '12px', color: '#1890ff' }}
                          >
                            <LinkOutlined />
                            {t('notifications.viewDetails')}
                          </a>
                        )}
                      </Space>
                    </div>
                  }
                />
                {loadingIds.includes(notification.id) && (
                  <Spin size="small" />
                )}
                {notification.is_read && (
                  <CheckOutlined style={{ color: '#52c41a' }} />
                )}
              </List.Item>
            )}
          />
        )}
      </Spin>

      <style>{`
        .notification-unread {
          border-left: 3px solid #1890ff !important;
          background-color: #f6ffed !important;
        }
        .notification-unread:hover {
          background-color: #f0f9ff !important;
        }
      `}</style>
    </div>
  );
};

export default NotificationList;