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
  Tooltip
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
  Legend
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
  ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
    // Export functionality
    console.log('Exporting:', reportType);
  };

  const renderOverviewMetrics = () => {
    if (!analyticsData?.analytics?.overview) return null;

    const { overview } = analyticsData.analytics;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('analytics.total_employees')}
              value={overview.total_employees}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('analytics.active_projects')}
              value={overview.active_projects}
              prefix={<ProjectOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('analytics.total_revenue')}
              value={overview.total_expenses}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => `$${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={t('analytics.avg_attendance')}
              value={overview.attendance_rate}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  const renderEmployeeAnalytics = () => {
    if (!analyticsData?.analytics?.employee_analytics) return null;

    const { employee_analytics } = analyticsData.analytics;

    // Prepare data for charts
    const performanceData = Object.entries(employee_analytics.performance_distribution).map(([key, value]) => ({
      name: key,
      value: value
    }));

    const productivityData = employee_analytics.productivity_trends?.labels?.map((label: string, index: number) => ({
      name: label,
      productivity: employee_analytics.productivity_trends?.data?.[index] || 0
    })) || [];

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.performance_distribution')}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
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
          <Card title={t('analytics.productivity_trends')}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="productivity" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title={t('analytics.skill_gaps')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Title level={5}>{t('analytics.technical_skills')}</Title>
                {employee_analytics.skill_gaps.technical_skills.map((skill: string, index: number) => (
                  <Tag key={index} color="blue" style={{ margin: '4px' }}>
                    {skill}
                  </Tag>
                ))}
              </Col>
              <Col xs={24} md={8}>
                <Title level={5}>{t('analytics.soft_skills')}</Title>
                {employee_analytics.skill_gaps.soft_skills.map((skill: string, index: number) => (
                  <Tag key={index} color="green" style={{ margin: '4px' }}>
                    {skill}
                  </Tag>
                ))}
              </Col>
              <Col xs={24} md={8}>
                <Title level={5}>{t('analytics.certifications')}</Title>
                {employee_analytics.skill_gaps.certifications.map((cert: string, index: number) => (
                  <Tag key={index} color="purple" style={{ margin: '4px' }}>
                    {cert}
                  </Tag>
                ))}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderFinancialAnalytics = () => {
    if (!analyticsData?.analytics?.financial_analytics) return null;

    const { financial_analytics } = analyticsData.analytics;

    // Prepare data for charts
    const revenueData = financial_analytics.revenue_trends?.labels?.map((label: string, index: number) => ({
      name: label,
      revenue: financial_analytics.revenue_trends?.data?.[index] || 0
    })) || [];

    const expenseData = Object.entries(financial_analytics.expense_categories).map(([key, value]) => ({
      name: key,
      amount: value
    }));

    const cashFlowData = [
      { name: t('analytics.operating'), value: financial_analytics.cash_flow_analysis.operating_cash_flow },
      { name: t('analytics.investing'), value: financial_analytics.cash_flow_analysis.investing_cash_flow },
      { name: t('analytics.financing'), value: financial_analytics.cash_flow_analysis.financing_cash_flow }
    ];

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.revenue_trends')}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.expense_categories')}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
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
          <Card title={t('analytics.cash_flow_analysis')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.operating_cash_flow')}
                  value={financial_analytics.cash_flow_analysis.operating_cash_flow}
                  prefix="$"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.investing_cash_flow')}
                  value={financial_analytics.cash_flow_analysis.investing_cash_flow}
                  prefix="$"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.financing_cash_flow')}
                  value={financial_analytics.cash_flow_analysis.financing_cash_flow}
                  prefix="$"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderProjectAnalytics = () => {
    if (!analyticsData?.analytics?.project_analytics) return null;

    const { project_analytics } = analyticsData.analytics;

    // Prepare data for charts
    const statusData = Object.entries(project_analytics.project_status_distribution).map(([key, value]) => ({
      name: key,
      value: value
    }));

    const timelineData = [
      { name: t('analytics.on_time'), value: project_analytics.timeline_performance.on_time },
      { name: t('analytics.delayed'), value: project_analytics.timeline_performance.delayed },
      { name: t('analytics.ahead_of_schedule'), value: project_analytics.timeline_performance.ahead_of_schedule }
    ];

    const costVarianceData = [
      { name: t('analytics.under_budget'), value: project_analytics.cost_variance.under_budget },
      { name: t('analytics.on_budget'), value: project_analytics.cost_variance.on_budget },
      { name: t('analytics.over_budget'), value: project_analytics.cost_variance.over_budget }
    ];

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={t('analytics.project_status')}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('analytics.timeline_performance')}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('analytics.cost_variance')}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costVarianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="value" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title={t('analytics.resource_utilization')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.utilization_rate')}
                  value={project_analytics.resource_utilization.utilization_rate}
                  suffix="%"
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.overallocation')}
                  value={project_analytics.resource_utilization.overallocation}
                  suffix="%"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.underallocation')}
                  value={project_analytics.resource_utilization.underallocation}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderAttendanceAnalytics = () => {
    if (!analyticsData?.analytics?.attendance_analytics) return null;

    const { attendance_analytics } = analyticsData.analytics;

    // Prepare data for charts
    const attendanceData = attendance_analytics.attendance_trends?.labels?.map((label: string, index: number) => ({
      name: label,
      rate: attendance_analytics.attendance_trends?.data?.[index] || 0
    })) || [];

    const departmentData = Object.entries(attendance_analytics.department_comparison).map(([key, value]) => ({
      name: key,
      rate: value
    }));

    const patternData = [
      { name: t('analytics.early_arrivals'), value: attendance_analytics.attendance_patterns.early_arrivals },
      { name: t('analytics.on_time'), value: attendance_analytics.attendance_patterns.on_time },
      { name: t('analytics.late_arrivals'), value: attendance_analytics.attendance_patterns.late_arrivals }
    ];

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.attendance_trends')}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="rate" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.attendance_patterns')}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={patternData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patternData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.overtime_analysis')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.total_overtime_hours')}
                  value={attendance_analytics.overtime_analysis.total_overtime_hours}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.average_overtime_per_employee')}
                  value={attendance_analytics.overtime_analysis.average_overtime_per_employee}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Statistic
                  title={t('analytics.overtime_cost')}
                  value={attendance_analytics.overtime_analysis.overtime_cost}
                  prefix="$"
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderTrendAnalysis = () => {
    if (!analyticsData?.analytics?.trends) return null;

    const { trends } = analyticsData.analytics;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.employee_growth')}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends.employee_growth?.labels?.map((label: string, index: number) => ({
                name: label,
                growth: trends.employee_growth?.data?.[index] || 0
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Line type="monotone" dataKey="growth" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={t('analytics.revenue_growth')}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends.revenue_growth?.labels?.map((label: string, index: number) => ({
                name: label,
                revenue: trends.revenue_growth?.data?.[index] || 0
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24}>
          <Card title={t('analytics.project_completion')}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends.project_completion?.labels?.map((label: string, index: number) => ({
                name: label,
                completed: trends.project_completion?.data?.[index] || 0
              })) || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="completed" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderKPIMetrics = () => {
    if (!analyticsData?.analytics?.kpis) return null;

    const { kpis } = analyticsData.analytics;

    return (
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title={t('analytics.financial_kpis')}>
            <Statistic
              title={t('analytics.roi')}
              value={kpis.financial_kpis?.revenue_growth}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
            <Divider />
            <Statistic
              title={t('analytics.profit_margin')}
              value={kpis.financial_kpis?.profit_margin}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
            <Divider />
            <Statistic
              title={t('analytics.cash_flow_ratio')}
              value={kpis.financial_kpis?.cash_flow_ratio}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('analytics.operational_kpis')}>
            <Statistic
              title={t('analytics.project_success_rate')}
              value={kpis.operational_kpis?.productivity_index}
              suffix="%"
              valueStyle={{ color: '#52c41a' }}
            />
            <Divider />
            <Statistic
              title={t('analytics.customer_satisfaction')}
              value={kpis.operational_kpis?.quality_score}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
            <Divider />
            <Statistic
              title={t('analytics.productivity_index')}
              value={kpis.operational_kpis?.productivity_index}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title={t('analytics.employee_kpis')}>
            <Statistic
              title={t('analytics.employee_retention_rate')}
              value={kpis.employee_kpis?.employee_satisfaction}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
            <Divider />
            <Statistic
              title={t('analytics.training_completion_rate')}
              value={kpis.employee_kpis?.training_completion}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
            <Divider />
            <Statistic
              title={t('analytics.employee_satisfaction')}
              value={kpis.employee_kpis?.employee_satisfaction}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '16px' }}>{t('common.loading')}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Title level={2}>
            <RiseOutlined style={{ marginRight: '8px' }} />
            {t('analytics.title')}
          </Title>
          
          <Space style={{ marginBottom: '16px' }}>
            <Select
              value={period}
              onChange={setPeriod}
              style={{ width: 120 }}
              options={[
                { label: t('analytics.period.week'), value: 'week' },
                { label: t('analytics.period.month'), value: 'month' },
                { label: t('analytics.period.quarter'), value: 'quarter' },
                { label: t('analytics.period.year'), value: 'year' }
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
            >
              {t('common.refresh')}
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExport('comprehensive')}
            >
              {t('analytics.export_report')}
            </Button>
          </Space>
        </div>

        {error && (
          <Alert
            message={t('common.error')}
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab={t('analytics.overview')} key="overview">
            {renderOverviewMetrics()}
            {renderKPIMetrics()}
          </TabPane>
          <TabPane tab={t('analytics.employee_analytics')} key="employee">
            {renderEmployeeAnalytics()}
          </TabPane>
          <TabPane tab={t('analytics.financial_analytics')} key="financial">
            {renderFinancialAnalytics()}
          </TabPane>
          <TabPane tab={t('analytics.project_analytics')} key="project">
            {renderProjectAnalytics()}
          </TabPane>
          <TabPane tab={t('analytics.attendance_analytics')} key="attendance">
            {renderAttendanceAnalytics()}
          </TabPane>
          <TabPane tab={t('analytics.trend_analysis')} key="trends">
            {renderTrendAnalysis()}
          </TabPane>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AnalyticsPage; 