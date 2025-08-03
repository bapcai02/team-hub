import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Badge,
  Tooltip,
  Modal,
  message,
  Row,
  Col,
  Statistic,
  Typography,
  Breadcrumb,
  Popconfirm,
  Form,
  DatePicker,
  Dropdown,
  Menu,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  LaptopOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  PrinterOutlined,
  ScanOutlined,
  SettingOutlined,
  DownOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import {
  fetchDevices,
  fetchDeviceStats,
  searchDevices,
  deleteDevice,
  createDevice,
  setSearchQuery,
  setFilters,
  clearFilters,
} from '../../features/devices/devicesSlice';
import { Device, CreateDeviceRequest } from '../../features/devices/types';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import UserAvatar from '../../components/UserAvatar';

const { Title, Text } = Typography;
const { Search } = Input;

const DevicesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { devices = [], stats, loading, searchQuery, filters } = useSelector((state: RootState) => state.devices);

  const [searchValue, setSearchValue] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchDevices(undefined));
    dispatch(fetchDeviceStats());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      dispatch(searchDevices(value));
    } else {
      dispatch(fetchDevices(undefined));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchValue('');
    dispatch(fetchDevices(undefined));
  };

  const handleViewDevice = (device: Device) => {
    setSelectedDevice(device);
    setDetailModalVisible(true);
  };

  const handleEditDevice = (device: Device) => {
    // Navigate to edit page or open edit modal
    message.info('Edit device functionality coming soon');
  };

  const handleDeleteDevice = async (device: Device) => {
    try {
      await dispatch(deleteDevice(device.id)).unwrap();
      message.success('Device deleted successfully');
      dispatch(fetchDevices(undefined));
      dispatch(fetchDeviceStats());
    } catch (error: any) {
      message.error(error.message || 'Failed to delete device');
    }
  };

  const handleCreateDevice = () => {
    setCreateModalVisible(true);
  };

  const handleCreateDeviceSubmit = async (values: any) => {
    try {
      const deviceData: CreateDeviceRequest = {
        ...values,
        purchase_date: values.purchase_date.format('YYYY-MM-DD'),
        warranty_expiry: values.warranty_expiry.format('YYYY-MM-DD'),
        specifications: {
          processor: values.processor || '',
          memory: values.memory || '',
          storage: values.storage || '',
          os: values.os || '',
        },
      };

      await dispatch(createDevice(deviceData)).unwrap();
      message.success('Device created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      dispatch(fetchDevices(undefined));
      dispatch(fetchDeviceStats());
    } catch (error: any) {
      message.error(error.message || 'Failed to create device');
    }
  };

  const handleCreateDeviceCancel = () => {
    setCreateModalVisible(false);
    createForm.resetFields();
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return <LaptopOutlined style={{ color: '#1890ff' }} />;
      case 'desktop':
        return <DesktopOutlined style={{ color: '#52c41a' }} />;
      case 'tablet':
        return <TabletOutlined style={{ color: '#faad14' }} />;
      case 'phone':
        return <MobileOutlined style={{ color: '#722ed1' }} />;
      case 'printer':
        return <PrinterOutlined style={{ color: '#eb2f96' }} />;
      case 'scanner':
        return <ScanOutlined style={{ color: '#13c2c2' }} />;
      default:
        return <SettingOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const getDeviceTypeText = (type: string) => {
    switch (type) {
      case 'laptop':
        return 'Laptop';
      case 'desktop':
        return 'Desktop';
      case 'tablet':
        return 'Tablet';
      case 'phone':
        return 'Phone';
      case 'printer':
        return 'Printer';
      case 'scanner':
        return 'Scanner';
      default:
        return 'Other';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'in_use':
        return 'processing';
      case 'maintenance':
        return 'warning';
      case 'retired':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'in_use':
        return 'In Use';
      case 'maintenance':
        return 'Maintenance';
      case 'retired':
        return 'Retired';
      default:
        return status;
    }
  };

  const columns = [
    {
      title: 'Device',
      key: 'device',
      render: (record: Device) => (
        <Space>
          {getDeviceTypeIcon(record.type)}
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.code} • {record.model}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{getDeviceTypeText(type)}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={getStatusText(status)} 
        />
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assigned_user',
      key: 'assigned_user',
      render: (user: any) => (
        user ? (
          <UserAvatar user={user} size={24} showName={true} />
        ) : (
          <span style={{ color: '#999' }}>Unassigned</span>
        )
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Tag color="purple">{location}</Tag>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => (
        <Tag color="green">{department}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Device) => (
        <Space>
          <Tooltip title="View details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDevice(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditDevice(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this device?"
              onConfirm={() => handleDeleteDevice(record)}
              okText="Yes"
              cancelText="No"
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
              <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item>Devices</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                Device Management
              </Title>
              <Text type="secondary">
                Manage company devices, track assignments, and monitor device status
              </Text>
            </div>

            {/* Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Total Devices"
                    value={stats?.total_devices || 0}
                    prefix={<LaptopOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Available"
                    value={stats?.available_devices || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="In Use"
                    value={stats?.in_use_devices || 0}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Maintenance"
                    value={stats?.maintenance_devices || 0}
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Filters and Search */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Search
                    placeholder="Search devices..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    placeholder="Filter by type"
                    value={filters.type}
                    onChange={(value) => handleFilterChange('type', value)}
                    style={{ width: '100%' }}
                    allowClear
                  >
                    <Select.Option value="laptop">Laptop</Select.Option>
                    <Select.Option value="desktop">Desktop</Select.Option>
                    <Select.Option value="tablet">Tablet</Select.Option>
                    <Select.Option value="phone">Phone</Select.Option>
                    <Select.Option value="printer">Printer</Select.Option>
                    <Select.Option value="scanner">Scanner</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Select
                    placeholder="Filter by status"
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    style={{ width: '100%' }}
                    allowClear
                  >
                    <Select.Option value="available">Available</Select.Option>
                    <Select.Option value="in_use">In Use</Select.Option>
                    <Select.Option value="maintenance">Maintenance</Select.Option>
                    <Select.Option value="retired">Retired</Select.Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Button 
                    onClick={handleClearFilters}
                    style={{ width: '100%' }}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Devices Table */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Text strong>{devices.length} devices</Text>
                  {(filters.type || filters.status || searchValue) && (
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      (Filtered)
                    </Text>
                  )}
                </div>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item key="add-device" icon={<PlusOutlined />} onClick={handleCreateDevice}>
                        Add Device
                      </Menu.Item>
                      <Menu.Item key="add-category" icon={<AppstoreOutlined />}>
                        Add Category
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <Button type="primary" icon={<PlusOutlined />}>
                    Add <DownOutlined />
                  </Button>
                </Dropdown>
              </div>

              <Table
                columns={columns}
                dataSource={devices || []}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} devices`,
                }}
                locale={{
                  emptyText: 'No devices found',
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Device Detail Modal */}
      {selectedDevice && (
        <Modal
          title={
            <Space>
              {getDeviceTypeIcon(selectedDevice.type)}
              <span>{selectedDevice.name}</span>
            </Space>
          }
          open={detailModalVisible}
          onCancel={() => {
            setDetailModalVisible(false);
            setSelectedDevice(null);
          }}
          footer={[
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Close
            </Button>,
            <Button key="edit" type="primary" onClick={() => handleEditDevice(selectedDevice)}>
              Edit
            </Button>,
          ]}
          width={600}
        >
          <div>
                      <Row gutter={[16, 16]}>
            <Col span={12}>
              <Text strong>Code:</Text>
              <br />
              <Text>{selectedDevice.code}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Model:</Text>
              <br />
              <Text>{selectedDevice.model}</Text>
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Text strong>Serial Number:</Text>
              <br />
              <Text>{selectedDevice.serial_number}</Text>
            </Col>
            <Col span={12}>
              <Text strong>Type:</Text>
              <br />
              <Tag color="blue">{getDeviceTypeText(selectedDevice.type)}</Tag>
            </Col>
          </Row>
                      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col span={12}>
              <Text strong>Status:</Text>
              <br />
              <Badge 
                status={getStatusColor(selectedDevice.status) as any} 
                text={getStatusText(selectedDevice.status)} 
              />
            </Col>
            <Col span={12}>
              <Text strong>Location:</Text>
              <br />
              <Text>{selectedDevice.location}</Text>
            </Col>
          </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text strong>Location:</Text>
                <br />
                <Text>{selectedDevice.location}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Department:</Text>
                <br />
                <Text>{selectedDevice.department}</Text>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Text strong>Purchase Date:</Text>
                <br />
                <Text>{new Date(selectedDevice.purchase_date).toLocaleDateString()}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Warranty Expiry:</Text>
                <br />
                <Text>{new Date(selectedDevice.warranty_expiry).toLocaleDateString()}</Text>
              </Col>
            </Row>
            {selectedDevice.assigned_user && (
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text strong>Assigned To:</Text>
                  <br />
                  <UserAvatar user={selectedDevice.assigned_user} size={32} showName={true} />
                </Col>
              </Row>
            )}
            {selectedDevice.notes && (
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={24}>
                  <Text strong>Notes:</Text>
                  <br />
                  <Text>{selectedDevice.notes}</Text>
                </Col>
              </Row>
            )}
          </div>
        </Modal>
      )}

      {/* Create Device Modal */}
      <Modal
        title="Add New Device"
        open={createModalVisible}
        onCancel={handleCreateDeviceCancel}
        footer={null}
        width={800}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateDeviceSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Device Name"
                rules={[{ required: true, message: 'Please enter device name' }]}
              >
                <Input placeholder="Enter device name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Device Code"
                rules={[{ required: true, message: 'Please enter device code' }]}
              >
                <Input placeholder="Enter device code (e.g., DEV001)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Device Type"
                rules={[{ required: true, message: 'Please select device type' }]}
              >
                <Select placeholder="Select device type">
                  <Select.Option value="laptop">Laptop</Select.Option>
                  <Select.Option value="desktop">Desktop</Select.Option>
                  <Select.Option value="tablet">Tablet</Select.Option>
                  <Select.Option value="phone">Phone</Select.Option>
                  <Select.Option value="printer">Printer</Select.Option>
                  <Select.Option value="scanner">Scanner</Select.Option>
                  <Select.Option value="other">Other</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: 'Please enter model' }]}
              >
                <Input placeholder="Enter model" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="serial_number"
                label="Serial Number"
                rules={[{ required: true, message: 'Please enter serial number' }]}
              >
                <Input placeholder="Enter serial number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="available">Available</Select.Option>
                  <Select.Option value="in_use">In Use</Select.Option>
                  <Select.Option value="maintenance">Maintenance</Select.Option>
                  <Select.Option value="retired">Retired</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please enter location' }]}
              >
                <Input placeholder="Enter location" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please enter department' }]}
              >
                <Input placeholder="Enter department" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Select.Option value="available">Available</Select.Option>
                  <Select.Option value="in_use">In Use</Select.Option>
                  <Select.Option value="maintenance">Maintenance</Select.Option>
                  <Select.Option value="retired">Retired</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="assigned_to"
                label="Assigned To (Optional)"
              >
                <Input placeholder="Enter user ID" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="purchase_date"
                label="Purchase Date"
                rules={[{ required: true, message: 'Please select purchase date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="warranty_expiry"
                label="Warranty Expiry"
                rules={[{ required: true, message: 'Please select warranty expiry date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item
                name="processor"
                label="Processor"
              >
                <Input placeholder="e.g., Intel i7" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="memory"
                label="Memory"
              >
                <Input placeholder="e.g., 16GB" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="storage"
                label="Storage"
              >
                <Input placeholder="e.g., 512GB SSD" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="os"
                label="Operating System"
              >
                <Input placeholder="e.g., Windows 11" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={3} placeholder="Enter any additional notes" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCreateDeviceCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Device
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DevicesPage; 