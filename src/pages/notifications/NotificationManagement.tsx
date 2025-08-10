import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tabs,
  Card,
  Typography,
  Space,
  Button,
  Modal,
  message,
} from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  BarChartOutlined,
  SendOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import NotificationList from '../../components/notifications/NotificationList';
import NotificationPreferences from '../../components/notifications/NotificationPreferences';
import NotificationStats from '../../components/notifications/NotificationStats';
import NotificationTemplates from '../../components/notifications/NotificationTemplates';
import SendNotificationForm from '../../components/notifications/SendNotificationForm';
import { RootState } from '../../app/store';
import {
  fetchNotifications,
  fetchNotificationStats,
  fetchNotificationPreferences,
  fetchNotificationTemplates,
  fetchNotificationOptions,
  sendNotification,
  clearNotificationsError,
} from '../../features/notifications/notificationSlice';

const { Title } = Typography;

const NotificationManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const {
    notificationsLoading,
    notificationsError,
    statsLoading,
    preferencesLoading,
    templatesLoading,
  } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    // Load initial data
    dispatch(fetchNotifications() as any);
    dispatch(fetchNotificationStats() as any);
    dispatch(fetchNotificationPreferences() as any);
    dispatch(fetchNotificationTemplates() as any);
    dispatch(fetchNotificationOptions() as any);
  }, [dispatch]);

  useEffect(() => {
    if (notificationsError) {
      message.error(notificationsError);
      dispatch(clearNotificationsError());
    }
  }, [notificationsError, dispatch]);

  const handleSendSuccess = () => {
    setSendModalVisible(false);
    message.success(t('notifications.send.success'));
    // Refresh notifications after sending
    dispatch(fetchNotifications() as any);
  };

  const handleSendError = (error: string) => {
    message.error(error || t('notifications.send.error'));
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Title level={2} style={{ margin: 0 }}>
            <BellOutlined style={{ marginRight: 8 }} />
            {t('notifications.management.title')}
          </Title>
          <Button 
            type="primary" 
            icon={<SendOutlined />}
            onClick={() => setSendModalVisible(true)}
            loading={notificationsLoading}
          >
            {t('notifications.management.sendNew')}
          </Button>
        </Space>
      </div>

      <Tabs 
        defaultActiveKey="notifications"
        items={[
          {
            key: 'notifications',
            label: (
              <span>
                <BellOutlined />
                {t('notifications.management.notifications')}
              </span>
            ),
            children: (
              <Card>
                <NotificationList />
              </Card>
            ),
          },
          {
            key: 'statistics',
            label: (
              <span>
                <BarChartOutlined />
                {t('notifications.management.statistics')}
              </span>
            ),
            children: <NotificationStats />,
          },
          {
            key: 'preferences',
            label: (
              <span>
                <SettingOutlined />
                {t('notifications.management.preferences')}
              </span>
            ),
            children: <NotificationPreferences />,
          },
          {
            key: 'templates',
            label: (
              <span>
                <FileTextOutlined />
                {t('notifications.management.templates')}
              </span>
            ),
            children: <NotificationTemplates />,
          },
        ]}
      />

      <Modal
        title={t('notifications.send.title')}
        open={sendModalVisible}
        onCancel={() => setSendModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <SendNotificationForm 
          onSuccess={handleSendSuccess}
          onError={handleSendError}
        />
      </Modal>
    </MainLayout>
  );
};

export default NotificationManagement;