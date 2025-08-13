import React, { useState } from 'react';
import { Form, Switch, Input, Card, Row, Col, Space, Divider, Typography, Button, Alert, List, Tag } from 'antd';
import { SaveOutlined, LockOutlined, SafetyCertificateOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

interface SecuritySettingsProps {
  data?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ data, onSave, saving }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleSubmit = async (values: any) => {
    try {
      const settings = {
        two_factor_enabled: values.two_factor_enabled,
        current_password: values.current_password,
        new_password: values.new_password,
        new_password_confirmation: values.new_password_confirmation,
      };
      
      await onSave({ settings });
      if (values.new_password) {
        setShowPasswordForm(false);
        form.resetFields(['current_password', 'new_password', 'new_password_confirmation']);
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
    }
  };

  // Mock data for demonstration
  const mockLoginHistory = [
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Ho Chi Minh City, Vietnam',
      ip: '192.168.1.100',
      timestamp: '2024-01-15 14:30:00',
      status: 'success'
    },
    {
      id: 2,
      device: 'Firefox on MacOS',
      location: 'Unknown',
      ip: '192.168.1.102',
      timestamp: '2024-01-13 16:45:00',
      status: 'failed'
    }
  ];

  const mockTrustedDevices = [
    {
      id: 1,
      name: 'My MacBook Pro',
      device: 'MacOS - Chrome',
      lastUsed: '2024-01-15 14:30:00',
      trusted: true
    },
    {
      id: 2,
      name: 'iPhone 13',
      device: 'iOS - Safari',
      lastUsed: '2024-01-14 09:15:00',
      trusted: true
    }
  ];

  return (
    <Card title={t('settings.security.title')} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          two_factor_enabled: data?.two_factor_enabled || false,
        }}
        onFinish={handleSubmit}
      >
        {/* Password Change Section */}
        <Card 
          title={
            <Space>
              <LockOutlined />
              {t('settings.security.password')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          {!showPasswordForm ? (
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {t('settings.security.passwordDesc')}
              </Text>
              <Button 
                type="primary" 
                onClick={() => setShowPasswordForm(true)}
              >
                {t('settings.security.changePassword')}
              </Button>
            </div>
          ) : (
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="current_password"
                  label={t('settings.security.currentPassword')}
                  rules={[
                    { required: true, message: t('settings.security.currentPasswordRequired') }
                  ]}
                >
                  <Input.Password placeholder={t('settings.security.currentPasswordPlaceholder')} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="new_password"
                  label={t('settings.security.newPassword')}
                  rules={[
                    { required: true, message: t('settings.security.newPasswordRequired') },
                    { min: 8, message: t('settings.security.passwordMinLength') },
                    { 
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                      message: t('settings.security.passwordPattern') 
                    }
                  ]}
                >
                  <Input.Password placeholder={t('settings.security.newPasswordPlaceholder')} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="new_password_confirmation"
                  label={t('settings.security.confirmPassword')}
                  rules={[
                    { required: true, message: t('settings.security.confirmPasswordRequired') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('settings.security.passwordMismatch')));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder={t('settings.security.confirmPasswordPlaceholder')} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        {/* Two-Factor Authentication */}
        <Card 
          title={
            <Space>
              <SafetyCertificateOutlined />
              {t('settings.security.twoFactor')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>{t('settings.security.twoFactorTitle')}</Title>
            <Text type="secondary">
              {t('settings.security.twoFactorDesc')}
            </Text>
          </div>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="two_factor_enabled"
                label={t('settings.security.enableTwoFactor')}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {data?.two_factor_enabled && (
            <Alert
              message={t('settings.security.twoFactorEnabled')}
              description={t('settings.security.twoFactorEnabledDesc')}
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>

        {/* Login History */}
        <Card 
          title={t('settings.security.loginHistory')} 
          style={{ marginBottom: 24 }}
        >
          <List
            dataSource={mockLoginHistory}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.device}
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">{item.location} • {item.ip}</Text>
                      <Text type="secondary">{item.timestamp}</Text>
                    </Space>
                  }
                />
                <Tag color={item.status === 'success' ? 'green' : 'red'}>
                  {item.status === 'success' ? t('settings.security.successful') : t('settings.security.failed')}
                </Tag>
              </List.Item>
            )}
          />
        </Card>

        {/* Trusted Devices */}
        <Card 
          title={t('settings.security.trustedDevices')} 
          style={{ marginBottom: 24 }}
        >
          <List
            dataSource={mockTrustedDevices}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    key="remove"
                  >
                    {t('settings.security.remove')}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      {item.name}
                      <Tag color="blue">{t('settings.security.trusted')}</Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">{item.device}</Text>
                      <Text type="secondary">{t('settings.security.lastUsed')}: {item.lastUsed}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

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
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SecuritySettings; 