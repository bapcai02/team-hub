import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { RootState } from '../../app/store';
import {
  fetchNotificationTemplates,
  createNotificationTemplate,
  updateNotificationTemplate,
  deleteNotificationTemplate,
} from '../../features/notifications/notificationSlice';
import { NotificationTemplate } from '../../features/notifications/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const NotificationTemplates: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplate | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    templates,
    templatesLoading,
    templatesError,
    categories,
    channels,
    priorities,
  } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationTemplates() as any);
  }, [dispatch]);

  const handleCreateTemplate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      category: template.category,
      type: template.type,
      title_template: template.title_template,
      message_template: template.message_template,
      channels: template.channels,
      priority: template.priority,
      is_active: template.is_active,
    });
    setModalVisible(true);
  };

  const handleDeleteTemplate = async (id: number) => {
    try {
      await dispatch(deleteNotificationTemplate(id) as any);
      message.success(t('notifications.templates.deleteSuccess'));
    } catch (error) {
      message.error(t('notifications.templates.deleteError'));
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingTemplate) {
        await dispatch(updateNotificationTemplate({ id: editingTemplate.id, data: values }) as any);
        message.success(t('notifications.templates.updateSuccess'));
      } else {
        await dispatch(createNotificationTemplate(values) as any);
        message.success(t('notifications.templates.createSuccess'));
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error(t('notifications.templates.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      system: 'blue',
      project: 'green',
      finance: 'orange',
      hr: 'purple',
      device: 'cyan',
      contract: 'red',
    };
    return colors[category] || 'default';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'green',
      normal: 'blue',
      high: 'orange',
      urgent: 'red',
    };
    return colors[priority] || 'default';
  };

  const columns = [
    {
      title: t('notifications.templates.name') || 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: NotificationTemplate) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.type}
          </Text>
        </div>
      ),
    },
    {
      title: t('notifications.templates.category') || 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {categories[category] || category}
        </Tag>
      ),
    },
    {
      title: t('notifications.templates.channels') || 'Channels',
      dataIndex: 'channels',
      key: 'channels',
      width: 150,
      render: (channels: string[]) => (
        <Space size="small" wrap>
          {channels.map(channel => (
            <Tag key={channel}>
              {channel}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: t('notifications.templates.priority') || 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priorities[priority] || priority}
        </Tag>
      ),
    },
    {
      title: t('notifications.templates.status') || 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      width: 100,
      render: (isActive: boolean) => (
        <Badge 
          status={isActive ? 'success' : 'default'} 
          text={isActive ? (t('notifications.templates.active') || 'Active') : (t('notifications.templates.inactive') || 'Inactive')} 
        />
      ),
    },
    {
      title: t('notifications.templates.actions') || 'Actions',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: NotificationTemplate) => (
        <Space size="small" wrap>
          <Tooltip title={t('notifications.templates.view') || 'View'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleEditTemplate(record)}
            />
          </Tooltip>
          <Tooltip title={t('notifications.templates.edit') || 'Edit'}>
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditTemplate(record)}
            />
          </Tooltip>
          <Tooltip title={t('notifications.templates.copy') || 'Copy'}>
            <Button
              type="text"
              icon={<CopyOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title={t('notifications.templates.send') || 'Send'}>
            <Button
              type="text"
              icon={<SendOutlined />}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title={t('notifications.templates.deleteConfirm') || 'Are you sure you want to delete this template?'}
            onConfirm={() => handleDeleteTemplate(record.id)}
            okText={t('common.yes') || 'Yes'}
            cancelText={t('common.no') || 'No'}
          >
            <Tooltip title={t('notifications.templates.delete') || 'Delete'}>
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              {t('notifications.templates.title') || 'Notification Templates'}
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTemplate}
            >
              {t('notifications.templates.create') || 'Create Template'}
            </Button>
          </Space>
        </div>

        {templatesError && (
          <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
            {templatesError}
          </Text>
        )}

        <Table
          columns={columns}
          dataSource={templates}
          loading={templatesLoading}
          rowKey="id"
          scroll={{ x: 1000 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${t('common.showing') || 'Showing'} ${range[0]}-${range[1]} ${t('common.of') || 'of'} ${total} ${t('common.items') || 'items'}`,
          }}
          size="small"
        />
      </Card>

      <Modal
        title={editingTemplate ? (t('notifications.templates.edit') || 'Edit Template') : (t('notifications.templates.create') || 'Create Template')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label={t('notifications.templates.name') || 'Name'}
            rules={[{ required: true, message: t('notifications.templates.nameRequired') || 'Name is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label={t('notifications.templates.category') || 'Category'}
            rules={[{ required: true, message: t('notifications.templates.categoryRequired') || 'Category is required' }]}
          >
            <Select>
              {Object.entries(categories).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label={t('notifications.templates.type') || 'Type'}
            rules={[{ required: true, message: t('notifications.templates.typeRequired') || 'Type is required' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="title_template"
            label={t('notifications.templates.titleTemplate') || 'Title Template'}
            rules={[{ required: true, message: t('notifications.templates.titleTemplateRequired') || 'Title template is required' }]}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Form.Item
            name="message_template"
            label={t('notifications.templates.messageTemplate') || 'Message Template'}
            rules={[{ required: true, message: t('notifications.templates.messageTemplateRequired') || 'Message template is required' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="channels"
            label={t('notifications.templates.channels') || 'Channels'}
            rules={[{ required: true, message: t('notifications.templates.channelsRequired') || 'Channels are required' }]}
          >
            <Select mode="multiple">
              {Object.entries(channels).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="priority"
            label={t('notifications.templates.priority') || 'Priority'}
            rules={[{ required: true, message: t('notifications.templates.priorityRequired') || 'Priority is required' }]}
          >
            <Select>
              {Object.entries(priorities).map(([key, value]) => (
                <Option key={key} value={key}>{value}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('notifications.templates.status') || 'Status'}
            valuePropName="checked"
            initialValue={true}
          >
            <Select>
              <Option value={true}>{t('notifications.templates.active') || 'Active'}</Option>
              <Option value={false}>{t('notifications.templates.inactive') || 'Inactive'}</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingTemplate ? (t('common.update') || 'Update') : (t('common.create') || 'Create')}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                {t('common.cancel') || 'Cancel'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NotificationTemplates; 