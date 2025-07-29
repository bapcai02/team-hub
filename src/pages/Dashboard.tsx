import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  List, 
  Avatar, 
  Tag, 
  Button, 
  Space,
  Calendar,
  Badge,
  Divider,
  Typography,
  Select
} from 'antd';
import {
  TeamOutlined,
  ProjectOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DollarOutlined,
  TrophyOutlined,
  CalendarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
import UserAvatar from '../components/UserAvatar';
import axios from '../services/axios';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface DashboardStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    overdue: number;
  };
  employees: {
    total: number;
    active: number;
    inactive: number;
    new_this_month: number;
  };
  attendance: {
    present_today: number;
    absent_today: number;
    late_today: number;
    attendance_rate: number;
  };
  leaves: {
    pending: number;
    approved: number;
    rejected: number;
    total_this_month: number;
  };
}

interface RecentActivity {
  id: number;
  type: 'project' | 'employee' | 'attendance' | 'leave';
  title: string;
  description: string;
  user_id: number;
  created_at: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    projects: { total: 0, active: 0, completed: 0, overdue: 0 },
    employees: { total: 0, active: 0, inactive: 0, new_this_month: 0 },
    attendance: { present_today: 0, absent_today: 0, late_today: 0, attendance_rate: 0 },
    leaves: { pending: 0, approved: 0, rejected: 0, total_this_month: 0 }
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/dashboard');
      if (response.data.success) {
        setStats(response.data.data.stats);
        setRecentActivities(response.data.data.recent_activities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <ProjectOutlined />;
      case 'employee': return <UserOutlined />;
      case 'attendance': return <ClockCircleOutlined />;
      case 'leave': return <FileTextOutlined />;
      default: return <UserOutlined />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return '#1890ff';
      case 'employee': return '#52c41a';
      case 'attendance': return '#faad14';
      case 'leave': return '#722ed1';
      default: return '#666';
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px' }}>
            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                Dashboard
              </Title>
              <Text type="secondary">
                Chào mừng trở lại! Đây là tổng quan về hoạt động của công ty.
              </Text>
            </div>

            {/* Main Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Dự án đang thực hiện"
                    value={stats.projects.active}
                    prefix={<ProjectOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                    suffix={`/ ${stats.projects.total}`}
                  />
                  <Progress 
                    percent={stats.projects.total > 0 ? Math.round((stats.projects.active / stats.projects.total) * 100) : 0} 
                    size="small" 
                    style={{ marginTop: 8 }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Nhân viên đang làm việc"
                    value={stats.employees.active}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    suffix={`/ ${stats.employees.total}`}
                  />
                  <Progress 
                    percent={stats.employees.total > 0 ? Math.round((stats.employees.active / stats.employees.total) * 100) : 0} 
                    size="small" 
                    style={{ marginTop: 8 }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Chấm công hôm nay"
                    value={stats.attendance.present_today}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                    suffix={`/ ${stats.attendance.present_today + stats.attendance.absent_today}`}
                  />
                  <Progress 
                    percent={stats.attendance.attendance_rate} 
                    size="small" 
                    style={{ marginTop: 8 }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đơn nghỉ phép chờ duyệt"
                    value={stats.leaves.pending}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                  <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                    {stats.leaves.approved} đã duyệt • {stats.leaves.rejected} từ chối
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Detailed Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              {/* Projects Section */}
              <Col span={12}>
                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Dự án</span>
                      <Button 
                        type="link" 
                        onClick={() => navigate('/projects')}
                        icon={<EyeOutlined />}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Hoàn thành"
                        value={stats.projects.completed}
                        valueStyle={{ color: '#52c41a' }}
                        prefix={<ArrowUpOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Quá hạn"
                        value={stats.projects.overdue}
                        valueStyle={{ color: '#ff4d4f' }}
                        prefix={<ArrowDownOutlined />}
                      />
                    </Col>
                  </Row>
                  <Divider />
                  <div style={{ textAlign: 'center' }}>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => navigate('/projects')}
                    >
                      Tạo dự án mới
                    </Button>
                  </div>
                </Card>
              </Col>

              {/* HRM Section */}
              <Col span={12}>
                <Card 
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Nhân sự</span>
                      <Button 
                        type="link" 
                        onClick={() => navigate('/employees')}
                        icon={<EyeOutlined />}
                      >
                        Xem tất cả
                      </Button>
                    </div>
                  }
                  style={{ height: '100%' }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="Nhân viên mới tháng này"
                        value={stats.employees.new_this_month}
                        valueStyle={{ color: '#1890ff' }}
                        prefix={<UserOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Tỷ lệ có mặt"
                        value={stats.attendance.attendance_rate}
                        valueStyle={{ color: '#52c41a' }}
                        suffix="%"
                        prefix={<ClockCircleOutlined />}
                      />
                    </Col>
                  </Row>
                  <Divider />
                  <Space>
                    <Button 
                      type="primary" 
                      onClick={() => navigate('/employees')}
                    >
                      Quản lý nhân viên
                    </Button>
                    <Button 
                      onClick={() => navigate('/attendance')}
                    >
                      Chấm công
                    </Button>
                    <Button 
                      onClick={() => navigate('/leaves')}
                    >
                      Nghỉ phép
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Recent Activities & Calendar */}
            <Row gutter={[24, 24]}>
              <Col span={16}>
                <Card title="Hoạt động gần đây">
                  <List
                    dataSource={recentActivities}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar 
                              style={{ 
                                backgroundColor: getActivityColor(item.type),
                                color: '#fff'
                              }}
                              icon={getActivityIcon(item.type)}
                            />
                          }
                          title={item.title}
                          description={
                            <div>
                              <div>{item.description}</div>
                              <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                                {dayjs(item.created_at).format('DD/MM/YYYY HH:mm')}
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                    locale={{
                      emptyText: 'Không có hoạt động nào gần đây'
                    }}
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card title="Lịch làm việc">
                  <Calendar
                    fullscreen={false}
                    headerRender={({ value, onChange }) => {
                      const start = 0;
                      const current = value.month();
                      const end = 11;
                      const monthOptions = [];
                      for (let i = start; i < end; i++) {
                        monthOptions.push(
                          <Select.Option key={i} value={i}>
                            {dayjs().month(i).format('MMMM')}
                          </Select.Option>
                        );
                      }
                      return (
                        <div style={{ padding: '8px' }}>
                          <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            value={current}
                            style={{ width: 80 }}
                            onChange={(newMonth) => {
                              const now = value.clone().month(newMonth);
                              onChange(now);
                            }}
                          >
                            {monthOptions}
                          </Select>
                        </div>
                      );
                    }}
                    dateCellRender={(date) => {
                      // Mock data for calendar events
                      const day = date.date();
                      if (day === 15) {
                        return (
                          <div style={{ height: '100%', padding: '4px 8px' }}>
                            <Badge 
                              status="processing" 
                              text="Họp dự án" 
                              style={{ fontSize: '10px' }}
                            />
                          </div>
                        );
                      }
                      if (day === 20) {
                        return (
                          <div style={{ height: '100%', padding: '4px 8px' }}>
                            <Badge 
                              status="success" 
                              text="Deadline" 
                              style={{ fontSize: '10px' }}
                            />
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
