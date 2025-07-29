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
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined
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

interface Leave {
  id: number;
  employee_id: number;
  employee: {
    full_name: string;
    employee_code: string;
    department: string;
    position: string;
  };
  leave_type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approved_at?: string;
  approver?: {
    name: string;
  };
}

export default function LeaveList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchLeaves();
    fetchStats();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/leaves');
      if (response.data.success) {
        setLeaves(response.data.data.leaves || []);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      message.error('Failed to load leaves');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/leaves/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddLeave = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      await axios.post('/leaves', values);
      message.success('Leave request submitted successfully');
      setModalVisible(false);
      fetchLeaves();
      fetchStats();
    } catch (error) {
      console.error('Error adding leave:', error);
      message.error('Failed to submit leave request');
    }
  };

  const handleApproveLeave = async (id: number) => {
    try {
      await axios.patch(`/leaves/${id}/approve`);
      message.success('Leave request approved');
      fetchLeaves();
      fetchStats();
    } catch (error) {
      console.error('Error approving leave:', error);
      message.error('Failed to approve leave request');
    }
  };

  const handleRejectLeave = async (id: number) => {
    try {
      await axios.patch(`/leaves/${id}/reject`);
      message.success('Leave request rejected');
      fetchLeaves();
      fetchStats();
    } catch (error) {
      console.error('Error rejecting leave:', error);
      message.error('Failed to reject leave request');
    }
  };

  const handleViewDetail = (leave: Leave) => {
    setSelectedLeave(leave);
    setDetailModalVisible(true);
  };

  const getLeaveTypeText = (type: string) => {
    switch (type) {
      case 'annual': return 'Nghỉ phép năm';
      case 'sick': return 'Nghỉ ốm';
      case 'personal': return 'Nghỉ cá nhân';
      case 'maternity': return 'Nghỉ thai sản';
      case 'paternity': return 'Nghỉ thai sản chồng';
      default: return type;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'blue';
      case 'sick': return 'red';
      case 'personal': return 'orange';
      case 'maternity': return 'purple';
      case 'paternity': return 'cyan';
      default: return 'default';
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getLeaveStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  // Filter leaves
  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = 
      leave.employee?.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      leave.employee?.employee_code?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || leave.status === statusFilter;
    const matchesType = typeFilter === 'all' || leave.leave_type === typeFilter;
    const matchesDepartment = departmentFilter === 'all' || leave.employee?.department === departmentFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange) {
      const startDate = dayjs(leave.start_date);
      const endDate = dayjs(leave.end_date);
      const filterStart = dayjs(dateRange[0]);
      const filterEnd = dayjs(dateRange[1]);
      matchesDateRange = (startDate.isAfter(filterStart) && startDate.isBefore(filterEnd)) ||
                        (endDate.isAfter(filterStart) && endDate.isBefore(filterEnd));
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDepartment && matchesDateRange;
  });

  const columns = [
    {
      title: 'Nhân viên',
      key: 'employee',
      render: (record: Leave) => (
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
      title: 'Loại nghỉ',
      dataIndex: 'leave_type',
      key: 'leave_type',
      render: (type: string) => (
        <Tag color={getLeaveTypeColor(type)}>{getLeaveTypeText(type)}</Tag>
      ),
    },
    {
      title: 'Từ ngày',
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Đến ngày',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Số ngày',
      dataIndex: 'days',
      key: 'days',
      render: (days: number) => `${days} ngày`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'approved' ? 'success' : status === 'pending' ? 'processing' : 'error'} 
          text={getLeaveStatusText(status)} 
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
      title: 'Thao tác',
      key: 'actions',
      render: (record: Leave) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Duyệt">
                <Popconfirm
                  title="Bạn có chắc muốn duyệt đơn nghỉ phép này?"
                  onConfirm={() => handleApproveLeave(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    type="link" 
                    style={{ color: '#52c41a' }}
                    icon={<CheckCircleOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Từ chối">
                <Popconfirm
                  title="Bạn có chắc muốn từ chối đơn nghỉ phép này?"
                  onConfirm={() => handleRejectLeave(record.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button 
                    type="link" 
                    danger
                    icon={<CloseCircleOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
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
                <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <ArrowLeftOutlined /> Dashboard
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý nghỉ phép</Breadcrumb.Item>
            </Breadcrumb>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tổng đơn nghỉ phép"
                    value={stats.total}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Chờ duyệt"
                    value={stats.pending}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đã duyệt"
                    value={stats.approved}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Từ chối"
                    value={stats.rejected}
                    prefix={<CloseCircleOutlined />}
                    valueStyle={{ color: '#ff4d4f' }}
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
                  <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Danh sách đơn nghỉ phép</h1>
                  <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    {filteredLeaves.length} đơn
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
                    onClick={handleAddLeave}
                  >
                    Tạo đơn nghỉ phép
                  </Button>
                </Space>
              </div>

              {/* Filters */}
              <div style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                  <Col span={5}>
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
                      <Select.Option value="pending">Chờ duyệt</Select.Option>
                      <Select.Option value="approved">Đã duyệt</Select.Option>
                      <Select.Option value="rejected">Từ chối</Select.Option>
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Loại nghỉ"
                      value={typeFilter}
                      onChange={setTypeFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả loại</Select.Option>
                      <Select.Option value="annual">Nghỉ phép năm</Select.Option>
                      <Select.Option value="sick">Nghỉ ốm</Select.Option>
                      <Select.Option value="personal">Nghỉ cá nhân</Select.Option>
                      <Select.Option value="maternity">Nghỉ thai sản</Select.Option>
                      <Select.Option value="paternity">Nghỉ thai sản chồng</Select.Option>
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
                  <Col span={5}>
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
                  <Col span={2}>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setSearchText('');
                        setStatusFilter('all');
                        setTypeFilter('all');
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
                dataSource={filteredLeaves}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đơn`,
                }}
                locale={{
                  emptyText: 'Không có đơn nghỉ phép nào',
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Add Leave Modal */}
      <Modal
        title="Tạo đơn nghỉ phép"
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
            name="leave_type"
            label="Loại nghỉ"
            rules={[{ required: true, message: 'Vui lòng chọn loại nghỉ' }]}
          >
            <Select placeholder="Chọn loại nghỉ">
              <Select.Option value="annual">Nghỉ phép năm</Select.Option>
              <Select.Option value="sick">Nghỉ ốm</Select.Option>
              <Select.Option value="personal">Nghỉ cá nhân</Select.Option>
              <Select.Option value="maternity">Nghỉ thai sản</Select.Option>
              <Select.Option value="paternity">Nghỉ thai sản chồng</Select.Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="start_date"
                label="Từ ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="end_date"
                label="Đến ngày"
                rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập lý do nghỉ phép" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo đơn
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Leave Detail Modal */}
      <Modal
        title="Chi tiết đơn nghỉ phép"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedLeave && (
          <div>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Nhân viên:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <UserAvatar userId={selectedLeave.employee_id} size={32} showName={false} />
                  <span>{selectedLeave.employee?.full_name}</span>
                </div>
              </Col>
              <Col span={12}>
                <strong>Mã nhân viên:</strong>
                <div>{selectedLeave.employee?.employee_code}</div>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Loại nghỉ:</strong>
                <div>
                  <Tag color={getLeaveTypeColor(selectedLeave.leave_type)}>
                    {getLeaveTypeText(selectedLeave.leave_type)}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <strong>Trạng thái:</strong>
                <div>
                  <Badge 
                    status={selectedLeave.status === 'approved' ? 'success' : selectedLeave.status === 'pending' ? 'processing' : 'error'} 
                    text={getLeaveStatusText(selectedLeave.status)} 
                  />
                </div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Từ ngày:</strong>
                <div>{dayjs(selectedLeave.start_date).format('DD/MM/YYYY')}</div>
              </Col>
              <Col span={12}>
                <strong>Đến ngày:</strong>
                <div>{dayjs(selectedLeave.end_date).format('DD/MM/YYYY')}</div>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <strong>Số ngày:</strong>
                <div>{selectedLeave.days} ngày</div>
              </Col>
              <Col span={12}>
                <strong>Phòng ban:</strong>
                <div>{selectedLeave.employee?.department}</div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <strong>Lý do:</strong>
              <div style={{ marginTop: 4, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                {selectedLeave.reason}
              </div>
            </div>

            {selectedLeave.approved_by && (
              <div style={{ marginBottom: 16 }}>
                <strong>Duyệt bởi:</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <UserAvatar userId={selectedLeave.approved_by} size={24} showName={false} />
                  <span>{selectedLeave.approver?.name}</span>
                </div>
              </div>
            )}

            {selectedLeave.approved_at && (
              <div>
                <strong>Ngày duyệt:</strong>
                <div>{dayjs(selectedLeave.approved_at).format('DD/MM/YYYY HH:mm')}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
} 