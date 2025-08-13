import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Tabs, 
  Descriptions, 
  Tag, 
  Button, 
  Space, 
  Avatar, 
  Badge, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Calendar, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message, 
  Breadcrumb,
  Timeline,
  List,
  Progress,
  Divider,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TrophyOutlined,
  EditOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import UserAvatar from '../../components/UserAvatar';
import axios from '../../services/axios';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { TextArea } = Input;

interface Employee {
  id: number;
  user_id: number;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  department: {
    id: number;
    name: string;
  };
  status: 'active' | 'inactive' | 'terminated';
  hire_date: string;
  salary: number;
  manager_id?: number;
  avatar?: string;
  address?: string;
  emergency_contact?: string;
  user?: {
    name: string;
    email: string;
  };
}

interface Attendance {
  id: number;
  employee_id: number;
  check_in: string;
  check_out?: string;
  date: string;
  created_at: string;
  updated_at: string;
}

interface Leave {
  id: number;
  employee_id: number;
  leave_type: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity';
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: number;
  approved_at?: string;
}

interface Payroll {
  id: number;
  employee_id: number;
  month: string;
  year: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  total_salary: number;
  status: 'pending' | 'paid';
}

interface Performance {
  id: number;
  employee_id: number;
  evaluator_id: number;
  period: string;
  score: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
}

export default function EmployeeDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  
  // Data states
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [performances, setPerformances] = useState<Performance[]>([]);
  
  // Modal states
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [attendanceForm] = Form.useForm();
  const [leaveForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      fetchEmployee();
      fetchAttendances();
      fetchLeaves();
      fetchPayrolls();
      fetchPerformances();
    }
  }, [id]);

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/employees/${id}`);
      if (response.data.success) {
        setEmployee(response.data.data.employee);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      message.error('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendances = async () => {
    try {
      const response = await axios.get(`/employees/${id}/time-logs`);
      if (response.data.success) {
        const timeLogsData = response.data.data?.time_logs || response.data.data || [];
        setAttendances(Array.isArray(timeLogsData) ? timeLogsData : []);
      } else {
        setAttendances([]);
      }
    } catch (error) {
      console.error('Error fetching time logs:', error);
      setAttendances([]);
    }
  };

  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`/employees/${id}/leaves`);
      if (response.data.success) {
        const leavesData = response.data.data?.leaves || response.data.data || [];
        setLeaves(Array.isArray(leavesData) ? leavesData : []);
      } else {
        setLeaves([]);
      }
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setLeaves([]);
    }
  };

  const fetchPayrolls = async () => {
    try {
      const response = await axios.get(`/employees/${id}/payrolls`);
      if (response.data.success) {
        const payrollsData = response.data.data?.payrolls || response.data.data || [];
        setPayrolls(Array.isArray(payrollsData) ? payrollsData : []);
      } else {
        setPayrolls([]);
      }
    } catch (error) {
      setPayrolls([]);
    }
  };

  const fetchPerformances = async () => {
    try {
      const response = await axios.get(`/employees/${id}/evaluations`);
      if (response.data.success) {
        const evaluationsData = response.data.data?.evaluations || response.data.data || [];
        setPerformances(Array.isArray(evaluationsData) ? evaluationsData : []);
      } else {
        setPerformances([]);
      }
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      setPerformances([]);
    }
  };

  const handleEditEmployee = () => {
    if (employee) {
      form.setFieldsValue(employee);
      setEditModalVisible(true);
    }
  };

  const handleSubmitEdit = async (values: any) => {
    try {
      await axios.patch(`/employees/${id}`, values);
      message.success('Employee updated successfully');
      setEditModalVisible(false);
      fetchEmployee();
    } catch (error) {
      console.error('Error updating employee:', error);
      message.error('Failed to update employee');
    }
  };

  const handleAddAttendance = async (values: any) => {
    try {
      await axios.post(`/employees/${id}/time-logs`, {
        ...values,
        employee_id: id
      });
      message.success('Time log added successfully');
      setAttendanceModalVisible(false);
      attendanceForm.resetFields();
      fetchAttendances();
    } catch (error) {
      console.error('Error adding time log:', error);
      message.error('Failed to add time log');
    }
  };

  const handleAddLeave = async (values: any) => {
    try {
      await axios.post(`/employees/${id}/leaves`, {
        ...values,
        employee_id: id
      });
      message.success('Leave request submitted successfully');
      setLeaveModalVisible(false);
      leaveForm.resetFields();
      fetchLeaves();
    } catch (error) {
      console.error('Error adding leave:', error);
      message.error('Failed to submit leave request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'inactive': return 'orange';
      case 'terminated': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang làm việc';
      case 'inactive': return 'Tạm nghỉ';
      case 'terminated': return 'Đã nghỉ việc';
      default: return status;
    }
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

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const attendanceColumns = [
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
      render: (time: string) => time ? dayjs(time).format('HH:mm:ss') : 'N/A',
    },
    {
      title: 'Giờ ra',
      dataIndex: 'check_out',
      key: 'check_out',
      render: (time: string) => time ? dayjs(time).format('HH:mm:ss') : 'Chưa check out',
    },
    {
      title: 'Tổng thời gian',
      key: 'total_time',
      render: (record: Attendance) => {
        if (record.check_in && record.check_out) {
          const checkIn = dayjs(record.check_in);
          const checkOut = dayjs(record.check_out);
          const diff = checkOut.diff(checkIn, 'hour', true);
          return `${diff.toFixed(1)}h`;
        }
        return 'N/A';
      },
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record: Attendance) => {
        if (!record.check_in) return <Badge status="error" text="Vắng" />;
        if (!record.check_out) return <Badge status="processing" text="Đang làm việc" />;
        return <Badge status="success" text="Hoàn thành" />;
      },
    },
  ];

  const leaveColumns = [
    {
      title: 'Loại nghỉ',
      dataIndex: 'leave_type',
      key: 'leave_type',
      render: (type: string) => (
        <Tag color="blue">{getLeaveTypeText(type)}</Tag>
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
        <Tag color={getLeaveStatusColor(status)}>
          {status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
        </Tag>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => reason,
    },
  ];

  const payrollColumns = [
    {
      title: 'Tháng',
      dataIndex: 'month',
      key: 'month',
      render: (month: string, record: Payroll) => `${month}/${record.year}`,
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      render: (salary: number) => `${salary?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Phụ cấp',
      dataIndex: 'allowances',
      key: 'allowances',
      render: (allowances: number) => `${allowances?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'deductions',
      key: 'deductions',
      render: (deductions: number) => `${deductions?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Thưởng',
      dataIndex: 'bonus',
      key: 'bonus',
      render: (bonus: number) => `${bonus?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Tổng lương',
      dataIndex: 'total_salary',
      key: 'total_salary',
      render: (salary: number) => (
        <span style={{ fontWeight: 600, color: '#52c41a' }}>
          {salary?.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'paid' ? 'success' : 'processing'} 
          text={status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'} 
        />
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>Employee not found</div>
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
              <Breadcrumb.Item>
                <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <ArrowLeftOutlined /> Dashboard
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a onClick={() => navigate('/employees')} style={{ cursor: 'pointer' }}>
                  Quản lý nhân viên
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{employee.full_name}</Breadcrumb.Item>
            </Breadcrumb>

            {/* Employee Header */}
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <UserAvatar userId={employee.user_id} size={80} showName={false} />
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{employee.full_name}</h1>
                  <p style={{ margin: '8px 0', color: '#666', fontSize: 16 }}>
                    {employee?.position} • {employee?.department?.name}
                  </p>
                  <Space>
                    <Tag color={getStatusColor(employee.status)}>{getStatusText(employee.status)}</Tag>
                    <Tag color="blue">Mã: {employee.employee_code}</Tag>
                  </Space>
                </div>
                <Space>
                  <Button 
                    icon={<EditOutlined />}
                    onClick={handleEditEmployee}
                  >
                    Chỉnh sửa
                  </Button>
                  <Button 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/employees')}
                  >
                    Quay lại
                  </Button>
                </Space>
              </div>
            </Card>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Ngày làm việc"
                    value={Array.isArray(attendances) ? attendances.filter(a => a.check_in).length : 0}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Ngày nghỉ phép"
                    value={Array.isArray(leaves) ? leaves.filter(l => l.status === 'approved').length : 0}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Lương tháng này"
                    value={Array.isArray(payrolls) && payrolls.length > 0 ? payrolls[payrolls.length - 1]?.total_salary : 0}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#faad14' }}
                    suffix="VNĐ"
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đánh giá trung bình"
                    value={Array.isArray(performances) && performances.length > 0 ? performances[performances.length - 1]?.score : 0}
                    prefix={<TrophyOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                    suffix="/5"
                  />
                </Card>
              </Col>
            </Row>

            {/* Tabs */}
            <Card>
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Thông tin cá nhân" key="info">
                  <Descriptions bordered column={2}>
                    <Descriptions.Item label="Họ và tên" span={2}>
                      {employee.full_name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã nhân viên">
                      {employee.employee_code}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {employee.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">
                      {employee.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Vị trí">
                      {employee.position}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phòng ban">
                      {employee?.department?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày vào làm">
                      {dayjs(employee.hire_date).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lương cơ bản">
                      {employee.salary?.toLocaleString()} VNĐ
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Badge 
                        status={employee.status === 'active' ? 'success' : employee.status === 'inactive' ? 'warning' : 'error'} 
                        text={getStatusText(employee.status)} 
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ" span={2}>
                      {employee.address || 'Chưa cập nhật'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Liên hệ khẩn cấp" span={2}>
                      {employee.emergency_contact || 'Chưa cập nhật'}
                    </Descriptions.Item>
                  </Descriptions>
                </TabPane>

                <TabPane tab="Chấm công" key="attendance">
                  <div style={{ marginBottom: 16 }}>
                    <Button 
                      type="primary" 
                      onClick={() => setAttendanceModalVisible(true)}
                    >
                      Thêm chấm công
                    </Button>
                  </div>
                  <Table
                    columns={attendanceColumns}
                    dataSource={attendances}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>

                <TabPane tab="Nghỉ phép" key="leave">
                  <div style={{ marginBottom: 16 }}>
                    <Button 
                      type="primary" 
                      onClick={() => setLeaveModalVisible(true)}
                    >
                      Đăng ký nghỉ phép
                    </Button>
                  </div>
                  <Table
                    columns={leaveColumns}
                    dataSource={leaves}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>

                <TabPane tab="Lương thưởng" key="payroll">
                  <Table
                    columns={payrollColumns}
                    dataSource={payrolls}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>

                <TabPane tab="Đánh giá" key="performance">
                  <div style={{ marginBottom: 16 }}>
                    <h3>Đánh giá hiệu suất</h3>
                    {Array.isArray(performances) && performances.length > 0 && (
                      <Row gutter={16}>
                        <Col span={12}>
                          <Card>
                            <Statistic
                              title="Điểm đánh giá"
                              value={performances[performances.length - 1]?.score}
                              suffix="/5"
                            />
                          </Card>
                        </Col>
                        <Col span={12}>
                          <Card>
                            <Statistic
                              title="Kỳ đánh giá"
                              value={performances[performances.length - 1]?.period}
                            />
                          </Card>
                        </Col>
                      </Row>
                    )}
                    <Divider />
                    <h4>Lịch sử đánh giá</h4>
                    <List
                      dataSource={Array.isArray(performances) ? performances : []}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={`Đánh giá kỳ ${item.period}`}
                            description={
                              <div>
                                <p>Điểm đánh giá: {item.score}/5</p>
                                <p>Nhận xét: {item.feedback || 'Không có nhận xét'}</p>
                                <p>Đánh giá bởi: <UserAvatar userId={item.evaluator_id} size={20} showName={true} /></p>
                                <p>Ngày đánh giá: {dayjs(item.created_at).format('DD/MM/YYYY')}</p>
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Employee Modal */}
      <Modal
        title="Chỉnh sửa thông tin nhân viên"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitEdit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="full_name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employee_code"
                label="Mã nhân viên"
                rules={[{ required: true, message: 'Vui lòng nhập mã nhân viên' }]}
              >
                <Input placeholder="Nhập mã nhân viên" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Vị trí"
                rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
              >
                <Select placeholder="Chọn vị trí">
                  <Select.Option value="Developer">Developer</Select.Option>
                  <Select.Option value="Manager">Manager</Select.Option>
                  <Select.Option value="Designer">Designer</Select.Option>
                  <Select.Option value="Tester">Tester</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Phòng ban"
                rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
              >
                <Select placeholder="Chọn phòng ban">
                  <Select.Option value="IT">IT</Select.Option>
                  <Select.Option value="HR">HR</Select.Option>
                  <Select.Option value="Marketing">Marketing</Select.Option>
                  <Select.Option value="Sales">Sales</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hire_date"
                label="Ngày vào làm"
                rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="Lương cơ bản"
                rules={[{ required: true, message: 'Vui lòng nhập lương' }]}
              >
                <Input type="number" placeholder="Nhập lương" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value="active">Đang làm việc</Select.Option>
              <Select.Option value="inactive">Tạm nghỉ</Select.Option>
              <Select.Option value="terminated">Đã nghỉ việc</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <TextArea rows={3} placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item name="emergency_contact" label="Liên hệ khẩn cấp">
            <Input placeholder="Nhập thông tin liên hệ khẩn cấp" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setEditModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Attendance Modal */}
      <Modal
        title="Thêm chấm công"
        open={attendanceModalVisible}
        onCancel={() => setAttendanceModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={attendanceForm}
          layout="vertical"
          onFinish={handleAddAttendance}
        >
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
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="check_out"
                label="Giờ ra"
              >
                <Input type="datetime-local" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setAttendanceModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Add Leave Modal */}
      <Modal
        title="Đăng ký nghỉ phép"
        open={leaveModalVisible}
        onCancel={() => setLeaveModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={leaveForm}
          layout="vertical"
          onFinish={handleAddLeave}
        >
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
            <TextArea rows={4} placeholder="Nhập lý do nghỉ phép" />
          </Form.Item>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setLeaveModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Đăng ký
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 