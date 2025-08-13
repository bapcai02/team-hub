import React from 'react';
import { Form, Select, Switch, Button, Card, Row, Col, Space, Divider } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

interface AppSettingsProps {
  data?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const AppSettings: React.FC<AppSettingsProps> = ({ data, onSave, saving }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await onSave(values);
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card title={t('settings.app.title', 'Application Settings')} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          language: data?.language || 'en',
          timezone: data?.timezone || 'UTC',
          theme: data?.theme || 'light',
          layout: data?.layout || 'comfortable',
          sidebar_collapsed: data?.sidebar_collapsed || false,
        }}
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="language"
              label={t('settings.app.language', 'Language')}
              rules={[
                { required: true, message: t('settings.app.languageRequired', 'Please select a language') }
              ]}
            >
              <Select placeholder={t('settings.app.languagePlaceholder', 'Select language')}>
                <Option value="en">English</Option>
                <Option value="vi">Tiếng Việt</Option>
                <Option value="ja">日本語</Option>
                <Option value="ko">한국어</Option>
                <Option value="zh">中文</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="timezone"
              label={t('settings.app.timezone', 'Timezone')}
              rules={[
                { required: true, message: t('settings.app.timezoneRequired', 'Please select a timezone') }
              ]}
            >
              <Select placeholder={t('settings.app.timezonePlaceholder', 'Select timezone')}>
                <Option value="UTC">UTC</Option>
                <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</Option>
                <Option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</Option>
                <Option value="America/New_York">America/New_York (GMT-5)</Option>
                <Option value="Europe/London">Europe/London (GMT+0)</Option>
                <Option value="Australia/Sydney">Australia/Sydney (GMT+10)</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider>{t('settings.app.appearance', 'Appearance')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="theme"
              label={t('settings.app.theme', 'Theme')}
              rules={[
                { required: true, message: t('settings.app.themeRequired', 'Please select a theme') }
              ]}
            >
              <Select placeholder={t('settings.app.themePlaceholder', 'Select theme')}>
                <Option value="light">{t('settings.app.lightTheme', 'Light')}</Option>
                <Option value="dark">{t('settings.app.darkTheme', 'Dark')}</Option>
                <Option value="auto">{t('settings.app.autoTheme', 'Auto (System)')}</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="layout"
              label={t('settings.app.layout', 'Layout Density')}
              rules={[
                { required: true, message: t('settings.app.layoutRequired', 'Please select layout density') }
              ]}
            >
              <Select placeholder={t('settings.app.layoutPlaceholder', 'Select layout density')}>
                <Option value="compact">{t('settings.app.compactLayout', 'Compact')}</Option>
                <Option value="comfortable">{t('settings.app.comfortableLayout', 'Comfortable')}</Option>
                <Option value="spacious">{t('settings.app.spaciousLayout', 'Spacious')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider>{t('settings.app.interface', 'Interface')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="sidebar_collapsed"
              label={t('settings.app.sidebarCollapsed', 'Sidebar Collapsed')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes', 'Yes')} 
                unCheckedChildren={t('settings.app.no', 'No')}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="show_animations"
              label={t('settings.app.showAnimations', 'Show Animations')}
              valuePropName="checked"
              initialValue={data?.show_animations ?? true}
            >
              <Switch 
                checkedChildren={t('settings.app.yes', 'Yes')} 
                unCheckedChildren={t('settings.app.no', 'No')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider>{t('settings.app.notifications', 'Notifications')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="sound_enabled"
              label={t('settings.app.soundEnabled', 'Sound Notifications')}
              valuePropName="checked"
              initialValue={data?.sound_enabled ?? true}
            >
              <Switch 
                checkedChildren={t('settings.app.yes', 'Yes')} 
                unCheckedChildren={t('settings.app.no', 'No')}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="desktop_notifications"
              label={t('settings.app.desktopNotifications', 'Desktop Notifications')}
              valuePropName="checked"
              initialValue={data?.desktop_notifications ?? true}
            >
              <Switch 
                checkedChildren={t('settings.app.yes', 'Yes')} 
                unCheckedChildren={t('settings.app.no', 'No')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider>{t('settings.app.data', 'Data & Privacy')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="auto_save"
              label={t('settings.app.autoSave', 'Auto Save')}
              valuePropName="checked"
              initialValue={data?.auto_save ?? true}
            >
              <Switch 
                checkedChildren={t('settings.app.yes', 'Yes')} 
                unCheckedChildren={t('settings.app.no', 'No')}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="analytics_enabled"
              label={t('settings.app.analyticsEnabled', 'Analytics & Usage Data')}
              valuePropName="checked"
              initialValue={data?.analytics_enabled ?? true}
            >
              <Switch 
                checkedChildren={t('settings.app.yes', 'Yes')} 
                unCheckedChildren={t('settings.app.no', 'No')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saving}
              icon={<SaveOutlined />}
            >
              {t('settings.save', 'Save Changes')}
            </Button>
            <Button 
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              {t('settings.reset', 'Reset to Default')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppSettings; 