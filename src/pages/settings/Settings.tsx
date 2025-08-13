import React, { useState, useEffect } from 'react';
import { Tabs, Card, message, Spin, Avatar, Upload, Button, Switch, Select, Input, Form, DatePicker, Radio, Space, Divider, Typography } from 'antd';
import { UserOutlined, SettingOutlined, BellOutlined, LockOutlined, EyeOutlined, ToolOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import MainLayout from '../../layouts/MainLayout';
import ProfileSettings from './components/ProfileSettings';
import AppSettings from './components/AppSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import PrivacySettings from './components/PrivacySettings';
import AccessibilitySettings from './components/AccessibilitySettings';
import apiClient from '../../lib/apiClient';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface SettingsData {
  profile: {
    name: string;
    email: string;
    avatar: string;
    phone: string;
    birth_date: string;
    gender: string;
    bio: string;
    location: string;
  };
  app: {
    language: string;
    timezone: string;
    theme: string;
    layout: string;
    sidebar_collapsed: boolean;
    dashboard_widgets: any[];
    shortcuts: any[];
  };
  notifications: any;
  security: {
    two_factor_enabled: boolean;
    login_history: any[];
    trusted_devices: any[];
  };
  integrations: any;
  privacy: any;
  accessibility: any;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/settings');
      setSettings(response.data.data);
    } catch (error) {
      console.error('Error loading settings:', error);
      message.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string, data: any) => {
    try {
      setSaving(true);
      const response = await apiClient.put(`/settings/${section}`, data);
      
      if (response.data.success) {
        message.success(response.data.message);
        await loadSettings(); // Reload settings
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      message.error(`Failed to save ${section} settings`);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await apiClient.get('/settings/export');
      const data = response.data.data;
      
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('Data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            <SettingOutlined style={{ marginRight: '12px' }} />
            {t('settings.title', 'Settings')}
          </Title>
          <Text type="secondary">
            {t('settings.description', 'Manage your account settings and preferences')}
          </Text>
        </div>

        <Card>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            type="card"
            size="large"
            style={{ marginBottom: '24px' }}
          >
            <TabPane 
              tab={
                <span>
                  <UserOutlined />
                  {t('settings.profile', 'Profile')}
                </span>
              } 
              key="profile"
            >
              <ProfileSettings 
                data={settings?.profile} 
                onSave={(data) => handleSave('profile', data)}
                saving={saving}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <SettingOutlined />
                  {t('settings.app', 'App')}
                </span>
              } 
              key="app"
            >
              <AppSettings 
                data={settings?.app} 
                onSave={(data) => handleSave('app', data)}
                saving={saving}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <BellOutlined />
                  {t('settings.notifications', 'Notifications')}
                </span>
              } 
              key="notifications"
            >
              <NotificationSettings 
                data={settings?.notifications} 
                onSave={(data) => handleSave('notifications', data)}
                saving={saving}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <LockOutlined />
                  {t('settings.security', 'Security')}
                </span>
              } 
              key="security"
            >
              <SecuritySettings 
                data={settings?.security} 
                onSave={(data) => handleSave('security', data)}
                saving={saving}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <EyeOutlined />
                  {t('settings.privacy', 'Privacy')}
                </span>
              } 
              key="privacy"
            >
              <PrivacySettings 
                data={settings?.privacy} 
                onSave={(data) => handleSave('privacy', data)}
                saving={saving}
              />
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <ToolOutlined />
                  {t('settings.accessibility', 'Accessibility')}
                </span>
              } 
              key="accessibility"
            >
              <AccessibilitySettings 
                data={settings?.accessibility} 
                onSave={(data) => handleSave('accessibility', data)}
                saving={saving}
              />
            </TabPane>
          </Tabs>

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text type="secondary">
                {t('settings.exportDescription', 'Export your data for backup or transfer')}
              </Text>
            </div>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExportData}
            >
              {t('settings.exportData', 'Export Data')}
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Settings; 