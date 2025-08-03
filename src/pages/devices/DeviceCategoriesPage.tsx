import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  Tooltip,
  Modal,
  message,
  Row,
  Col,
  Typography,
  Breadcrumb,
  Popconfirm,
  Form,
  Switch,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { DeviceCategory, CreateDeviceCategoryRequest, UpdateDeviceCategoryRequest } from '../../features/devices/types';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';

const { Title, Text } = Typography;
const { Search } = Input;

const DeviceCategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<DeviceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<DeviceCategory | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
             const mockCategories: DeviceCategory[] = [
         {
           id: 1,
           name: 'Laptops',
           code: 'CAT001',
           slug: 'laptops',
           description: 'Portable computers for work and development',
           icon: 'laptop',
           is_active: true,
           created_at: '2023-01-01T00:00:00Z',
           updated_at: '2023-01-01T00:00:00Z',
         },
         {
           id: 2,
           name: 'Desktops',
           code: 'CAT002',
           slug: 'desktops',
           description: 'Desktop computers for office work',
           icon: 'desktop',
           is_active: true,
           created_at: '2023-01-01T00:00:00Z',
           updated_at: '2023-01-01T00:00:00Z',
         },
         {
           id: 3,
           name: 'Tablets',
           code: 'CAT003',
           slug: 'tablets',
           description: 'Tablet devices for design and presentations',
           icon: 'tablet',
           is_active: true,
           created_at: '2023-01-01T00:00:00Z',
           updated_at: '2023-01-01T00:00:00Z',
         },
       ];
      setCategories(mockCategories);
    } catch (error) {
      message.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    // TODO: Implement search functionality
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

      // TODO: Implement API call
      message.success('Category created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      fetchCategories();
    } catch (error: any) {
      message.error(error.message || 'Failed to create category');
    }
  };

  const handleEditCategory = (category: DeviceCategory) => {
    setSelectedCategory(category);
    editForm.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      is_active: category.is_active,
    });
    setEditModalVisible(true);
  };

  const handleEditCategorySubmit = async (values: any) => {
    try {
      const categoryData: UpdateDeviceCategoryRequest = {
        ...values,
      };

      // TODO: Implement API call
      message.success('Category updated successfully');
      setEditModalVisible(false);
      setSelectedCategory(null);
      editForm.resetFields();
      fetchCategories();
    } catch (error: any) {
      message.error(error.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (category: DeviceCategory) => {
    try {
      // TODO: Implement API call
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete category');
    }
  };

  const columns = [
          {
        title: 'Category',
        key: 'category',
        render: (record: DeviceCategory) => (
          <Space>
            <AppstoreOutlined style={{ color: '#1890ff' }} />
            <div>
              <div style={{ fontWeight: 500 }}>{record.name}</div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.code} • {record.slug}
              </Text>
            </div>
          </Space>
        ),
      },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Text>{description || 'No description'}</Text>
      ),
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon: string) => (
        <Tag color="blue">{icon}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DeviceCategory) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditCategory(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this category?"
              onConfirm={() => handleDeleteCategory(record)}
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
              <Breadcrumb.Item>Categories</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                Device Categories
              </Title>
              <Text type="secondary">
                Manage device categories and classifications
              </Text>
            </div>

            {/* Search and Actions */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={[16, 16]} align="middle">
                <Col xs={24} sm={16}>
                  <Search
                    placeholder="Search categories..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCategory}>
                    Add Category
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Categories Table */}
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <Text strong>{categories.length} categories</Text>
                  {searchValue && (
                    <Text type="secondary" style={{ marginLeft: 8 }}>
                      (Filtered)
                    </Text>
                  )}
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} categories`,
                }}
                locale={{
                  emptyText: 'No categories found',
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      <Modal
        title="Add New Category"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
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
             label="Category Name"
             rules={[{ required: true, message: 'Please enter category name' }]}
           >
             <Input placeholder="Enter category name" />
           </Form.Item>

           <Form.Item
             name="code"
             label="Category Code"
             rules={[{ required: true, message: 'Please enter category code' }]}
           >
             <Input placeholder="Enter category code (e.g., CAT001)" />
           </Form.Item>

           <Form.Item
             name="slug"
             label="Slug"
             rules={[{ required: true, message: 'Please enter slug' }]}
           >
             <Input placeholder="Enter slug (e.g., laptops)" />
           </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
          >
            <Input placeholder="Enter icon name" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Category
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedCategory(null);
          editForm.resetFields();
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
             label="Category Name"
             rules={[{ required: true, message: 'Please enter category name' }]}
           >
             <Input placeholder="Enter category name" />
           </Form.Item>

           <Form.Item
             name="code"
             label="Category Code"
             rules={[{ required: true, message: 'Please enter category code' }]}
           >
             <Input placeholder="Enter category code (e.g., CAT001)" />
           </Form.Item>

           <Form.Item
             name="slug"
             label="Slug"
             rules={[{ required: true, message: 'Please enter slug' }]}
           >
             <Input placeholder="Enter slug (e.g., laptops)" />
           </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="icon"
            label="Icon"
          >
            <Input placeholder="Enter icon name" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedCategory(null);
                editForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Category
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceCategoriesPage; 