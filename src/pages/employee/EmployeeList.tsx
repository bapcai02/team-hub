import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Avatar, 
  Modal, 
  Form, 
  message, 
  Popconfirm,
  Badge,
  Tooltip,
  Row,
  Col,
  Statistic,
  Breadcrumb
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  ArrowLeftOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import UserAvatar from '../../components/UserAvatar';
import axios from '../../services/axios';

const { Search } = Input;

interface Employee {
  id: number;
  user_id: number;
  department_id: number;
  position: string;
  salary: number;
  contract_type: string;
  hire_date: string;
  dob: string;
  gender: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    status: string;
  };
  department?: {
    id: number;
    name: string;
  };
  // Computed fields
  full_name?: string;
  email?: string;
  department_name?: string;
  status?: string;
}

export default function EmployeeList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form] = Form.useForm();

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0
  });

  // Filter options from API
  const [departments, setDepartments] = useState<Array<{id: number, name: string}>>([]);
  const [positions, setPositions] = useState<string[]>([]);

  useEffect(() => {
    fetchEmployees();
    fetchStats();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      fetchPositions();
    }
  }, [employees]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/departments');
      if (response.data.success) {
        const departmentsData = response.data.data?.data || response.data.data || [];
        setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
      } else {
        setDepartments([]);
      }
    } catch (error: any) {
      setDepartments([]);
    }
  };

  const fetchPositions = async () => {
    try {
      // Lấy unique positions từ employees data
      const allPositions = employees.map(emp => emp.position);
      const uniquePositions = allPositions.filter((position, index) => allPositions.indexOf(position) === index);
      setPositions(uniquePositions);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/employees');
      if (response.data.success) {
        // API trả về { data: { employees: { data: [...] } } }
        const employeesData = response.data.data.employees.data || [];
        setEmployees(employeesData);
      }
    } catch (error) {
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/employees/stats');
      if (response.data.success) {
        const statsData = response.data.data.stats || {
          total: 0,
          active: 0,
          inactive: 0,
          suspended: 0
        };
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    form.setFieldsValue(employee);
    setModalVisible(true);
  };

  const handleDeleteEmployee = async (id: number) => {
    try {
      await axios.delete(`/employees/${id}`);
      message.success('Employee deleted successfully');
      fetchEmployees();
      fetchStats();
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Failed to delete employee');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingEmployee) {
        await axios.patch(`/employees/${editingEmployee.id}`, values);
        message.success('Employee updated successfully');
      } else {
        await axios.post('/employees', values);
        message.success('Employee created successfully');
      }
      setModalVisible(false);
      fetchEmployees();
      fetchStats();
    } catch (error) {
      console.error('Error saving employee:', error);
      message.error('Failed to save employee');
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
      case 'suspended': return 'Đã nghỉ việc';
      default: return status;
    }
  };

  // Filter employees
  const filteredEmployees = (employees || []).filter(employee => {
    const matchesSearch = 
      employee.user?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.user?.email?.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.user?.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department?.name === departmentFilter;
    const matchesPosition = positionFilter === 'all' || employee.position === positionFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesPosition;
  });

  const columns = [
    {
      title: 'Nhân viên',
      key: 'employee',
      render: (record: Employee) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserAvatar user={record.user} size={40} showName={false} />
          <div>
            <div style={{ fontWeight: 600, color: '#222' }}>{record.user?.name}</div>
            <div style={{ fontSize: 12, color: '#666' }}>{record.user?.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Vị trí',
      key: 'position',
      render: (record: Employee) => (
        <Tag color="blue">{record.position}</Tag>
      ),
    },
    {
      title: 'Phòng ban',
      key: 'department',
      render: (record: Employee) => (
        <Tag color="purple">{record.department?.name}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record: Employee) => (
        <Badge 
          status={record.user?.status === 'active' ? 'success' : record.user?.status === 'inactive' ? 'warning' : 'error'} 
          text={getStatusText(record.user?.status || '')} 
        />
      ),
    },
    {
      title: 'Ngày vào làm',
      key: 'hire_date',
      render: (record: Employee) => (
        <span>{record.hire_date ? new Date(record.hire_date).toLocaleDateString() : 'N/A'}</span>
      ),
    },
    {
      title: 'Lương',
      key: 'salary',
      render: (record: Employee) => (
        <span style={{ fontWeight: 600, color: '#52c41a' }}>
          {record.salary?.toLocaleString()} VNĐ
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Employee) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => navigate(`/employees/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEditEmployee(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa nhân viên này?"
              onConfirm={() => handleDeleteEmployee(record.id)}
              okText="Có"
              cancelText="Không"
            >
              <Button 
                type="link" 
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
                <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                  <ArrowLeftOutlined /> Dashboard
                </a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Quản lý nhân viên</Breadcrumb.Item>
            </Breadcrumb>

            {/* Statistics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tổng nhân viên"
                    value={stats.total}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đang làm việc"
                    value={stats.active}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Tạm nghỉ"
                    value={stats.inactive}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Đã nghỉ việc"
                    value={stats.suspended}
                    prefix={<UserOutlined />}
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
                  <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Danh sách nhân viên</h1>
                  <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                    {filteredEmployees.length} nhân viên
                  </p>
                </div>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleAddEmployee}
                >
                  Thêm nhân viên
                </Button>
              </div>

              {/* Filters */}
              <div style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                  <Col span={8}>
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
                      <Select.Option value="active">Đang làm việc</Select.Option>
                      <Select.Option value="inactive">Tạm nghỉ</Select.Option>
                      <Select.Option value="suspended">Đã nghỉ việc</Select.Option>
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
                      {Array.isArray(departments) && departments.map(dept => (
                        <Select.Option key={dept.id} value={dept.name}>
                          {dept.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Select
                      placeholder="Vị trí"
                      value={positionFilter}
                      onChange={setPositionFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả vị trí</Select.Option>
                      {Array.isArray(positions) && positions.map(position => (
                        <Select.Option key={position} value={position}>
                          {position}
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={4}>
                    <Button 
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setSearchText('');
                        setStatusFilter('all');
                        setDepartmentFilter('all');
                        setPositionFilter('all');
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </Col>
                </Row>
              </div>

              <Table
                columns={columns}
                dataSource={filteredEmployees}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
                }}
                locale={{
                  emptyText: 'Không có nhân viên nào',
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      <Modal
        title={editingEmployee ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="user_id"
                label="User ID"
                rules={[{ required: true, message: 'Vui lòng nhập User ID' }]}
              >
                <Input placeholder="Nhập User ID" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department_id"
                label="Department ID"
                rules={[{ required: true, message: 'Vui lòng nhập Department ID' }]}
              >
                <Input placeholder="Nhập Department ID" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="position"
                label="Vị trí"
                rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}
              >
                <Input placeholder="Nhập vị trí" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="salary"
                label="Lương"
                rules={[{ required: true, message: 'Vui lòng nhập lương' }]}
              >
                <Input type="number" placeholder="Nhập lương" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contract_type"
                label="Loại hợp đồng"
                rules={[{ required: true, message: 'Vui lòng chọn loại hợp đồng' }]}
              >
                <Select placeholder="Chọn loại hợp đồng">
                  <Select.Option value="full-time">Full-time</Select.Option>
                  <Select.Option value="part-time">Part-time</Select.Option>
                  <Select.Option value="intern">Intern</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hire_date"
                label="Ngày vào làm"
                rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dob"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value="male">Nam</Select.Option>
                  <Select.Option value="female">Nữ</Select.Option>
                  <Select.Option value="other">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingEmployee ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
} 