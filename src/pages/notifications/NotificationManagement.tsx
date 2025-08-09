import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Layout,
  Tabs,
  Card,
  Typography,
  Space,
  Button,
  Modal,
} from 'antd';
import {
  BellOutlined,
  SettingOutlined,
  BarChartOutlined,
  SendOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import NotificationList from '../../components/notifications/NotificationList';
import NotificationPreferences from '../../components/notifications/NotificationPreferences';
import NotificationStats from '../../components/notifications/NotificationStats';
import SendNotificationForm from '../../components/notifications/SendNotificationForm';

const { Content } = Layout;
const { Title } = Typography;

const NotificationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [sendModalVisible, setSendModalVisible] = useState(false);

  const handleSendSuccess = () => {
    setSendModalVisible(false);
    // Optionally refresh the notification list
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* HeaderBar placeholder */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 64, backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', zIndex: 1000 }}>
        {/* This would be your actual HeaderBar component */}
      </div>
      
      {/* Sidebar placeholder */}
      <div style={{ width: 250, backgroundColor: '#001529', position: 'fixed', height: '100vh', top: 64 }}>
        {/* This would be your actual Sidebar component */}
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 250, marginTop: 64, flex: 1 }}>
        <Layout>
          <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
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
                  children: (
                    <Card>
                      <Title level={4}>
                        <FileTextOutlined style={{ marginRight: 8 }} />
                        {t('notifications.templates.title')}
                      </Title>
                      <p>{t('notifications.templates.description')}</p>
                      {/* Template management component would go here */}
                    </Card>
                  ),
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
              <SendNotificationForm onSuccess={handleSendSuccess} />
            </Modal>
          </Content>
        </Layout>
      </div>
    </div>
  );
};

export default NotificationManagement;