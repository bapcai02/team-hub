import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { login } from '../../features/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      const res = await login(values);
      const user = res.data.user || res.data;
      localStorage.setItem('user', JSON.stringify(user));
      message.success(t('loginSuccess'));
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err: any) {
      message.error(err?.response?.data?.message || t('loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafd 60%, #e6eaff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card
        style={{ width: 380, borderRadius: 18, boxShadow: '0 4px 32px #4B48E520', padding: '32px 0' }}
        bodyStyle={{ padding: 32 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="48" height="48" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="180" y="220" width="120" height="580" rx="32" fill="#4B48E5"/>
            <rect x="452" y="120" width="120" height="680" rx="32" fill="#00d4ff"/>
            <rect x="724" y="320" width="120" height="480" rx="32" fill="#ffb347"/>
          </svg>
          <div style={{ fontWeight: 900, fontSize: 28, marginTop: 8, letterSpacing: 2, background: 'linear-gradient(90deg, #4B48E5 0%, #00d4ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TeamHub
          </div>
        </div>
        <Typography.Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>{t('login')}</Typography.Title>
        <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
          <Form.Item
            name="email"
            label={t('email')}
            rules={[
              { required: true, message: t('emailRequired') },
              { type: 'email', message: t('emailInvalid') },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder={t('emailPlaceholder')} size="large" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('password')}
            rules={[
              { required: true, message: t('passwordRequired') },
              { min: 6, message: t('passwordMinLength', { min: 6 }) },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder={t('passwordPlaceholder')} size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ borderRadius: 8 }}>{t('login')}</Button>
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="#" style={{ color: '#4B48E5' }}>{t('forgotPassword')}</a>
            <span>
              {t('noAccount')}
              <a href="/register" style={{ marginLeft: 4, color: '#00d4ff', fontWeight: 500 }}>{t('registerNow')}</a>
            </span>
          </div>
        </Form>
      </Card>
    </div>
  );
}
