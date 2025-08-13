import React from 'react';
import { Card, Row, Col, Typography, Tag, Space, Avatar, Button } from 'antd';
import { UserOutlined, CalendarOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface AccountInfoProps {
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

const AccountInfo: React.FC<AccountInfoProps> = ({ user }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'red';
      case 'manager':
        return 'blue';
      case 'member':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Card title={t('settings.accountInfo.title', 'Account Information')} style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col xs={24} md={8}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Avatar 
              size={80} 
              src={user.avatar} 
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Title level={4} style={{ margin: '8px 0' }}>
              {user.name}
            </Title>
            <Space direction="vertical" size="small">
              <Tag color={getRoleColor(user.role)}>
                {t(`settings.accountInfo.roles.${user.role}`, user.role)}
              </Tag>
              <Tag color={getStatusColor(user.status)}>
                {t(`settings.accountInfo.status.${user.status}`, user.status)}
              </Tag>
            </Space>
          </div>
        </Col>

        <Col xs={24} md={16}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  <MailOutlined style={{ marginRight: 8 }} />
                  {t('settings.accountInfo.email', 'Email')}
                </Text>
                <Text strong>{user.email}</Text>
                {user.emailVerified && (
                  <Tag color="green" style={{ marginLeft: 8 }}>
                    {t('settings.accountInfo.verified', 'Verified')}
                  </Tag>
                )}
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {t('settings.accountInfo.memberSince', 'Member Since')}
                </Text>
                <Text strong>
                  {dayjs(user.createdAt).format('MMM DD, YYYY')}
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  <CalendarOutlined style={{ marginRight: 8 }} />
                  {t('settings.accountInfo.lastLogin', 'Last Login')}
                </Text>
                <Text strong>
                  {dayjs(user.lastLogin).format('MMM DD, YYYY HH:mm')}
                </Text>
              </div>
            </Col>

            <Col xs={24} sm={12}>
              <div style={{ marginBottom: 16 }}>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                  <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                  {t('settings.accountInfo.twoFactor', 'Two-Factor Auth')}
                </Text>
                <Tag color={user.twoFactorEnabled ? 'green' : 'red'}>
                  {user.twoFactorEnabled 
                    ? t('settings.accountInfo.enabled', 'Enabled')
                    : t('settings.accountInfo.disabled', 'Disabled')
                  }
                </Tag>
              </div>
            </Col>
          </Row>

          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              {t('settings.accountInfo.accountId', 'Account ID')}: {user.email.split('@')[0]}
            </Text>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default AccountInfo; 