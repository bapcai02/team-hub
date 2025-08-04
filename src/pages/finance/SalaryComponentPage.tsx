import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Alert,
  Spin,
  Tag,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  DollarOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../app/store';
import {
  fetchSalaryComponents,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
  toggleSalaryComponentActive,
  setSelectedSalaryComponent,
} from '../../features/finance/financeSlice';
import { SalaryComponent, CreateSalaryComponentRequest, UpdateSalaryComponentRequest } from '../../features/finance/types';
import Sidebar from '../../components/Sidebar';
import HeaderBar from '../../components/HeaderBar';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const SalaryComponentPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  const {
    salaryComponents,
    selectedSalaryComponent,
    salaryComponentLoading,
    salaryComponentError,
  } = useSelector((state: RootState) => state.finance);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filters, setFilters] = useState({});

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchSalaryComponents(filters));
  }, [dispatch, filters]);

  // Handle create salary component
  const handleCreate = async (values: any) => {
    try {
      const data: CreateSalaryComponentRequest = {
        name: values.name,
        code: values.code,
        type: values.type,
        calculation_type: values.calculation_type,
        amount: values.amount,
        percentage: values.percentage,
        formula: values.formula,
        is_taxable: values.is_taxable,
        is_active: values.is_active !== undefined ? values.is_active : true,
        description: values.description,
        sort_order: values.sort_order,
      };
      await dispatch(createSalaryComponent(data)).unwrap();
      message.success(t('salary_component.created_successfully'));
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || t('salary_component.creation_failed'));
    }
  };

  // Handle update salary component
  const handleUpdate = async (values: any) => {
    if (!selectedSalaryComponent || !selectedSalaryComponent.id || selectedSalaryComponent.id <= 0) {
      message.error('Invalid salary component selected');
      return;
    }
    try {
      const data: UpdateSalaryComponentRequest = {
        name: values.name,
        code: values.code,
        type: values.type,
        calculation_type: values.calculation_type,
        amount: values.amount,
        percentage: values.percentage,
        formula: values.formula,
        is_taxable: values.is_taxable,
        is_active: values.is_active,
        description: values.description,
        sort_order: values.sort_order,
      };
      await dispatch(updateSalaryComponent({ id: selectedSalaryComponent.id, data })).unwrap();
      message.success(t('salary_component.updated_successfully'));
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('salary_component.update_failed'));
    }
  };

  // Handle delete salary component
  const handleDelete = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid salary component ID');
      return;
    }
    try {
      await dispatch(deleteSalaryComponent(id)).unwrap();
      message.success(t('salary_component.deleted_successfully'));
    } catch (error: any) {
      message.error(error.message || t('salary_component.deletion_failed'));
    }
  };

  // Handle toggle active
  const handleToggleActive = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid salary component ID');
      return;
    }
    try {
      await dispatch(toggleSalaryComponentActive(id)).unwrap();
      message.success(t('salary_component.status_updated'));
    } catch (error: any) {
      message.error(error.message || t('salary_component.status_update_failed'));
    }
  };

  // Handle edit
  const handleEdit = (record: SalaryComponent) => {
    dispatch(setSelectedSalaryComponent(record));
    editForm.setFieldsValue({
      name: record.name,
      code: record.code,
      type: record.type,
      calculation_type: record.calculation_type,
      amount: record.amount,
      percentage: record.percentage,
      formula: record.formula,
      is_taxable: record.is_taxable,
      is_active: record.is_active,
      description: record.description,
      sort_order: record.sort_order,
    });
    setEditModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: t('salary_component.code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: t('salary_component.name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: t('salary_component.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          allowance: { color: 'green', text: t('salary_component.type_allowance') },
          deduction: { color: 'red', text: t('salary_component.type_deduction') },
          bonus: { color: 'blue', text: t('salary_component.type_bonus') },
          overtime: { color: 'orange', text: t('salary_component.type_overtime') },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('salary_component.calculation_type'),
      dataIndex: 'calculation_type',
      key: 'calculation_type',
      render: (type: string) => {
        const calcConfig = {
          fixed: { color: 'blue', text: t('salary_component.calc_fixed') },
          percentage: { color: 'green', text: t('salary_component.calc_percentage') },
          formula: { color: 'purple', text: t('salary_component.calc_formula') },
        };
        const config = calcConfig[type as keyof typeof calcConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('salary_component.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${amount?.toLocaleString() || 0}
        </Text>
      ),
    },
    {
      title: t('salary_component.percentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => (
        <Text>{percentage ? `${percentage}%` : '-'}</Text>
      ),
    },
    {
      title: t('salary_component.is_taxable'),
      dataIndex: 'is_taxable',
      key: 'is_taxable',
      render: (isTaxable: boolean) => (
        <Tag color={isTaxable ? 'red' : 'green'}>
          {isTaxable ? t('salary_component.taxable') : t('salary_component.non_taxable')}
        </Tag>
      ),
    },
    {
      title: t('salary_component.is_active'),
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'default'}>
          {isActive ? t('salary_component.active') : t('salary_component.inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (text: string, record: SalaryComponent) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            {t('common.delete')}
          </Button>
          <Button
            type="link"
            icon={record.is_active ? <CloseOutlined /> : <CheckOutlined />}
            onClick={() => handleToggleActive(record.id)}
          >
            {record.is_active ? t('salary_component.deactivate') : t('salary_component.activate')}
          </Button>
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const salaryComponentsData = Array.isArray(salaryComponents) ? salaryComponents : ((salaryComponents as any)?.data || []);
  const stats = {
    total: salaryComponentsData.length,
    active: salaryComponentsData.filter((c: any) => c.is_active).length,
    inactive: salaryComponentsData.filter((c: any) => !c.is_active).length,
    allowances: salaryComponentsData.filter((c: any) => c.type === 'allowance').length,
    deductions: salaryComponentsData.filter((c: any) => c.type === 'deduction').length,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderBar />
        
        <div style={{ padding: '24px', flex: 1 }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>{t('common.dashboard')}</Breadcrumb.Item>
            <Breadcrumb.Item>{t('finance.finance')}</Breadcrumb.Item>
            <Breadcrumb.Item>{t('salary_component.salary_component_management')}</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={2}>{t('salary_component.salary_component_management')}</Title>

          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('salary_component.total_components')}
                  value={stats.total}
                  prefix={<AppstoreOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('salary_component.active_components')}
                  value={stats.active}
                  prefix={<CheckOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('salary_component.allowances')}
                  value={stats.allowances}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('salary_component.deductions')}
                  value={stats.deductions}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Actions */}
          <Card style={{ marginBottom: 16 }}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                {t('salary_component.create_component')}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => dispatch(fetchSalaryComponents(filters))}
              >
                {t('common.refresh')}
              </Button>
            </Space>
          </Card>

          {/* Error Alert */}
          {salaryComponentError && (
            <Alert
              message={t('common.error')}
              description={salaryComponentError}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Salary Components Table */}
          <Card>
            <Spin spinning={salaryComponentLoading}>
              <Table
                columns={columns}
                dataSource={salaryComponentsData}
                rowKey="id"
                pagination={{
                  total: salaryComponentsData.length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
                }}
              />
            </Spin>
          </Card>
        </div>
      </div>

      {/* Create Salary Component Modal */}
      <Modal
        title={t('salary_component.create_component')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t('salary_component.name')}
                rules={[{ required: true, message: t('salary_component.name_required') }]}
              >
                <Input placeholder={t('salary_component.enter_name')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label={t('salary_component.code')}
                rules={[{ required: true, message: t('salary_component.code_required') }]}
              >
                <Input placeholder={t('salary_component.enter_code')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={t('salary_component.type')}
                rules={[{ required: true, message: t('salary_component.type_required') }]}
              >
                <Select placeholder={t('salary_component.select_type')}>
                  <Option value="allowance">{t('salary_component.type_allowance')}</Option>
                  <Option value="deduction">{t('salary_component.type_deduction')}</Option>
                  <Option value="bonus">{t('salary_component.type_bonus')}</Option>
                  <Option value="overtime">{t('salary_component.type_overtime')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="calculation_type"
                label={t('salary_component.calculation_type')}
                rules={[{ required: true, message: t('salary_component.calculation_type_required') }]}
              >
                <Select placeholder={t('salary_component.select_calculation_type')}>
                  <Option value="fixed">{t('salary_component.calc_fixed')}</Option>
                  <Option value="percentage">{t('salary_component.calc_percentage')}</Option>
                  <Option value="formula">{t('salary_component.calc_formula')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label={t('salary_component.amount')}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as any}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="percentage" label={t('salary_component.percentage')}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => (value?.replace('%', '') || '0') as any}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="formula" label={t('salary_component.formula')}>
            <Input placeholder={t('salary_component.enter_formula')} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="is_taxable" label={t('salary_component.is_taxable')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_active" label={t('salary_component.is_active')} valuePropName="checked">
                <Switch defaultChecked />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="sort_order" label={t('salary_component.sort_order')}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="description" label={t('common.description')}>
            <TextArea rows={3} placeholder={t('salary_component.enter_description')} />
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

      {/* Edit Salary Component Modal */}
      <Modal
        title={t('salary_component.edit_component')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label={t('salary_component.name')}
                rules={[{ required: true, message: t('salary_component.name_required') }]}
              >
                <Input placeholder={t('salary_component.enter_name')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label={t('salary_component.code')}
                rules={[{ required: true, message: t('salary_component.code_required') }]}
              >
                <Input placeholder={t('salary_component.enter_code')} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label={t('salary_component.type')}
                rules={[{ required: true, message: t('salary_component.type_required') }]}
              >
                <Select placeholder={t('salary_component.select_type')}>
                  <Option value="allowance">{t('salary_component.type_allowance')}</Option>
                  <Option value="deduction">{t('salary_component.type_deduction')}</Option>
                  <Option value="bonus">{t('salary_component.type_bonus')}</Option>
                  <Option value="overtime">{t('salary_component.type_overtime')}</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="calculation_type"
                label={t('salary_component.calculation_type')}
                rules={[{ required: true, message: t('salary_component.calculation_type_required') }]}
              >
                <Select placeholder={t('salary_component.select_calculation_type')}>
                  <Option value="fixed">{t('salary_component.calc_fixed')}</Option>
                  <Option value="percentage">{t('salary_component.calc_percentage')}</Option>
                  <Option value="formula">{t('salary_component.calc_formula')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="amount" label={t('salary_component.amount')}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as any}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="percentage" label={t('salary_component.percentage')}>
                <InputNumber
                  style={{ width: '100%' }}
                  min={0}
                  max={100}
                  formatter={(value) => `${value}%`}
                  parser={(value) => (value?.replace('%', '') || '0') as any}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="formula" label={t('salary_component.formula')}>
            <Input placeholder={t('salary_component.enter_formula')} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="is_taxable" label={t('salary_component.is_taxable')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_active" label={t('salary_component.is_active')} valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="sort_order" label={t('salary_component.sort_order')}>
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item name="description" label={t('common.description')}>
            <TextArea rows={3} placeholder={t('salary_component.enter_description')} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common.save')}
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalaryComponentPage; 