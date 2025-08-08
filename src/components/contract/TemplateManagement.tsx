import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Card, 
  Typography,
  Tooltip,
  Popconfirm,
  message,
  Modal,
  Form,
  Select
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch } from '../../app/store';
import { 
  fetchContractTemplates, 
  deleteTemplate, 
  createTemplate,
  updateTemplate
} from '../../features/contract/contractSlice';
import { ContractTemplate } from '../../features/contract/types';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const TemplateManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { templates, loading } = useSelector((state: RootState) => state.contract);
  const [searchText, setSearchText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
  const [form] = Form.useForm();

  React.useEffect(() => {
    dispatch(fetchContractTemplates());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteTemplate(id)).unwrap();
      message.success(t('contract.template.deleteSuccess'));
    } catch (error) {
      message.error(t('contract.template.deleteError'));
    }
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    form.resetFields();
    setShowForm(true);
  };

  const handleEdit = (template: ContractTemplate) => {
    setEditingTemplate(template);
    form.setFieldsValue(template);
    setShowForm(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingTemplate) {
        await dispatch(updateTemplate({ id: editingTemplate.id, data: values })).unwrap();
        message.success(t('contract.template.updateSuccess'));
      } else {
        await dispatch(createTemplate(values)).unwrap();
        message.success(t('contract.template.createSuccess'));
      }
      setShowForm(false);
      setEditingTemplate(null);
      form.resetFields();
    } catch (error) {
      message.error(t('contract.template.saveError'));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'employment':
        return 'blue';
      case 'service':
        return 'green';
      case 'partnership':
        return 'purple';
      case 'vendor':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: t('contract.template.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <span style={{ fontWeight: 'bold' }}>{text}</span>
      ),
    },
    {
      title: t('contract.template.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={getTypeColor(type)}>
          {t(`contract.types.${type}`)}
        </Tag>
      ),
    },
    {
      title: t('contract.template.description'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: t('contract.template.status'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
    },
    {
      title: t('contract.template.variables'),
      dataIndex: 'variables',
      key: 'variables',
      render: (variables: any) => (
        <span>
          {variables ? Object.keys(variables).length : 0} {t('contract.template.variables')}
        </span>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: ContractTemplate) => (
        <Space size="small">
          <Tooltip title={t('common.view')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                Modal.info({
                  title: record.name,
                  width: 800,
                  content: (
                    <div>
                      <p><strong>{t('contract.template.description')}:</strong> {record.description}</p>
                      <p><strong>{t('contract.template.type')}:</strong> {t(`contract.types.${record.type}`)}</p>
                      <p><strong>{t('contract.template.content')}:</strong></p>
                      <div 
                        style={{ 
                          border: '1px solid #d9d9d9', 
                          padding: '12px', 
                          borderRadius: '6px',
                          backgroundColor: '#fafafa',
                          maxHeight: '300px',
                          overflow: 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: record.content }}
                      />
                    </div>
                  ),
                });
              }}
            />
          </Tooltip>
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('contract.template.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Tooltip title={t('common.delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredTemplates = (templates || []).filter(template => 
    template.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>{t('contract.template.management')}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          {t('contract.template.create')}
        </Button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder={t('contract.template.searchPlaceholder')}
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredTemplates}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredTemplates.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
        }}
      />

      <Modal
        title={editingTemplate ? t('contract.template.edit') : t('contract.template.create')}
        open={showForm}
        onCancel={() => {
          setShowForm(false);
          setEditingTemplate(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_active: true,
            type: 'service',
          }}
        >
          <Form.Item
            name="name"
            label={t('contract.template.name')}
            rules={[{ required: true, message: t('contract.template.nameRequired') }]}
          >
            <Input placeholder={t('contract.template.namePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="type"
            label={t('contract.template.type')}
            rules={[{ required: true, message: t('contract.template.typeRequired') }]}
          >
            <Select placeholder={t('contract.template.typePlaceholder')}>
              <Option value="employment">{t('contract.types.employment')}</Option>
              <Option value="service">{t('contract.types.service')}</Option>
              <Option value="partnership">{t('contract.types.partnership')}</Option>
              <Option value="vendor">{t('contract.types.vendor')}</Option>
              <Option value="client">{t('contract.types.client')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label={t('contract.template.description')}
            rules={[{ required: true, message: t('contract.template.descriptionRequired') }]}
          >
            <TextArea 
              rows={3} 
              placeholder={t('contract.template.descriptionPlaceholder')}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label={t('contract.template.content')}
            rules={[{ required: true, message: t('contract.template.contentRequired') }]}
          >
            <TextArea 
              rows={8} 
              placeholder={t('contract.template.contentPlaceholder')}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('contract.template.status')}
          >
            <Select>
              <Option value={true}>{t('common.active')}</Option>
              <Option value={false}>{t('common.inactive')}</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button 
              onClick={() => {
                setShowForm(false);
                setEditingTemplate(null);
                form.resetFields();
              }} 
              style={{ marginRight: 8 }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingTemplate ? t('common.update') : t('common.create')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TemplateManagement; 