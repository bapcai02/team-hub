import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag } from 'antd';
import { 
  TeamOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  DollarOutlined,
  CalendarOutlined 
} from '@ant-design/icons';
import type { Project } from '../features/project/types';

interface ProjectStatsProps {
  project: Project;
  t: (key: string) => string;
}

export default function ProjectStats({ project, t }: ProjectStatsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'processing';
      case 'completed': return 'success';
      case 'planning': return 'blue';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return t('active');
      case 'completed': return t('completed');
      case 'planning': return t('planning');
      case 'archived': return t('archived');
      default: return status;
    }
  };

  const calculateDaysRemaining = () => {
    const endDate = new Date(project.end_date);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title={t('members')}
            value={project.total_members || project.members?.length || 0}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title={t('tasks')}
            value={project.total_tasks || 0}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title={t('budget')}
            value={project.total_amount || 0}
            prefix={<DollarOutlined />}
            valueStyle={{ color: '#faad14' }}
            formatter={(value) => `$${Number(value).toLocaleString()}`}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title={t('daysRemaining')}
            value={daysRemaining}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: daysRemaining < 7 ? '#ff4d4f' : '#52c41a' }}
            suffix={t('days')}
          />
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={12}>
        <Card title={t('progress')}>
          <Progress
            percent={project.progress_percent || 0}
            status={project.status === 'active' ? 'active' : 'normal'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <div style={{ marginTop: 8 }}>
            <Tag color={getStatusColor(project.status)}>
              {getStatusText(project.status)}
            </Tag>
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={12}>
        <Card title={t('timeline')}>
          <div style={{ fontSize: 14 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>{t('startDate')}:</strong> {new Date(project.start_date).toLocaleDateString()}
            </div>
            <div>
              <strong>{t('endDate')}:</strong> {new Date(project.end_date).toLocaleDateString()}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
} 