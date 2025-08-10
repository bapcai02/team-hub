import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Space, message } from 'antd';
import MainLayout from '../../layouts/MainLayout';
import { RootState } from '../../app/store';
import { 
  fetchNotifications, 
  fetchNotificationOptions,
  sendNotification 
} from '../../features/notifications/notificationSlice';

const NotificationTestPage: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications, categories, channels, priorities } = useSelector(
    (state: RootState) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications() as any);
    dispatch(fetchNotificationOptions() as any);
  }, [dispatch]);

  const handleTestNotification = async () => {
    try {
      await dispatch(sendNotification({
        title: 'Test Notification',
        message: 'This is a test notification from the frontend!',
        recipients: [1],
        type: 'in_app',
        priority: 'normal',
        category: 'system',
      }) as any);
      message.success('Test notification sent!');
    } catch (error) {
      message.error('Failed to send test notification');
    }
  };

  return (
    <MainLayout>
      <Card title="Notification System Test">
        <Space direction="vertical" style={{ width: '100%' }}>
          <p>Total notifications: {notifications.length}</p>
          <p>Categories: {Object.keys(categories).length}</p>
          <p>Channels: {Object.keys(channels).length}</p>
          <p>Priorities: {Object.keys(priorities).length}</p>
          
          <Button type="primary" onClick={handleTestNotification}>
            Send Test Notification
          </Button>
        </Space>
      </Card>
    </MainLayout>
  );
};

export default NotificationTestPage;