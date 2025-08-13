import React, { useState } from 'react';
import { Form, Input, Switch, Button, Card, Row, Col, Space, Divider, Typography, Alert, List, Tag } from 'antd';
import { SaveOutlined, LockOutlined, SafetyOutlined, MobileOutlined, DesktopOutlined } from '@ant-design/icons';
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
      await onSave(values);
      if (values.new_password) {
        setShowPasswordForm(false);
        form.resetFields(['current_password', 'new_password', 'new_password_confirmation']);
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
    }
  };

  const mockLoginHistory = [
    {
      id: 1,
      device: 'Chrome on Windows 10',
      location: 'Ho Chi Minh City, Vietnam',
      ip: '192.168.1.100',
      timestamp: '2024-01-15 14:30:00',
      status: 'success'
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'Hanoi, Vietnam',
      ip: '192.168.1.101',
      timestamp: '2024-01-14 09:15:00',
      status: 'success'
    },
    {
      id: 3,
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
    <Card title={t('settings.security.title', 'Security Settings')} style={{ marginBottom: 24 }}>
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
              {t('settings.security.password', 'Password')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          {!showPasswordForm ? (
            <div>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {t('settings.security.passwordDesc', 'Change your account password to keep your account secure.')}
              </Text>
              <Button 
                type="primary" 
                onClick={() => setShowPasswordForm(true)}
              >
                {t('settings.security.changePassword', 'Change Password')}
              </Button>
            </div>
          ) : (
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  name="current_password"
                  label={t('settings.security.currentPassword', 'Current Password')}
                  rules={[
                    { required: true, message: t('settings.security.currentPasswordRequired', 'Please enter your current password') }
                  ]}
                >
                  <Input.Password placeholder={t('settings.security.currentPasswordPlaceholder', 'Enter current password')} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="new_password"
                  label={t('settings.security.newPassword', 'New Password')}
                  rules={[
                    { required: true, message: t('settings.security.newPasswordRequired', 'Please enter new password') },
                    { min: 8, message: t('settings.security.passwordMinLength', 'Password must be at least 8 characters') },
                    { 
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
                      message: t('settings.security.passwordPattern', 'Password must contain uppercase, lowercase and number') 
                    }
                  ]}
                >
                  <Input.Password placeholder={t('settings.security.newPasswordPlaceholder', 'Enter new password')} />
                </Form.Item>
              </Col>
              
              <Col xs={24} md={8}>
                <Form.Item
                  name="new_password_confirmation"
                  label={t('settings.security.confirmPassword', 'Confirm Password')}
                  rules={[
                    { required: true, message: t('settings.security.confirmPasswordRequired', 'Please confirm your password') },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('new_password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error(t('settings.security.passwordMismatch', 'Passwords do not match')));
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder={t('settings.security.confirmPasswordPlaceholder', 'Confirm new password')} />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Card>

        {/* Two-Factor Authentication */}
        <Card 
          title={
            <Space>
              <SafetyOutlined />
              {t('settings.security.twoFactor', 'Two-Factor Authentication')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16} align="middle">
            <Col xs={24} md={16}>
              <Title level={5}>{t('settings.security.twoFactorTitle', 'Two-Factor Authentication')}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                {t('settings.security.twoFactorDesc', 'Add an extra layer of security to your account by enabling two-factor authentication.')}
              </Text>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: 'right' }}>
              <Form.Item
                name="two_factor_enabled"
                valuePropName="checked"
                style={{ margin: 0 }}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          
          {data?.two_factor_enabled && (
            <Alert
              message={t('settings.security.twoFactorEnabled', 'Two-factor authentication is enabled')}
              description={t('settings.security.twoFactorEnabledDesc', 'Your account is protected with two-factor authentication.')}
              type="success"
              showIcon
              style={{ marginTop: 16 }}
            />
          )}
        </Card>

        {/* Login History */}
        <Card 
          title={
            <Space>
              <DesktopOutlined />
              {t('settings.security.loginHistory', 'Login History')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <List
            dataSource={mockLoginHistory}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <Space>
                      {item.device}
                      <Tag color={item.status === 'success' ? 'green' : 'red'}>
                        {item.status === 'success' ? t('settings.security.successful', 'Successful') : t('settings.security.failed', 'Failed')}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">{item.location} • {item.ip}</Text>
                      <Text type="secondary">{item.timestamp}</Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>

        {/* Trusted Devices */}
        <Card 
          title={
            <Space>
              <MobileOutlined />
              {t('settings.security.trustedDevices', 'Trusted Devices')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <List
            dataSource={mockTrustedDevices}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button type="link" danger>
                    {t('settings.security.remove', 'Remove')}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      {item.name}
                      <Tag color="blue">{t('settings.security.trusted', 'Trusted')}</Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <Text type="secondary">{item.device}</Text>
                      <Text type="secondary">{t('settings.security.lastUsed', 'Last used')}: {item.lastUsed}</Text>
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
              {t('settings.save', 'Save Changes')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SecuritySettings; 