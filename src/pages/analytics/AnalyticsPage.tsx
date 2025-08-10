import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  fetchAnalytics,
  fetchEmployeeAnalytics,
  fetchFinancialAnalytics,
  fetchProjectAnalytics,
  fetchAttendanceAnalytics,
  fetchKPIMetrics,
  setFilters,
  clearFilters
} from '../../features/analytics/analyticsSlice';
import MainLayout from '../../layouts/MainLayout';
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Button,
  Space,
  Tabs,
  Spin,
  Alert,
  Progress,
  Table,
  Tag,
  Typography,
  Divider,
  Tooltip,
  Badge,
  Avatar,
  List,
  Descriptions,
  Empty
} from 'antd';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import {
  UserOutlined,
  ProjectOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  FileTextOutlined,
  DownloadOutlined,
  FilterOutlined,
  ReloadOutlined,
  EyeOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  DashboardOutlined,
  TeamOutlined,
  BankOutlined,
  CalendarOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined as ClockIcon
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './AnalyticsPage.css';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    analyticsData,
    employeeAnalytics,
    financialAnalytics,
    projectAnalytics,
    attendanceAnalytics,
    kpiMetrics,
    loading,
    error,
    filters
  } = useAppSelector((state) => state.analytics);

  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadAnalytics();
  }, [period, dateRange]);

  const loadAnalytics = () => {
    const newFilters = {
      period,
      ...(dateRange && {
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD')
      })
    };

    dispatch(setFilters(newFilters));
    dispatch(fetchAnalytics(newFilters));
    dispatch(fetchEmployeeAnalytics(newFilters));
    dispatch(fetchFinancialAnalytics(newFilters));
    dispatch(fetchProjectAnalytics(newFilters));
    dispatch(fetchAttendanceAnalytics(newFilters));
    dispatch(fetchKPIMetrics(period));
  };

  const handleExport = (reportType: string) => {
    console.log('Exporting:', reportType);
  };

  const renderOverviewMetrics = () => {
    if (!analyticsData?.analytics?.overview) return null;

    const { overview } = analyticsData.analytics;

    return (
      <div className="analytics-overview">
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card employee-card" hoverable>
              <div className="metric-content">
                <div className="metric-icon">
                  <Avatar size={48} icon={<UserOutlined />} className="metric-avatar" />
                </div>
                <div className="metric-info">
                  <Statistic
                    title="Tổng nhân viên"
                    value={overview.total_employees}
                    valueStyle={{ color: '#6366F1', fontSize: '28px', fontWeight: 'bold' }}
                  />
                  <Text type="secondary" className="metric-trend">
                    <RiseOutlined /> +12% so với tháng trước
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card project-card" hoverable>
              <div className="metric-content">
                <div className="metric-icon">
                  <Avatar size={48} icon={<ProjectOutlined />} className="metric-avatar" />
                </div>
                <div className="metric-info">
                  <Statistic
                    title="Dự án đang hoạt động"
                    value={overview.active_projects}
                    valueStyle={{ color: '#10B981', fontSize: '28px', fontWeight: 'bold' }}
                  />
                  <Text type="secondary" className="metric-trend">
                    <CheckCircleOutlined /> 85% hoàn thành đúng hạn
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card revenue-card" hoverable>
              <div className="metric-content">
                <div className="metric-icon">
                  <Avatar size={48} icon={<DollarOutlined />} className="metric-avatar" />
                </div>
                <div className="metric-info">
                  <Statistic
                    title="Tổng doanh thu"
                    value={overview.total_expenses}
                    prefix="$"
                    valueStyle={{ color: '#F59E0B', fontSize: '28px', fontWeight: 'bold' }}
                    formatter={(value) => `${value?.toLocaleString()}`}
                  />
                  <Text type="secondary" className="metric-trend">
                    <RiseOutlined /> +8.5% so với tháng trước
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="metric-card attendance-card" hoverable>
              <div className="metric-content">
                <div className="metric-icon">
                  <Avatar size={48} icon={<ClockIcon />} className="metric-avatar" />
                </div>
                <div className="metric-info">
                  <Statistic
                    title="Tỷ lệ chuyên cần"
                    value={overview.attendance_rate}
                    suffix="%"
                    valueStyle={{ color: '#8B5CF6', fontSize: '28px', fontWeight: 'bold' }}
                  />
                  <Text type="secondary" className="metric-trend">
                    <ClockCircleOutlined /> Trung bình 95% tuần này
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderEmployeeAnalytics = () => {
    if (!analyticsData?.analytics?.employee_analytics) return null;

    const { employee_analytics } = analyticsData.analytics;

    const performanceData = Object.entries(employee_analytics.performance_distribution).map(([key, value]) => ({
      name: key,
      value: value
    }));

    const productivityData = employee_analytics.productivity_trends?.labels?.map((label: string, index: number) => ({
      name: label,
      productivity: employee_analytics.productivity_trends?.data?.[index] || 0
    })) || [];

    return (
      <div className="analytics-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="card-title">
                  <PieChartOutlined className="card-icon" />
                  <span>Phân bố hiệu suất nhân viên</span>
                </div>
              }
              className="chart-card"
              extra={
                <Tooltip title="Xem chi tiết">
                  <Button type="text" icon={<EyeOutlined />} />
                </Tooltip>
              }
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="card-title">
                  <LineChartOutlined className="card-icon" />
                  <span>Xu hướng năng suất</span>
                </div>
              }
              className="chart-card"
              extra={
                <Tooltip title="Xem chi tiết">
                  <Button type="text" icon={<EyeOutlined />} />
                </Tooltip>
              }
            >
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="productivity" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24}>
            <Card 
              title={
                <div className="card-title">
                  <TeamOutlined className="card-icon" />
                  <span>Phân tích kỹ năng</span>
                </div>
              }
              className="skills-card"
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <div className="skill-category">
                    <Title level={5} className="skill-title">
                      <CheckCircleOutlined style={{ color: '#10B981', marginRight: 8 }} />
                      Kỹ năng kỹ thuật
                    </Title>
                    <div className="skill-tags">
                      {employee_analytics.skill_gaps.technical_skills.map((skill: string, index: number) => (
                        <Tag key={index} color="blue" className="skill-tag">
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="skill-category">
                    <Title level={5} className="skill-title">
                      <UserOutlined style={{ color: '#6366F1', marginRight: 8 }} />
                      Kỹ năng mềm
                    </Title>
                    <div className="skill-tags">
                      {employee_analytics.skill_gaps.soft_skills.map((skill: string, index: number) => (
                        <Tag key={index} color="green" className="skill-tag">
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="skill-category">
                    <Title level={5} className="skill-title">
                      <TrophyOutlined style={{ color: '#F59E0B', marginRight: 8 }} />
                      Chứng chỉ
                    </Title>
                    <div className="skill-tags">
                      {employee_analytics.skill_gaps.certifications.map((cert: string, index: number) => (
                        <Tag key={index} color="purple" className="skill-tag">
                          {cert}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderFinancialAnalytics = () => {
    if (!analyticsData?.analytics?.financial_analytics) return null;

    const { financial_analytics } = analyticsData.analytics;

    const revenueData = financial_analytics.revenue_trends?.labels?.map((label: string, index: number) => ({
      name: label,
      revenue: financial_analytics.revenue_trends?.data?.[index] || 0
    })) || [];

    const expenseData = Object.entries(financial_analytics.expense_categories).map(([key, value]) => ({
      name: key,
      amount: value
    }));

    return (
      <div className="analytics-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="card-title">
                  <AreaChart className="card-icon" />
                  <span>Xu hướng doanh thu</span>
                </div>
              }
              className="chart-card"
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    fill="#10B981" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card 
              title={
                <div className="card-title">
                  <PieChartOutlined className="card-icon" />
                  <span>Phân loại chi phí</span>
                </div>
              }
              className="chart-card"
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24}>
            <Card 
              title={
                <div className="card-title">
                  <BankOutlined className="card-icon" />
                  <span>Phân tích dòng tiền</span>
                </div>
              }
              className="cashflow-card"
            >
              <Row gutter={[24, 16]}>
                <Col xs={24} md={8}>
                  <div className="cashflow-item positive">
                    <Statistic
                      title="Dòng tiền hoạt động"
                      value={financial_analytics.cash_flow_analysis.operating_cash_flow}
                      prefix="$"
                      valueStyle={{ color: '#10B981', fontSize: '24px', fontWeight: 'bold' }}
                    />
                    <Progress 
                      percent={85} 
                      strokeColor="#10B981" 
                      showInfo={false}
                      className="cashflow-progress"
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="cashflow-item negative">
                    <Statistic
                      title="Dòng tiền đầu tư"
                      value={financial_analytics.cash_flow_analysis.investing_cash_flow}
                      prefix="$"
                      valueStyle={{ color: '#EF4444', fontSize: '24px', fontWeight: 'bold' }}
                    />
                    <Progress 
                      percent={65} 
                      strokeColor="#EF4444" 
                      showInfo={false}
                      className="cashflow-progress"
                    />
                  </div>
                </Col>
                <Col xs={24} md={8}>
                  <div className="cashflow-item neutral">
                    <Statistic
                      title="Dòng tiền tài chính"
                      value={financial_analytics.cash_flow_analysis.financing_cash_flow}
                      prefix="$"
                      valueStyle={{ color: '#6366F1', fontSize: '24px', fontWeight: 'bold' }}
                    />
                    <Progress 
                      percent={45} 
                      strokeColor="#6366F1" 
                      showInfo={false}
                      className="cashflow-progress"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <Spin size="large" />
          <div className="loading-text">Đang tải dữ liệu phân tích...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="analytics-page">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-title-section">
            <Title level={2} className="page-title">
              <DashboardOutlined className="title-icon" />
              Phân tích & Báo cáo
            </Title>
            <Paragraph className="page-subtitle">
              Theo dõi hiệu suất và xu hướng của tổ chức
            </Paragraph>
          </div>
          
          {/* Controls */}
          <div className="page-controls">
            <Space size="middle">
              <Select
                value={period}
                onChange={setPeriod}
                style={{ width: 120 }}
                options={[
                  { label: 'Tuần này', value: 'week' },
                  { label: 'Tháng này', value: 'month' },
                  { label: 'Quý này', value: 'quarter' },
                  { label: 'Năm nay', value: 'year' }
                ]}
              />
              <RangePicker
                value={dateRange}
                onChange={(dates) => {
                  if (dates && dates[0] && dates[1]) {
                    setDateRange([dates[0], dates[1]]);
                  } else {
                    setDateRange(null);
                  }
                }}
                style={{ width: 240 }}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={loadAnalytics}
                loading={loading}
                type="primary"
              >
                Làm mới
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => handleExport('comprehensive')}
              >
                Xuất báo cáo
              </Button>
            </Space>
          </div>
        </div>

        {error && (
          <Alert
            message="Lỗi"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {/* Content */}
        <div className="analytics-content">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: 'overview',
                label: (
                  <span>
                    <DashboardOutlined />
                    Tổng quan
                  </span>
                ),
                children: (
                  <div className="tab-content">
                    {renderOverviewMetrics()}
                    {renderEmployeeAnalytics()}
                  </div>
                )
              },
              {
                key: 'employee',
                label: (
                  <span>
                    <TeamOutlined />
                    Nhân viên
                  </span>
                ),
                children: (
                  <div className="tab-content">
                    {renderEmployeeAnalytics()}
                  </div>
                )
              },
              {
                key: 'financial',
                label: (
                  <span>
                    <BankOutlined />
                    Tài chính
                  </span>
                ),
                children: (
                  <div className="tab-content">
                    {renderFinancialAnalytics()}
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage; 