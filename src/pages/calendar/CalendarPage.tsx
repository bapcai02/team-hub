import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, Card, Row, Col, Statistic, Space, Button, Badge } from 'antd';
import { CalendarOutlined, PlusOutlined, ClockCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import MainLayout from '../../layouts/MainLayout';
import CalendarComponent from '../../components/calendar/Calendar';
import './CalendarPage.css';

const { Title, Text, Paragraph } = Typography;

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();

  // Mock data for statistics
  const stats = {
    totalEvents: 24,
    upcomingEvents: 8,
    completedEvents: 12,
    overdueEvents: 4
  };

  return (
    <MainLayout>
      <div className="calendar-page">
        {/* Header Section */}
        <div className="calendar-header">
          <div className="header-content">
            <div className="header-left">
              <Title level={2} className="page-title">
                <CalendarOutlined className="title-icon" />
                {t('calendar.title')}
              </Title>
              <Paragraph className="page-description">
                {t('calendar.description')}
              </Paragraph>
            </div>
            <div className="header-right">
              <Space>
                <Button type="primary" icon={<PlusOutlined />} size="large">
                  {t('calendar.createEvent')}
                </Button>
              </Space>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} className="stats-section">
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card total-events">
              <Statistic
                title={t('calendar.stats.totalEvents')}
                value={stats.totalEvents}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#6366F1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card upcoming-events">
              <Statistic
                title={t('calendar.stats.upcomingEvents')}
                value={stats.upcomingEvents}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#10B981' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card completed-events">
              <Statistic
                title={t('calendar.stats.completedEvents')}
                value={stats.completedEvents}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#34A853' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card overdue-events">
              <Statistic
                title={t('calendar.stats.overdueEvents')}
                value={stats.overdueEvents}
                prefix={<ExclamationCircleOutlined />}
                valueStyle={{ color: '#EF4444' }}
                suffix={
                  <Badge 
                    count={stats.overdueEvents} 
                    style={{ backgroundColor: '#EF4444' }}
                  />
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Calendar Component */}
        <Card className="calendar-card">
          <CalendarComponent />
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPage; 