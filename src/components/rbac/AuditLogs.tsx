import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Space,
  Typography,
  Tag,
  DatePicker,
  Select,
  Button,
  Input,
  Tooltip
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  UserOutlined,
  FileTextOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchAuditLogs } from '../../features/rbac/rbacSlice';
import { AuditLog } from '../../features/rbac/types';
import { format } from 'date-fns';

const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;

const AuditLogs: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { auditLogs, loading } = useAppSelector((state) => state.rbac);
  const [filters, setFilters] = useState({
    action: '',
    table: '',
    user_id: '',
    dateRange: null as any,
  });

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = () => {
    const params: any = {};
    if (filters.action) params.action = filters.action;
    if (filters.table) params.table = filters.table;
    if (filters.user_id) params.user_id = filters.user_id;
    if (filters.dateRange) {
      params.start_date = filters.dateRange[0].format('YYYY-MM-DD');
      params.end_date = filters.dateRange[1].format('YYYY-MM-DD');
    }
    dispatch(fetchAuditLogs(params));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    loadAuditLogs();
  };

  const handleReset = () => {
    setFilters({
      action: '',
      table: '',
      user_id: '',
      dateRange: null,
    });
    dispatch(fetchAuditLogs());
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <PlusOutlined style={{ color: '#52c41a' }} />;
      case 'update':
        return <EditOutlined style={{ color: '#1890ff' }} />;
      case 'delete':
        return <DeleteOutlined style={{ color: '#ff4d4f' }} />;
      case 'view':
        return <EyeOutlined style={{ color: '#722ed1' }} />;
      default:
        return <FileTextOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'success';
      case 'update':
        return 'processing';
      case 'delete':
        return 'error';
      case 'view':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: t('rbac.audit_logs.table.timestamp') || 'Timestamp',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        <Text type="secondary">
          {format(new Date(date), 'dd/MM/yyyy HH:mm:ss')}
        </Text>
      ),
      sorter: (a: AuditLog, b: AuditLog) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    },
    {
      title: t('rbac.audit_logs.table.user') || 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <Space>
          <UserOutlined style={{ color: '#4B48E5' }} />
          <Text>{user?.name || 'Unknown'}</Text>
        </Space>
      ),
    },
    {
      title: t('rbac.audit_logs.table.action') || 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => (
        <Space>
          {getActionIcon(action)}
          <Tag color={getActionColor(action)}>
            {action.toUpperCase()}
          </Tag>
        </Space>
      ),
      filters: [
        { text: 'Create', value: 'create' },
        { text: 'Update', value: 'update' },
        { text: 'Delete', value: 'delete' },
        { text: 'View', value: 'view' },
      ],
    },
    {
      title: t('rbac.audit_logs.table.target') || 'Target',
      dataIndex: 'target_table',
      key: 'target_table',
      render: (table: string, record: AuditLog) => (
        <Space direction="vertical" size="small">
          <Text strong style={{ textTransform: 'capitalize' }}>
            {table}
          </Text>
          <Text type="secondary">ID: {record.target_id}</Text>
        </Space>
      ),
    },
    {
      title: t('rbac.audit_logs.table.details') || 'Details',
      dataIndex: 'data',
      key: 'data',
      render: (data: any) => (
        <Tooltip title={JSON.stringify(data, null, 2)}>
          <Text type="secondary" style={{ cursor: 'pointer' }}>
            {data ? 'View Details' : '-'}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: t('rbac.audit_logs.table.ip') || 'IP Address',
      dataIndex: 'ip_address',
      key: 'ip_address',
      render: (ip: string) => (
        <Text type="secondary" code>
          {ip || '-'}
        </Text>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 16 }}>
          {t('rbac.audit_logs.title') || 'Audit Logs'}
        </Text>
        <br />
        <Text type="secondary">
          {t('rbac.audit_logs.description') || 'Track all system activities and security events'}
        </Text>
      </div>

      {/* Filters */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Select
            placeholder={t('rbac.audit_logs.filters.action') || 'Action'}
            style={{ width: 120 }}
            value={filters.action}
            onChange={(value) => handleFilterChange('action', value)}
            allowClear
          >
            <Option value="create">Create</Option>
            <Option value="update">Update</Option>
            <Option value="delete">Delete</Option>
            <Option value="view">View</Option>
          </Select>

          <Select
            placeholder={t('rbac.audit_logs.filters.table') || 'Table'}
            style={{ width: 150 }}
            value={filters.table}
            onChange={(value) => handleFilterChange('table', value)}
            allowClear
          >
            <Option value="users">Users</Option>
            <Option value="roles">Roles</Option>
            <Option value="permissions">Permissions</Option>
            <Option value="projects">Projects</Option>
            <Option value="tasks">Tasks</Option>
            <Option value="employees">Employees</Option>
          </Select>

          <RangePicker
            placeholder={[t('rbac.audit_logs.filters.start_date') || 'Start Date', t('rbac.audit_logs.filters.end_date') || 'End Date']}
            value={filters.dateRange}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
            style={{ width: 240 }}
          />

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            {t('common.search') || 'Search'}
          </Button>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            {t('common.reset') || 'Reset'}
          </Button>
        </Space>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={auditLogs}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} logs`,
        }}
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default AuditLogs; 