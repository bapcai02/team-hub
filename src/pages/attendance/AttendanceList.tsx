import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Badge, 
  Row, 
  Col, 
  Statistic, 
  DatePicker, 
  message, 
  Breadcrumb,
  Modal,
  Form,
  Tooltip,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { 
  fetchAttendances, 
  fetchAttendanceStats, 
  createAttendance, 
  updateAttendance, 
  deleteAttendance,
  searchAttendances,
  setFilters,
  clearFilters,
  clearError
} from '../../features/attendance/attendanceSlice';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import UserAvatar from '../../components/UserAvatar';
import dayjs from 'dayjs';
const { Search } = Input;
const { RangePicker } = DatePicker;

export default function AttendanceList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { attendances, stats, loading, error, filters } = useAppSelector(state => state.attendance);
  const attendancesArray = Array.isArray(attendances) ? attendances : [];
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAttendances(undefined));
    dispatch(fetchAttendanceStats());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value.trim()) {
      dispatch(searchAttendances(value));
    } else {
      dispatch(fetchAttendances(undefined));
    }
  };

  const handleAddAttendance = () => {
    setEditingAttendance(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditAttendance = (attendance: any) => {
    setEditingAttendance(attendance);
    form.setFieldsValue({
      employee_id: attendance.employee_id,
      date: dayjs(attendance.date),
      check_in_time: attendance.check_in_time ? dayjs(attendance.check_in_time) : null,
      check_out_time: attendance.check_out_time ? dayjs(attendance.check_out_time) : null,
      break_start_time: attendance.break_start_time ? dayjs(attendance.break_start_time) : null,
      break_end_time: attendance.break_end_time ? dayjs(attendance.break_end_time) : null,
      total_hours: attendance.total_hours,
      overtime_hours: attendance.overtime_hours,
      status: attendance.status,
      notes: attendance.notes,
      location: attendance.location,
      ip_address: attendance.ip_address,
    });
    setModalVisible(true);
  };

  const handleDeleteAttendance = async (id: number) => {
    try {
      await dispatch(deleteAttendance(id)).unwrap();
      message.success(t('attendance.deletedSuccessfully'));
      dispatch(fetchAttendanceStats());
    } catch (error: any) {
      message.error(error.message || t('attendance.failedToDelete'));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const attendanceData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        check_in_time: values.check_in_time?.format('YYYY-MM-DD HH:mm:ss'),
        check_out_time: values.check_out_time?.format('YYYY-MM-DD HH:mm:ss'),
        break_start_time: values.break_start_time?.format('YYYY-MM-DD HH:mm:ss'),
        break_end_time: values.break_end_time?.format('YYYY-MM-DD HH:mm:ss'),
      };

      if (editingAttendance) {
        await dispatch(updateAttendance({ id: editingAttendance.id, ...attendanceData })).unwrap();
        message.success(t('attendance.updatedSuccessfully'));
      } else {
        await dispatch(createAttendance(attendanceData)).unwrap();
        message.success(t('attendance.createdSuccessfully'));
      }
      
      setModalVisible(false);
      dispatch(fetchAttendanceStats());
    } catch (error: any) {
      message.error(error.message || t('attendance.failedToSave'));
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return t('attendance.present');
      case 'late': return t('attendance.late');
      case 'absent': return t('attendance.absent');
      case 'half_day': return t('attendance.halfDay');
      case 'leave': return t('attendance.leave');
      default: return status;
    }
  };

  // Filter attendances
  const filteredAttendances = attendancesArray.filter((attendance: any) => {
    const matchesSearch = 
      attendance.employee?.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      attendance.employee?.position?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attendance.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || attendance.employee?.department?.name === departmentFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange) {
      const attendanceDate = dayjs(attendance.date);
      const startDate = dayjs(dateRange[0]);
      const endDate = dayjs(dateRange[1]);
      matchesDateRange = attendanceDate.isAfter(startDate) && attendanceDate.isBefore(endDate);
    }
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesDateRange;
  });

  const columns = [
    {
      title: t('attendance.employee'),
      key: 'employee',
      render: (record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserAvatar userId={record.employee_id} size={40} showName={false} />
          <div>
            <div style={{ fontWeight: 600, color: '#222' }}>{record.employee?.user?.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.employee?.position}</div>
          </div>
        </div>
      ),
    },
    {
      title: t('attendance.date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: t('attendance.checkIn'),
      dataIndex: 'check_in_time',
      key: 'check_in_time',
      render: (time: string) => time ? dayjs(time).format('HH:mm') : 'N/A',
    },
    {
      title: t('attendance.checkOut'),
      dataIndex: 'check_out_time',
      key: 'check_out_time',
      render: (time: string) => time ? dayjs(time).format('HH:mm') : 'N/A',
    },
    {
      title: t('attendance.totalHours'),
      dataIndex: 'total_hours',
      key: 'total_hours',
      render: (hours: number) => `${hours || 0}h`,
    },
    {
      title: t('attendance.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'present' ? 'success' : status === 'late' ? 'warning' : 'error'} 
          text={getStatusText(status)} 
        />
      ),
    },
    {
      title: t('attendance.department'),
      dataIndex: ['employee', 'department', 'name'],
      key: 'department',
      render: (department: string) => (
        <Tag color="purple">{department}</Tag>
      ),
    },
    {
      title: t('attendance.notes'),
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || '-',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Tooltip title={t('common.view')}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/attendance/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={t('common.edit')}>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditAttendance(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Popconfirm
              title={t('attendance.deleteConfirm')}
              onConfirm={() => handleDeleteAttendance(record.id)}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px' }}>
            <Breadcrumb style={{ marginBottom: 24 }}>
              <Breadcrumb.Item>
                <ArrowLeftOutlined onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                {t('attendance.title')}
              </Breadcrumb.Item>
            </Breadcrumb>

            {/* Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('attendance.total')}
                    value={stats?.total || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('attendance.present')}
                    value={stats?.present || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('attendance.late')}
                    value={stats?.late || 0}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('attendance.absent')}
                    value={stats?.absent || 0}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Filters */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <Search
                    placeholder={t('attendance.searchPlaceholder')}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={handleSearch}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col span={4}>
                  <Select
                    placeholder={t('attendance.statusFilter')}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="all">{t('common.all')}</Select.Option>
                    <Select.Option value="present">{t('attendance.present')}</Select.Option>
                    <Select.Option value="late">{t('attendance.late')}</Select.Option>
                    <Select.Option value="absent">{t('attendance.absent')}</Select.Option>
                    <Select.Option value="half_day">{t('attendance.halfDay')}</Select.Option>
                    <Select.Option value="leave">{t('attendance.leave')}</Select.Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <Select
                    placeholder={t('attendance.departmentFilter')}
                    value={departmentFilter}
                    onChange={setDepartmentFilter}
                    style={{ width: '100%' }}
                  >
                    <Select.Option value="all">{t('common.all')}</Select.Option>
                    <Select.Option value="IT">IT</Select.Option>
                    <Select.Option value="HR">HR</Select.Option>
                    <Select.Option value="Finance">Finance</Select.Option>
                    <Select.Option value="Marketing">Marketing</Select.Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <RangePicker
                    onChange={(dates) => {
                      if (dates) {
                        setDateRange([dates[0]!.format('YYYY-MM-DD'), dates[1]!.format('YYYY-MM-DD')]);
                      } else {
                        setDateRange(null);
                      }
                    }}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col span={4} style={{ textAlign: 'right' }}>
                  <Space>
                    <Button 
                       icon={<ReloadOutlined />} 
                       onClick={() => {
                         dispatch(fetchAttendances(undefined));
                         dispatch(fetchAttendanceStats());
                       }}
                     >
                      {t('common.refresh')}
                    </Button>
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={handleAddAttendance}
                    >
                      {t('attendance.addAttendance')}
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Attendance Table */}
            <Card>
              <Table
                columns={columns}
                dataSource={filteredAttendances}
                rowKey="id"
                loading={loading}
                pagination={{
                  total: filteredAttendances.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} ${t('attendance.records')}`,
                }}
                locale={{
                  emptyText: t('attendance.noAttendances'),
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Attendance Modal */}
      <Modal
        title={editingAttendance ? t('attendance.editAttendance') : t('attendance.addAttendance')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="employee_id"
            label={t('attendance.employee')}
            rules={[{ required: true, message: t('attendance.employeeRequired') }]}
          >
            <Select placeholder={t('attendance.selectEmployee')}>
              <Select.Option value={1}>John Doe</Select.Option>
              <Select.Option value={2}>Jane Smith</Select.Option>
              <Select.Option value={3}>Mike Johnson</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label={t('attendance.date')}
            rules={[{ required: true, message: t('attendance.dateRequired') }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="check_in_time"
                label={t('attendance.checkIn')}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="check_out_time"
                label={t('attendance.checkOut')}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="break_start_time"
                label={t('attendance.breakStart')}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="break_end_time"
                label={t('attendance.breakEnd')}
              >
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="total_hours"
                label={t('attendance.totalHours')}
              >
                <Input type="number" step="0.5" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="overtime_hours"
                label={t('attendance.overtimeHours')}
              >
                <Input type="number" step="0.5" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label={t('attendance.status')}
            rules={[{ required: true, message: t('attendance.statusRequired') }]}
          >
            <Select>
              <Select.Option value="present">{t('attendance.present')}</Select.Option>
              <Select.Option value="late">{t('attendance.late')}</Select.Option>
              <Select.Option value="absent">{t('attendance.absent')}</Select.Option>
              <Select.Option value="half_day">{t('attendance.halfDay')}</Select.Option>
              <Select.Option value="leave">{t('attendance.leave')}</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label={t('attendance.notes')}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="location"
                label={t('attendance.location')}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ip_address"
                label={t('attendance.ipAddress')}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAttendance ? t('common.update') : t('common.create')}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 