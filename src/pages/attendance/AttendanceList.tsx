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
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  ExportOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import UserAvatar from '../../components/UserAvatar';
import axios from '../../services/axios';
import dayjs from 'dayjs';

const { Search } = Input;
const { RangePicker } = DatePicker;

interface Attendance {
  id: number;
  employee_id: number;
  employee: {
    full_name: string;
    employee_code: string;
    department: string;
    position: string;
  };
  date: string;
  check_in: string;
  check_out: string;
  total_hours: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  note?: string;
}

export default function AttendanceList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    half_day: 0
  });

  useEffect(() => {
    fetchAttendances();
    fetchStats();
  }, []);

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/attendances');
      if (response.data.success) {
        setAttendances(response.data.data.attendances || []);
      }
    } catch (error) {
      console.error('Error fetching attendances:', error);
      message.error('Failed to load attendances');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/attendances/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddAttendance = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      await axios.post('/attendances', values);
      message.success('Attendance added successfully');
      setModalVisible(false);
      fetchAttendances();
      fetchStats();
    } catch (error) {
      console.error('Error adding attendance:', error);
      message.error('Failed to add attendance');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'green';
      case 'late': return 'orange';
      case 'absent': return 'red';
      case 'half_day': return 'blue';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Có mặt';
      case 'late': return 'Muộn';
      case 'absent': return 'Vắng';
      case 'half_day': return 'Nửa ngày';
      default: return status;
    }
  };

  // Filter attendances
  const filteredAttendances = attendances.filter(attendance => {
    const matchesSearch = 
      attendance.employee?.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      attendance.employee?.employee_code?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attendance.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || attendance.employee?.department === departmentFilter;
    
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
      title: 'Nhân viên',
      key: 'employee',
      render: (record: Attendance) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserAvatar userId={record.employee_id} size={40} showName={false} />
          <div>
            <div style={{ fontWeight: 600, color: '#222' }}>{record.employee?.full_name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.employee?.employee_code}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giờ vào',
      dataIndex: 'check_in',
      key: 'check_in',
      render: (time: string) => time || 'N/A',
    },
    {
      title: 'Giờ ra',
      dataIndex: 'check_out',
      key: 'check_out',
      render: (time: string) => time || 'N/A',
    },
    {
      title: 'Tổng giờ',
      dataIndex: 'total_hours',
      key: 'total_hours',
      render: (hours: number) => `${hours || 0}h`,
    },
    {
      title: 'Trạng thái',
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
      title: 'Phòng ban',
      dataIndex: ['employee', 'department'],
      key: 'department',
      render: (department: string) => (
        <Tag color="purple">{department}</Tag>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (note: string) => note || '-',
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
                <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <ArrowLeftOutlined /> Dashboard
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý chấm công</Breadcrumb.Item>
            </Breadcrumb>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={4}>
                <Card>
                  <Statistic
                    title="Tổng chấm công"
                    value={stats.total}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic
                    title="Có mặt"
                    value={stats.present}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic
                    title="Muộn"
                    value={stats.late}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic
                    title="Vắng"
                    value={stats.absent}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic
                    title="Nửa ngày"
                    value={stats.half_day}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
              <Col span={4}>
                <Card>
                  <Statistic
                    title="Tỷ lệ có mặt"
                    value={stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    suffix="%"
                  />
                </Card>
              </Col>
            </Row>

            <Card
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px #0001',
                border: 'none',
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Danh sách chấm công</h1>
                  <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    {filteredAttendances.length} bản ghi
                  </p>
                </div>
                <Space>
                  <Button 
                    icon={<ExportOutlined />}
                  >
                    Xuất báo cáo
                  </Button>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleAddAttendance}
                  >
                    Thêm chấm công
                  </Button>
                </Space>
              </div>

              {/* Filters */}
              <div style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                  <Col span={6}>
                    <Search
                      placeholder="Tìm kiếm nhân viên..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Trạng thái"
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả trạng thái</Select.Option>
                      <Select.Option value="present">Có mặt</Select.Option>
                      <Select.Option value="late">Muộn</Select.Option>
                      <Select.Option value="absent">Vắng</Select.Option>
                      <Select.Option value="half_day">Nửa ngày</Select.Option>
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Phòng ban"
                      value={departmentFilter}
                      onChange={setDepartmentFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả phòng ban</Select.Option>
                      <Select.Option value="IT">IT</Select.Option>
                      <Select.Option value="HR">HR</Select.Option>
                      <Select.Option value="Marketing">Marketing</Select.Option>
                      <Select.Option value="Sales">Sales</Select.Option>
                    </Select>
                  </Col>
                  <Col span={6}>
                    <RangePicker
                      placeholder={['Từ ngày', 'Đến ngày']}
                      onChange={(dates) => {
                        if (dates) {
                          setDateRange([dates[0]?.format('YYYY-MM-DD') || '', dates[1]?.format('YYYY-MM-DD') || '']);
                        } else {
                          setDateRange(null);
                        }
                      }}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  <Col span={4}>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setSearchText('');
                        setStatusFilter('all');
                        setDepartmentFilter('all');
                        setDateRange(null);
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Col>
                </Row>
              </div>

              <Table
                columns={columns}
                dataSource={filteredAttendances}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
                }}
                locale={{
                  emptyText: 'Không có dữ liệu chấm công',
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Add Attendance Modal */}
      <Modal
        title="Thêm chấm công"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="employee_id"
            label="Nhân viên"
            rules={[{ required: true, message: 'Vui lòng chọn nhân viên' }]}
          >
            <Select placeholder="Chọn nhân viên">
              {/* This would be populated with employee list */}
              <Select.Option value={1}>Nguyễn Văn A</Select.Option>
              <Select.Option value={2}>Trần Thị B</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày"
            rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
          >
            <Input type="date" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="check_in"
                label="Giờ vào"
                rules={[{ required: true, message: 'Vui lòng nhập giờ vào' }]}
              >
                <Input type="time" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="check_out"
                label="Giờ ra"
              >
                <Input type="time" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="present">Có mặt</Select.Option>
              <Select.Option value="late">Muộn</Select.Option>
              <Select.Option value="absent">Vắng</Select.Option>
              <Select.Option value="half_day">Nửa ngày</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 