import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Tooltip,
  Statistic,
  Row,
  Col,
  Breadcrumb,
  Typography,
  Spin,
  Alert,
  Divider,
  Drawer,
  Descriptions,
  List,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { RootState, useAppDispatch } from '../../app/store';
import {
  fetchPayrolls,
  createPayroll,
  updatePayroll,
  deletePayroll,
  approvePayroll,
  markPayrollAsPaid,
  generatePayrolls,
  setSelectedPayroll,
} from '../../features/finance/financeSlice';
import { Payroll, CreatePayrollRequest, UpdatePayrollRequest } from '../../features/finance/types';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const PayrollPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { payrolls, selectedPayroll, payrollLoading, payrollError } = useSelector(
    (state: RootState) => state.finance
  );

  // State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [generateForm] = Form.useForm();

  // Load data
  useEffect(() => {
    dispatch(fetchPayrolls(filters));
  }, [dispatch, filters]);

  // Handle create payroll
  const handleCreate = async (values: any) => {
    try {
      const data: CreatePayrollRequest = {
        employee_id: values.employee_id,
        pay_period_start: values.pay_period[0].format('YYYY-MM-DD'),
        pay_period_end: values.pay_period[1].format('YYYY-MM-DD'),
        basic_salary: values.basic_salary,
        working_days: values.working_days,
        overtime_hours: values.overtime_hours || 0,
        bonus: values.bonus || 0,
        notes: values.notes,
      };
      await dispatch(createPayroll(data)).unwrap();
      message.success(t('payroll.created_successfully'));
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || t('payroll.creation_failed'));
    }
  };

  // Handle update payroll
  const handleUpdate = async (values: any) => {
    if (!selectedPayroll || !selectedPayroll.id || selectedPayroll.id <= 0) {
      message.error('Invalid payroll selected');
      return;
    }
    try {
      const data: UpdatePayrollRequest = {
        basic_salary: values.basic_salary,
        working_days: values.working_days,
        overtime_hours: values.overtime_hours || 0,
        bonus: values.bonus || 0,
        notes: values.notes,
      };
      await dispatch(updatePayroll({ id: selectedPayroll.id, data })).unwrap();
      message.success(t('payroll.updated_successfully'));
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('payroll.update_failed'));
    }
  };

  // Handle delete payroll
  const handleDelete = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid payroll ID');
      return;
    }
    try {
      await dispatch(deletePayroll(id)).unwrap();
      message.success(t('payroll.deleted_successfully'));
    } catch (error: any) {
      message.error(error.message || t('payroll.deletion_failed'));
    }
  };

  // Handle approve payroll
  const handleApprove = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid payroll ID');
      return;
    }
    try {
      await dispatch(approvePayroll(id)).unwrap();
      message.success(t('payroll.approved_successfully'));
    } catch (error: any) {
      message.error(error.message || t('payroll.approval_failed'));
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid payroll ID');
      return;
    }
    try {
      await dispatch(markPayrollAsPaid(id)).unwrap();
      message.success(t('payroll.marked_as_paid_successfully'));
    } catch (error: any) {
      message.error(error.message || t('payroll.payment_failed'));
    }
  };

  // Handle generate payrolls
  const handleGenerate = async (values: any) => {
    try {
      const data = {
        employee_ids: values.employee_ids,
        pay_period_start: values.pay_period[0].format('YYYY-MM-DD'),
        pay_period_end: values.pay_period[1].format('YYYY-MM-DD'),
      };
      await dispatch(generatePayrolls(data)).unwrap();
      message.success(t('payroll.generated_successfully'));
      setGenerateModalVisible(false);
      generateForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('payroll.generation_failed'));
    }
  };

  // Handle view details
  const handleViewDetails = (record: Payroll) => {
    dispatch(setSelectedPayroll(record));
    setDetailDrawerVisible(true);
  };

  // Handle edit
  const handleEdit = (record: Payroll) => {
    dispatch(setSelectedPayroll(record));
    editForm.setFieldsValue({
      basic_salary: record.basic_salary,
      working_days: record.working_days,
      overtime_hours: record.overtime_hours,
      bonus: record.bonus,
      notes: record.notes,
    });
    setEditModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: t('payroll.code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: t('payroll.employee'),
      dataIndex: ['employee', 'name'],
      key: 'employee',
      render: (name: string, record: Payroll) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.employee?.position}
          </Text>
        </div>
      ),
    },
    {
      title: t('payroll.pay_period'),
      key: 'pay_period',
      render: (record: Payroll) => (
        <div>
          <Text>{record.pay_period_start}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            to {record.pay_period_end}
          </Text>
        </div>
      ),
    },
    {
      title: t('payroll.basic_salary'),
      dataIndex: 'basic_salary',
      key: 'basic_salary',
      render: (amount: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: t('payroll.net_salary'),
      dataIndex: 'net_salary',
      key: 'net_salary',
      render: (amount: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: t('payroll.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          draft: { color: 'default', text: t('payroll.status_draft') },
          approved: { color: 'processing', text: t('payroll.status_approved') },
          paid: { color: 'success', text: t('payroll.status_paid') },
          cancelled: { color: 'error', text: t('payroll.status_cancelled') },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (record: Payroll) => (
        <Space>
          <Tooltip title={t('common.view_details')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <>
              <Tooltip title={t('common.edit')}>
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title={t('common.delete')}>
                <Popconfirm
                  title={t('common.confirm_delete')}
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Tooltip>
            </>
          )}
          {record.status === 'draft' && (
            <Tooltip title={t('payroll.approve')}>
              <Button
                type="text"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              />
            </Tooltip>
          )}
          {record.status === 'approved' && (
            <Tooltip title={t('payroll.mark_as_paid')}>
              <Button
                type="text"
                icon={<DollarOutlined />}
                onClick={() => handleMarkAsPaid(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Calculate statistics
  const payrollsData = Array.isArray(payrolls) ? payrolls : ((payrolls as any)?.data || []);
  const stats = {
    total: payrollsData.length,
    totalAmount: payrollsData.reduce((sum: number, p: any) => sum + p.net_salary, 0),
    pending: payrollsData.filter((p: any) => p.status === 'draft').length,
    approved: payrollsData.filter((p: any) => p.status === 'approved').length,
    paid: payrollsData.filter((p: any) => p.status === 'paid').length,
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
            <Breadcrumb.Item>{t('payroll.payroll_management')}</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={2}>{t('payroll.payroll_management')}</Title>

          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('payroll.total_payrolls')}
                  value={stats.total}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('payroll.total_amount')}
                  value={stats.totalAmount}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  formatter={(value) => `$${value?.toLocaleString()}`}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('payroll.pending')}
                  value={stats.pending}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('payroll.paid')}
                  value={stats.paid}
                  prefix={<CheckOutlined />}
                  valueStyle={{ color: '#52c41a' }}
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
                {t('payroll.create_payroll')}
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={() => setGenerateModalVisible(true)}
              >
                {t('payroll.generate_payrolls')}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => dispatch(fetchPayrolls(filters))}
              >
                {t('common.refresh')}
              </Button>
            </Space>
          </Card>

          {/* Error Alert */}
          {payrollError && (
            <Alert
              message={t('common.error')}
              description={payrollError}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Payroll Table */}
          <Card>
            <Spin spinning={payrollLoading}>
              <Table
                columns={columns}
                dataSource={payrollsData}
                rowKey="id"
                pagination={{
                  total: payrollsData.length,
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

      {/* Create Payroll Modal */}
      <Modal
        title={t('payroll.create_payroll')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employee_id"
                label={t('payroll.employee')}
                rules={[{ required: true, message: t('payroll.employee_required') }]}
              >
                <Select placeholder={t('payroll.select_employee')}>
                  <Option value={1}>John Doe</Option>
                  <Option value={2}>Jane Smith</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="pay_period"
                label={t('payroll.pay_period')}
                rules={[{ required: true, message: t('payroll.pay_period_required') }]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="basic_salary"
                label={t('payroll.basic_salary')}
                rules={[{ required: true, message: t('payroll.basic_salary_required') }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as any}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="working_days"
                label={t('payroll.working_days')}
                rules={[{ required: true, message: t('payroll.working_days_required') }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} max={31} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="overtime_hours" label={t('payroll.overtime_hours')}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bonus" label={t('payroll.bonus')}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as any}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label={t('common.notes')}>
            <TextArea rows={3} />
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

      {/* Edit Payroll Modal */}
      <Modal
        title={t('payroll.edit_payroll')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="basic_salary"
                label={t('payroll.basic_salary')}
                rules={[{ required: true, message: t('payroll.basic_salary_required') }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as any}
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="working_days"
                label={t('payroll.working_days')}
                rules={[{ required: true, message: t('payroll.working_days_required') }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} max={31} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="overtime_hours" label={t('payroll.overtime_hours')}>
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bonus" label={t('payroll.bonus')}>
                <InputNumber
                  style={{ width: '100%' }}
                  formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => (value?.replace(/\$\s?|(,*)/g, '') || '0') as any}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label={t('common.notes')}>
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('common.update')}
              </Button>
              <Button onClick={() => setEditModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Generate Payrolls Modal */}
      <Modal
        title={t('payroll.generate_payrolls')}
        open={generateModalVisible}
        onCancel={() => setGenerateModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={generateForm} layout="vertical" onFinish={handleGenerate}>
          <Form.Item
            name="employee_ids"
            label={t('payroll.employees')}
            rules={[{ required: true, message: t('payroll.employees_required') }]}
          >
            <Select
              mode="multiple"
              placeholder={t('payroll.select_employees')}
              style={{ width: '100%' }}
            >
              <Option value={1}>John Doe</Option>
              <Option value={2}>Jane Smith</Option>
              <Option value={3}>Mike Johnson</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="pay_period"
            label={t('payroll.pay_period')}
            rules={[{ required: true, message: t('payroll.pay_period_required') }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('payroll.generate')}
              </Button>
              <Button onClick={() => setGenerateModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payroll Details Drawer */}
      <Drawer
        title={t('payroll.payroll_details')}
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedPayroll && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label={t('payroll.code')}>
                <Badge status="processing" text={selectedPayroll.code} />
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.employee')}>
                {selectedPayroll.employee?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.pay_period')}>
                {selectedPayroll.pay_period_start} - {selectedPayroll.pay_period_end}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.basic_salary')}>
                ${selectedPayroll.basic_salary.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.gross_salary')}>
                ${selectedPayroll.gross_salary.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.net_salary')}>
                <Text strong style={{ color: '#1890ff' }}>
                  ${selectedPayroll.net_salary.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.total_allowances')}>
                ${selectedPayroll.total_allowances.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.total_deductions')}>
                ${selectedPayroll.total_deductions.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.overtime_pay')}>
                ${selectedPayroll.overtime_pay.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.tax_amount')}>
                ${selectedPayroll.tax_amount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.insurance_amount')}>
                ${selectedPayroll.insurance_amount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.working_days')}>
                {selectedPayroll.working_days} days
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.overtime_hours')}>
                {selectedPayroll.overtime_hours} hours
              </Descriptions.Item>
              <Descriptions.Item label={t('payroll.status')}>
                <Tag color={
                  selectedPayroll.status === 'draft' ? 'default' :
                  selectedPayroll.status === 'approved' ? 'processing' :
                  selectedPayroll.status === 'paid' ? 'success' : 'error'
                }>
                  {t(`payroll.status_${selectedPayroll.status}`)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedPayroll.items && selectedPayroll.items.length > 0 && (
              <>
                <Divider>{t('payroll.salary_components')}</Divider>
                <List
                  dataSource={selectedPayroll.items}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.component_name}
                        description={
                          <Space>
                            <Tag color={
                              item.type === 'allowance' ? 'green' :
                              item.type === 'deduction' ? 'red' :
                              item.type === 'bonus' ? 'blue' : 'orange'
                            }>
                              {t(`payroll.type_${item.type}`)}
                            </Tag>
                            <Text type="secondary">
                              {item.quantity} x ${item.rate.toLocaleString()}
                            </Text>
                          </Space>
                        }
                      />
                      <div>
                        <Text strong style={{
                          color: item.type === 'deduction' ? '#ff4d4f' : '#52c41a'
                        }}>
                          {item.type === 'deduction' ? '-' : '+'}${item.amount.toLocaleString()}
                        </Text>
                      </div>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default PayrollPage; 