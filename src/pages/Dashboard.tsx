import React, { useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  List,
  Button,
  Space,
  Typography,
  Spin,
  Alert
} from 'antd';
import {
  UserOutlined,
  ProjectOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  EyeOutlined,
  BarChartOutlined,
  PieChartOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/store';
import { fetchDashboardData, fetchRecentActivities, clearError } from '../features/dashboard/dashboardSlice';
import HeaderBar from '../components/HeaderBar';
import Sidebar from '../components/Sidebar';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title } = Typography;

// Simple Chart Component
const SimpleChart = ({ data }: any) => {
  const { labels = [], datasets = [] } = data;
  
  return (
    <div style={{ height: 200 }}>
      <div style={{ display: 'flex', alignItems: 'end', height: 150, gap: 8 }}>
        {labels.map((label: string, index: number) => {
          const value = datasets[0]?.data[index] || 0;
          const maxValue = Math.max(...(datasets[0]?.data || [1]));
          const height = (value / maxValue) * 100;
          const color = datasets[0]?.backgroundColor?.[index] || '#1890ff';
          
          return (
            <div key={index} style={{ flex: 1, textAlign: 'center' }}>
              <div
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '20px',
                  borderRadius: '4px 4px 0 0'
                }}
              />
              <div style={{ fontSize: '12px', marginTop: '8px' }}>{label}</div>
              <div style={{ fontSize: '10px', color: '#666' }}>{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { dashboardData, recentActivities, loading, error } = useAppSelector(state => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
    dispatch(fetchRecentActivities(10));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message={t('dashboard.error')} type="error" showIcon />
      </div>
    );
  }

  const overview = dashboardData?.overview || {} as any;
  const attendance = dashboardData?.attendance || {} as any;
  const employees = dashboardData?.employees || {} as any;
  const projects = dashboardData?.projects || {} as any;
  const finance = dashboardData?.finance || {} as any;
  const charts = dashboardData?.charts || {} as any;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', flex: 1 }}>
          <Title level={2} style={{ marginBottom: '24px' }}>
            {t('dashboard.title')}
          </Title>

          {/* Overview Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.totalEmployees')}
                  value={overview.total_employees || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.activeProjects')}
                  value={overview.active_projects || 0}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.totalExpenses')}
                  value={overview.total_expenses || 0}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                  formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={t('dashboard.totalPayroll')}
                  value={overview.total_payroll || 0}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                  formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
                />
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <BarChartOutlined />
                    {t('dashboard.attendanceTrend')}
                  </Space>
                }
              >
                <SimpleChart 
                  data={charts.attendance_trend || {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                    datasets: [{
                      label: 'Present',
                      data: [22, 24, 23, 25, 22],
                      backgroundColor: ['#52c41a', '#52c41a', '#52c41a', '#52c41a', '#52c41a']
                    }]
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <PieChartOutlined />
                    {t('dashboard.departmentStats')}
                  </Space>
                }
              >
                <SimpleChart 
                  data={charts.department_stats || {
                    labels: ['IT', 'HR', 'Finance', 'Marketing', 'Sales'],
                    datasets: [{
                      label: 'Employees',
                      data: [8, 3, 4, 5, 5],
                      backgroundColor: ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1']
                    }]
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* More Charts Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <PieChartOutlined />
                    {t('dashboard.expenseByCategory')}
                  </Space>
                }
              >
                <SimpleChart 
                  data={charts.expense_by_category || {
                    labels: ['Travel', 'Office', 'Marketing', 'Training'],
                    datasets: [{
                      label: 'Expenses',
                      data: [5000000, 3000000, 4000000, 3000000],
                      backgroundColor: ['#1890ff', '#52c41a', '#faad14', '#ff4d4f']
                    }]
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={
                  <Space>
                    <BarChartOutlined />
                    {t('dashboard.projectProgress')}
                  </Space>
                }
              >
                <SimpleChart 
                  data={charts.project_progress || {
                    labels: ['Active', 'Completed', 'Overdue'],
                    datasets: [{
                      label: 'Projects',
                      data: [8, 3, 1],
                      backgroundColor: ['#52c41a', '#faad14', '#ff4d4f']
                    }]
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* Attendance Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title={t('dashboard.todayAttendance')}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Present"
                      value={attendance.today?.present || 0}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Absent"
                      value={attendance.today?.absent || 0}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Late"
                      value={attendance.today?.late || 0}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Col>
                </Row>
                <Progress 
                  percent={attendance.today?.total ? Math.round((attendance.today.present / attendance.today.total) * 100) : 0}
                  status="active"
                  style={{ marginTop: '16px' }}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title={t('dashboard.projectProgress')}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic
                      title="Active"
                      value={projects.active || 0}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Completed"
                      value={projects.completed || 0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Overdue"
                      value={projects.overdue || 0}
                      valueStyle={{ color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>
                <Progress 
                  percent={projects.completion_rate || 0}
                  status="active"
                  style={{ marginTop: '16px' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Employee Stats */}
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} lg={12}>
              <Card title={t('dashboard.employeeStats')}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Total"
                      value={employees.total || 0}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={t('dashboard.newThisMonth')}
                      value={employees.new_this_month || 0}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title={t('dashboard.financeOverview')}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title={t('dashboard.monthlyExpenses')}
                      value={finance.monthly_expenses || 0}
                      valueStyle={{ color: '#faad14' }}
                      formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title={t('dashboard.monthlyPayroll')}
                      value={finance.monthly_payroll || 0}
                      valueStyle={{ color: '#722ed1' }}
                      formatter={(value) => `$${(Number(value) / 1000000).toFixed(1)}M`}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities and Quick Actions */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Card 
                title={
                  <Space>
                    <ClockCircleOutlined />
                    {t('dashboard.recentActivities')}
                  </Space>
                }
              >
                <List
                  dataSource={recentActivities || []}
                  renderItem={(activity: any) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
                        title={activity.message || 'Activity'}
                        description={dayjs(activity.timestamp).fromNow()}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <Space>
                    <PlusOutlined />
                    {t('dashboard.quickActions')}
                  </Space>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" block icon={<UserOutlined />}>
                    {t('dashboard.addEmployee')}
                  </Button>
                  <Button block icon={<ProjectOutlined />}>
                    {t('dashboard.createProject')}
                  </Button>
                  <Button block icon={<DollarOutlined />}>
                    {t('dashboard.addExpense')}
                  </Button>
                  <Button block icon={<EyeOutlined />}>
                    {t('dashboard.viewAttendance')}
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
} 