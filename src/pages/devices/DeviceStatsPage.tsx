import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, Row, Col, Statistic, Progress, Table, Tag, Space, Typography, Breadcrumb,
  Select, DatePicker, Button, Spin, Alert, Divider, List, Avatar,
} from 'antd';
import {
  LaptopOutlined, DesktopOutlined, TabletOutlined, MobileOutlined,
  PrinterOutlined, ScanOutlined, SettingOutlined, BarChartOutlined,
  CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined, StopOutlined,
  TeamOutlined, EnvironmentOutlined, CalendarOutlined, DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { fetchDeviceStats } from '../../features/devices/devicesSlice';
import { DeviceStats } from '../../features/devices/types';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const DeviceStatsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.devices);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchDeviceStats());
  }, [dispatch]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'green';
      case 'in_use': return 'blue';
      case 'maintenance': return 'orange';
      case 'retired': return 'red';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircleOutlined />;
      case 'in_use': return <TeamOutlined />;
      case 'maintenance': return <ExclamationCircleOutlined />;
      case 'retired': return <StopOutlined />;
      default: return <ClockCircleOutlined />;
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'laptop': return <LaptopOutlined style={{ color: '#1890ff' }} />;
      case 'desktop': return <DesktopOutlined style={{ color: '#52c41a' }} />;
      case 'tablet': return <TabletOutlined style={{ color: '#faad14' }} />;
      case 'phone': return <MobileOutlined style={{ color: '#722ed1' }} />;
      case 'printer': return <PrinterOutlined style={{ color: '#eb2f96' }} />;
      case 'scanner': return <ScanOutlined style={{ color: '#13c2c2' }} />;
      default: return <SettingOutlined style={{ color: '#666' }} />;
    }
  };

  const getDeviceTypeText = (type: string) => {
    switch (type) {
      case 'laptop': return 'Laptop';
      case 'desktop': return 'Desktop';
      case 'tablet': return 'Tablet';
      case 'phone': return 'Phone';
      case 'printer': return 'Printer';
      case 'scanner': return 'Scanner';
      default: return 'Other';
    }
  };

  const mockStats: DeviceStats = {
    total_devices: 156,
    available_devices: 89,
    in_use_devices: 45,
    maintenance_devices: 15,
    retired_devices: 7,
    utilization_rate: 57.1,
    maintenance_rate: 9.6,
    device_types: [
      { type: 'laptop', count: 67, percentage: 42.9 },
      { type: 'desktop', count: 34, percentage: 21.8 },
      { type: 'tablet', count: 23, percentage: 14.7 },
      { type: 'phone', count: 18, percentage: 11.5 },
      { type: 'printer', count: 8, percentage: 5.1 },
      { type: 'scanner', count: 4, percentage: 2.6 },
      { type: 'other', count: 2, percentage: 1.3 },
    ],
    departments: [
      { department: 'IT', count: 45, percentage: 28.8 },
      { department: 'Sales', count: 32, percentage: 20.5 },
      { department: 'Design', count: 28, percentage: 17.9 },
      { department: 'Marketing', count: 25, percentage: 16.0 },
      { department: 'HR', count: 18, percentage: 11.5 },
      { department: 'Finance', count: 8, percentage: 5.1 },
    ],
    recent_activities: [
      {
        id: 1,
        device_name: 'MacBook Pro 2023',
        action: 'assigned',
        user_name: 'John Doe',
        timestamp: '2024-01-15T10:30:00Z',
      },
      {
        id: 2,
        device_name: 'Dell XPS 15',
        action: 'maintenance',
        user_name: 'System',
        timestamp: '2024-01-14T15:45:00Z',
      },
      {
        id: 3,
        device_name: 'iPad Pro 12.9',
        action: 'unassigned',
        user_name: 'Jane Smith',
        timestamp: '2024-01-14T09:20:00Z',
      },
      {
        id: 4,
        device_name: 'HP LaserJet Pro',
        action: 'assigned',
        user_name: 'Mike Johnson',
        timestamp: '2024-01-13T14:15:00Z',
      },
      {
        id: 5,
        device_name: 'iPhone 14 Pro',
        action: 'maintenance',
        user_name: 'System',
        timestamp: '2024-01-13T11:30:00Z',
      },
    ],
    warranty_alerts: [
      {
        id: 1,
        device_name: 'MacBook Pro 2023',
        warranty_expiry: '2024-03-15',
        days_remaining: 59,
      },
      {
        id: 2,
        device_name: 'Dell XPS 15',
        warranty_expiry: '2024-04-20',
        days_remaining: 95,
      },
      {
        id: 3,
        device_name: 'iPad Pro 12.9',
        warranty_expiry: '2024-05-05',
        days_remaining: 110,
      },
    ],
  };

  const currentStats = stats || mockStats;

  const activityColumns = [
    {
      title: 'Device',
      key: 'device',
      render: (record: any) => (
        <Space>
          <Text strong>{record.device_name}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: any) => (
        <Tag color={record.action === 'assigned' ? 'green' : record.action === 'unassigned' ? 'orange' : 'red'}>
          {record.action === 'assigned' ? 'Assigned' : record.action === 'unassigned' ? 'Unassigned' : 'Maintenance'}
        </Tag>
      ),
    },
    {
      title: 'User',
      key: 'user',
      render: (record: any) => <Text>{record.user_name}</Text>,
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: any) => (
        <Text type="secondary">
          {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString()}
        </Text>
      ),
    },
  ];

  const warrantyColumns = [
    {
      title: 'Device',
      key: 'device',
      render: (record: any) => <Text strong>{record.device_name}</Text>,
    },
    {
      title: 'Warranty Expiry',
      key: 'expiry',
      render: (record: any) => <Text>{record.warranty_expiry}</Text>,
    },
    {
      title: 'Days Remaining',
      key: 'remaining',
      render: (record: any) => (
        <Tag color={record.days_remaining <= 30 ? 'red' : record.days_remaining <= 90 ? 'orange' : 'green'}>
          {record.days_remaining} days
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px' }}>
            <Breadcrumb style={{ marginBottom: 24 }}>
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Devices</Breadcrumb.Item>
              <Breadcrumb.Item>Statistics</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                <BarChartOutlined style={{ marginRight: 8 }} />
                Device Statistics
              </Title>
              <Text type="secondary">Comprehensive overview of device management and utilization</Text>
            </div>

            {/* Filters */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={8}>
                  <Text strong>Time Range:</Text>
                  <Select
                    value={timeRange}
                    onChange={setTimeRange}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    <Select.Option value="week">This Week</Select.Option>
                    <Select.Option value="month">This Month</Select.Option>
                    <Select.Option value="quarter">This Quarter</Select.Option>
                    <Select.Option value="year">This Year</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={8}>
                  <Text strong>Department:</Text>
                  <Select
                    value={departmentFilter}
                    onChange={setDepartmentFilter}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    <Select.Option value="all">All Departments</Select.Option>
                    <Select.Option value="IT">IT</Select.Option>
                    <Select.Option value="Sales">Sales</Select.Option>
                    <Select.Option value="Design">Design</Select.Option>
                    <Select.Option value="Marketing">Marketing</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={8}>
                  <Text strong>Custom Range:</Text>
                  <RangePicker style={{ width: '100%', marginTop: 8 }} />
                </Col>
              </Row>
            </Card>

            {/* Key Metrics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Total Devices"
                    value={currentStats.total_devices}
                    prefix={<LaptopOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Available"
                    value={currentStats.available_devices}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="In Use"
                    value={currentStats.in_use_devices}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card>
                  <Statistic
                    title="Maintenance"
                    value={currentStats.maintenance_devices}
                    prefix={<ExclamationCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Utilization and Status */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={12}>
                <Card title="Device Utilization" extra={<Text type="secondary">{currentStats.utilization_rate}%</Text>}>
                  <Progress
                    percent={currentStats.utilization_rate}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                    status="active"
                  />
                  <div style={{ marginTop: 16 }}>
                    <Row gutter={[16, 8]}>
                      <Col span={12}>
                        <Text type="secondary">Available: {currentStats.available_devices}</Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">In Use: {currentStats.in_use_devices}</Text>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Device Status Distribution">
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text>Available: {currentStats.available_devices}</Text>
                      <Text type="secondary">({((currentStats.available_devices / currentStats.total_devices) * 100).toFixed(1)}%)</Text>
                    </Space>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <TeamOutlined style={{ color: '#1890ff' }} />
                      <Text>In Use: {currentStats.in_use_devices}</Text>
                      <Text type="secondary">({((currentStats.in_use_devices / currentStats.total_devices) * 100).toFixed(1)}%)</Text>
                    </Space>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                      <Text>Maintenance: {currentStats.maintenance_devices}</Text>
                      <Text type="secondary">({((currentStats.maintenance_devices / currentStats.total_devices) * 100).toFixed(1)}%)</Text>
                    </Space>
                  </div>
                  <div>
                    <Space>
                      <StopOutlined style={{ color: '#ff4d4f' }} />
                      <Text>Retired: {currentStats.retired_devices}</Text>
                      <Text type="secondary">({((currentStats.retired_devices / currentStats.total_devices) * 100).toFixed(1)}%)</Text>
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Device Types and Departments */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} lg={12}>
                <Card title="Device Types">
                  <List
                    dataSource={currentStats.device_types}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={getDeviceTypeIcon(item.type)}
                          title={getDeviceTypeText(item.type)}
                          description={`${item.count} devices (${item.percentage}%)`}
                        />
                        <Progress percent={item.percentage} size="small" />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Department Distribution">
                  <List
                    dataSource={currentStats.departments}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                          title={item.department}
                          description={`${item.count} devices (${item.percentage}%)`}
                        />
                        <Progress percent={item.percentage} size="small" />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>

            {/* Recent Activities and Alerts */}
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Recent Activities" extra={<Button type="link">View All</Button>}>
                  <Table
                    columns={activityColumns}
                    dataSource={currentStats.recent_activities}
                    pagination={false}
                    size="small"
                    rowKey="id"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Warranty Alerts" extra={<Button type="link">View All</Button>}>
                  <Table
                    columns={warrantyColumns}
                    dataSource={currentStats.warranty_alerts}
                    pagination={false}
                    size="small"
                    rowKey="id"
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceStatsPage; 