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
    <Card title={t('settings.app.title')} style={{ marginBottom: 24 }}>
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
              label={t('settings.app.language')}
              rules={[
                { required: true, message: t('settings.app.languageRequired') }
              ]}
            >
              <Select placeholder={t('settings.app.languagePlaceholder')}>
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
              label={t('settings.app.timezone')}
              rules={[
                { required: true, message: t('settings.app.timezoneRequired') }
              ]}
            >
              <Select placeholder={t('settings.app.timezonePlaceholder')}>
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

        <Divider>{t('settings.app.appearance')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="theme"
              label={t('settings.app.theme')}
              rules={[
                { required: true, message: t('settings.app.themeRequired') }
              ]}
            >
              <Select placeholder={t('settings.app.themePlaceholder')}>
                <Option value="light">{t('settings.app.lightTheme')}</Option>
                <Option value="dark">{t('settings.app.darkTheme')}</Option>
                <Option value="auto">{t('settings.app.autoTheme')}</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="layout"
              label={t('settings.app.layout')}
              rules={[
                { required: true, message: t('settings.app.layoutRequired') }
              ]}
            >
              <Select placeholder={t('settings.app.layoutPlaceholder')}>
                <Option value="compact">{t('settings.app.compact')}</Option>
                <Option value="comfortable">{t('settings.app.comfortable')}</Option>
                <Option value="spacious">{t('settings.app.spacious')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider>{t('settings.app.interface')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="sidebar_collapsed"
              label={t('settings.app.sidebarCollapsed')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes')} 
                unCheckedChildren={t('settings.app.no')}
              />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('settings.app.sidebarCollapsedDesc')}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="show_animations"
              label={t('settings.app.showAnimations')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes')} 
                unCheckedChildren={t('settings.app.no')}
              />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('settings.app.showAnimationsDesc')}
            </div>
          </Col>
        </Row>

        <Divider>{t('settings.app.notifications')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="sound_enabled"
              label={t('settings.app.soundEnabled')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes')} 
                unCheckedChildren={t('settings.app.no')}
              />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('settings.app.soundEnabledDesc')}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="desktop_notifications"
              label={t('settings.app.desktopNotifications')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes')} 
                unCheckedChildren={t('settings.app.no')}
              />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('settings.app.desktopNotificationsDesc')}
            </div>
          </Col>
        </Row>

        <Divider>{t('settings.app.data')}</Divider>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="auto_save"
              label={t('settings.app.autoSave')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes')} 
                unCheckedChildren={t('settings.app.no')}
              />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('settings.app.autoSaveDesc')}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="analytics_enabled"
              label={t('settings.app.analyticsEnabled')}
              valuePropName="checked"
            >
              <Switch 
                checkedChildren={t('settings.app.yes')} 
                unCheckedChildren={t('settings.app.no')}
              />
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {t('settings.app.analyticsEnabledDesc')}
            </div>
          </Col>
        </Row>

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saving}
              icon={<SaveOutlined />}
            >
              {t('common.save')}
            </Button>
            <Button 
              onClick={handleReset}
              icon={<ReloadOutlined />}
            >
              {t('settings.app.reset')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AppSettings; 