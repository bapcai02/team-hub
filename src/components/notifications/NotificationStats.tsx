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

  const { stats, statsLoading, statsError } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationStats() as any);
  }, [dispatch]);

  // Debug logging
  console.log('NotificationStats Debug:', {
    stats,
    statsLoading,
    statsError
  });

  // Fallback data if stats is null
  const displayStats = stats || {
    total: 0,
    sent: 0,
    pending: 0,
    failed: 0,
    unread: 0,
  };

  if (statsLoading) {
    return (
      <Card>
        <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: 50 }} />
      </Card>
    );
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        <BellOutlined style={{ marginRight: 8 }} />
        {t('notifications.stats.title') || 'Notification Statistics'}
      </Title>

      {statsError && (
        <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 6 }}>
          <Typography.Text type="danger">
            {statsError}
          </Typography.Text>
        </div>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.total') || 'Total'}
              value={displayStats.total}
              prefix={<BellOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.sent') || 'Sent'}
              value={displayStats.sent}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.pending') || 'Pending'}
              value={displayStats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.failed') || 'Failed'}
              value={displayStats.failed}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.unread') || 'Unread'}
              value={displayStats.unread}
              prefix={<EyeInvisibleOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.readRate') || 'Read Rate'}
              value={displayStats.total > 0 ? ((displayStats.total - displayStats.unread) / displayStats.total * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.successRate') || 'Success Rate'}
              value={displayStats.total > 0 ? (displayStats.sent / displayStats.total * 100).toFixed(1) : 0}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('notifications.stats.failureRate') || 'Failure Rate'}
              value={displayStats.total > 0 ? (displayStats.failed / displayStats.total * 100).toFixed(1) : 0}
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