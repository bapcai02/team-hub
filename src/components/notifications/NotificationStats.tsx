import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Spin,
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { RootState } from '../../app/store';
import { fetchNotificationStats } from '../../features/notifications/notificationSlice';

const { Title } = Typography;

const NotificationStats: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { stats, statsLoading } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationStats() as any);
  }, [dispatch]);

  if (statsLoading) {
    return (
      <Card>
        <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: 50 }} />
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        <BellOutlined style={{ marginRight: 8 }} />
        {t('notifications.stats.title')}
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.total')}
              value={stats.total}
              prefix={<BellOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.sent')}
              value={stats.sent}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.pending')}
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.failed')}
              value={stats.failed}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.unread')}
              value={stats.unread}
              prefix={<EyeInvisibleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.readRate')}
              value={stats.total > 0 ? ((stats.total - stats.unread) / stats.total * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.successRate')}
              value={stats.total > 0 ? (stats.sent / stats.total * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.failureRate')}
              value={stats.total > 0 ? (stats.failed / stats.total * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NotificationStats;