import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Input, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Modal,
  Form,
  message,
  Tooltip,
  Badge,
  Switch
} from 'antd';
import {
  LaptopOutlined,
  DesktopOutlined,
  TabletOutlined,
  MobileOutlined,
  PrinterOutlined,
  ScannerOutlined,
  NetworkOutlined,
  DeviceOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { 
  fetchDeviceCategories, 
  createDeviceCategory, 
  updateDeviceCategory, 
  deleteDeviceCategory,
  searchDeviceCategories
} from '../../features/devices/devicesSlice';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { DeviceCategory, CreateDeviceCategoryRequest, UpdateDeviceCategoryRequest } from '../../features/devices/types';

const { Title, Text } = Typography;
const { Search } = Input;
const { TextArea } = Input;

const DeviceCategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories, loading, stats } = useAppSelector(state => state.devices);
  
  const [searchValue, setSearchValue] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchDeviceCategories());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      dispatch(searchDeviceCategories(value));
    } else {
      dispatch(fetchDeviceCategories());
    }
  };

  const handleCreateCategory = () => {
    setCreateModalVisible(true);
  };

  const handleCreateCategorySubmit = async (values: any) => {
    try {
      const categoryData: CreateDeviceCategoryRequest = {
        ...values,
        is_active: values.is_active ?? true,
      };

      await dispatch(createDeviceCategory(categoryData)).unwrap();
      message.success(t('devices.categoryCreated'));
      setCreateModalVisible(false);
      createForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('devices.failedToCreateCategory'));
    }
  };

  const handleEditCategory = (category: DeviceCategory) => {
    setSelectedCategory(category);
    editForm.setFieldsValue({
      name: category.name,
      code: category.code,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      is_active: category.is_active,
    });
    setEditModalVisible(true);
  };

  const handleEditCategorySubmit = async (values: any) => {
    if (!selectedCategory) return;
    
    try {
      const categoryData: UpdateDeviceCategoryRequest = {
        ...values,
      };

      await dispatch(updateDeviceCategory({ id: selectedCategory.id, data: categoryData })).unwrap();
      message.success(t('devices.categoryUpdated'));
      setEditModalVisible(false);
      setSelectedCategory(null);
      editForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('devices.failedToUpdateCategory'));
    }
  };

  const handleDeleteCategory = async (category: DeviceCategory) => {
    try {
      await dispatch(deleteDeviceCategory(category.id)).unwrap();
      message.success(t('devices.categoryDeleted'));
    } catch (error: any) {
      message.error(error.message || t('devices.failedToDeleteCategory'));
    }
  };

  const handleToggleActive = async (category: DeviceCategory) => {
    try {
      await dispatch(updateDeviceCategory({ 
        id: category.id, 
        data: { is_active: !category.is_active } 
      })).unwrap();
      message.success(t('devices.statusUpdated'));
    } catch (error: any) {
      message.error(error.message || t('devices.failedToUpdateStatus'));
    }
  };

  const getCategoryIcon = (icon: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      laptop: <LaptopOutlined />,
      desktop: <DesktopOutlined />,
      tablet: <TabletOutlined />,
      mobile: <MobileOutlined />,
      printer: <PrinterOutlined />,
      scanner: <ScannerOutlined />,
      network: <NetworkOutlined />,
      device: <DeviceOutlined />,
    };
    return iconMap[icon] || <DeviceOutlined />;
  };

  const columns = [
    {
      title: t('devices.category'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: DeviceCategory) => (
        <Space>
          {getCategoryIcon(record.icon)}
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.code}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('devices.description'),
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-',
    },
    {
      title: t('devices.status'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean, record: DeviceCategory) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleActive(record)}
          size="small"
        />
      ),
    },
    {
      title: t('devices.devicesCount'),
      dataIndex: 'devices_count',
      key: 'devices_count',
      render: (count: number) => count || 0,
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: DeviceCategory) => (
        <Space>
          <Tooltip title={t('common.view')}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/devices/categories/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title={t('common.edit')}>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditCategory(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteCategory(record)}
            />
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
            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                {t('devices.categoryManagement')}
              </Title>
              <Text type="secondary">
                {t('devices.categoryDescription')}
              </Text>
            </div>

            {/* Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('devices.totalCategories')}
                    value={stats?.total_categories || 0}
                    prefix={<DeviceOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('devices.activeCategories')}
                    value={stats?.active_categories || 0}
                    prefix={<DeviceOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('devices.totalDevices')}
                    value={stats?.total_devices || 0}
                    prefix={<LaptopOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('devices.assignedDevices')}
                    value={stats?.assigned_devices || 0}
                    prefix={<LaptopOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Actions */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={16} align="middle">
                <Col span={16}>
                  <Search
                    placeholder={t('devices.searchCategories')}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={handleCreateCategory}
                  >
                    {t('devices.createCategory')}
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Categories Table */}
            <Card>
              <Table
                columns={columns}
                dataSource={categories || []}
                rowKey="id"
                loading={loading}
                pagination={{
                  total: (categories || []).length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} categories`,
                }}
                locale={{
                  emptyText: t('devices.noCategories'),
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      <Modal
        title={t('devices.createCategory')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateCategorySubmit}
        >
          <Form.Item
            name="name"
            label={t('devices.name')}
            rules={[{ required: true, message: t('devices.nameRequired') }]}
          >
            <Input placeholder={t('devices.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="code"
            label={t('devices.code')}
            rules={[{ required: true, message: t('devices.codeRequired') }]}
          >
            <Input placeholder={t('devices.codePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="slug"
            label={t('devices.slug')}
            rules={[{ required: true, message: t('devices.slugRequired') }]}
          >
            <Input placeholder={t('devices.slugPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('devices.description')}
          >
            <TextArea 
              rows={3} 
              placeholder={t('devices.descriptionPlaceholder')} 
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label={t('devices.icon')}
            rules={[{ required: true, message: t('devices.iconRequired') }]}
          >
            <Input placeholder={t('devices.iconPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('devices.status')}
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common.create')}
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title={t('devices.editCategory')}
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedCategory(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditCategorySubmit}
        >
          <Form.Item
            name="name"
            label={t('devices.name')}
            rules={[{ required: true, message: t('devices.nameRequired') }]}
          >
            <Input placeholder={t('devices.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="code"
            label={t('devices.code')}
            rules={[{ required: true, message: t('devices.codeRequired') }]}
          >
            <Input placeholder={t('devices.codePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="slug"
            label={t('devices.slug')}
            rules={[{ required: true, message: t('devices.slugRequired') }]}
          >
            <Input placeholder={t('devices.slugPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('devices.description')}
          >
            <TextArea 
              rows={3} 
              placeholder={t('devices.descriptionPlaceholder')} 
            />
          </Form.Item>

          <Form.Item
            name="icon"
            label={t('devices.icon')}
            rules={[{ required: true, message: t('devices.iconRequired') }]}
          >
            <Input placeholder={t('devices.iconPlaceholder')} />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('devices.status')}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common.update')}
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedCategory(null);
              }}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceCategoriesPage; 