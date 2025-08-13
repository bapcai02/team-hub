import React, { useState, useEffect } from 'react';
import { Tabs, Card, message, Spin, Avatar, Upload, Button, Switch, Select, Input, Form, DatePicker, Radio, Space, Divider, Typography, Layout } from 'antd';
import { UserOutlined, SettingOutlined, BellOutlined, LockOutlined, EyeOutlined, ToolOutlined, DownloadOutlined, UploadOutlined, DatabaseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import ProfileSettings from './components/ProfileSettings';
import AppSettings from './components/AppSettings';
import NotificationSettings from './components/NotificationSettings';
import SecuritySettings from './components/SecuritySettings';
import PrivacySettings from './components/PrivacySettings';
import AccessibilitySettings from './components/AccessibilitySettings';
import DataManagement from './components/DataManagement';
import AccountInfo from './components/AccountInfo';
import apiClient from '../../lib/apiClient';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;

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
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
    status: string;
    createdAt: string;
    lastLogin: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
  };
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
      message.error(t('settings.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: string, data: any) => {
    try {
      setSaving(true);
      const response = await apiClient.put(`/settings/${section}`, data);
      
      if (response.data.success) {
        message.success(t('settings.saveSuccess'));
        await loadSettings(); // Reload settings
      }
    } catch (error) {
      console.error(`Error saving ${section} settings:`, error);
      message.error(t('settings.saveError'));
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
      
      message.success(t('settings.exportSuccess'));
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error(t('settings.exportError'));
    }
  };

  const handleImportData = async (data: any) => {
    try {
      setSaving(true);
      const response = await apiClient.post('/settings/import', data);
      
      if (response.data.success) {
        message.success(t('settings.importSuccess'));
        await loadSettings(); // Reload settings
      }
    } catch (error) {
      console.error('Error importing data:', error);
      message.error(t('settings.importError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <HeaderBar />
          <Content style={{ padding: '24px', background: theme === 'dark' ? '#141414' : '#F3F4F6' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <Spin size="large" />
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ padding: '24px', background: theme === 'dark' ? '#141414' : '#F3F4F6' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            <SettingOutlined style={{ marginRight: '12px' }} />
            {t('settings.title', 'Settings')}
          </Title>
          <Text type="secondary">
            {t('settings.description', 'Manage your account settings and preferences')}
          </Text>
        </div>

        {settings?.user && (
          <AccountInfo user={settings.user} />
        )}

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
                  {t('settings.profileTab')}
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
                  {t('settings.appTab')}
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
                  {t('settings.notificationsTab')}
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
                  {t('settings.securityTab')}
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
                  {t('settings.privacyTab')}
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
                  {t('settings.accessibilityTab')}
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

            <TabPane 
              tab={
                <span>
                  <DatabaseOutlined />
                  {t('settings.dataManagement.title')}
                </span>
              } 
              key="data"
            >
              <DataManagement 
                onExport={handleExportData}
                onImport={handleImportData}
              />
            </TabPane>
          </Tabs>

        </Card>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Settings; 