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
  Upload,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined,
  ReloadOutlined,
  UploadOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import { RootState, useAppDispatch } from '../../app/store';
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
  rejectExpense,
  markExpenseAsPaid,
  fetchExpenseStats,
  setSelectedExpense,
} from '../../features/finance/financeSlice';
import { Expense, CreateExpenseRequest, UpdateExpenseRequest, RejectExpenseRequest } from '../../features/finance/types';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ExpensePage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { expenses, selectedExpense, expenseLoading, expenseError, expenseStats } = useSelector(
    (state: RootState) => state.finance
  );

  // State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [rejectForm] = Form.useForm();

  // Load data
  useEffect(() => {
    dispatch(fetchExpenses(filters));
    dispatch(fetchExpenseStats(filters));
  }, [dispatch, filters]);

  // Handle create expense
  const handleCreate = async (values: any) => {
    try {
      const data: CreateExpenseRequest = {
        title: values.title,
        description: values.description,
        amount: values.amount,
        type: values.type,
        expense_date: values.expense_date.format('YYYY-MM-DD'),
        due_date: values.due_date?.format('YYYY-MM-DD'),
        employee_id: values.employee_id,
        department_id: values.department_id,
        receipt_file: values.receipt_file,
        attachments: values.attachments,
      };
      await dispatch(createExpense(data)).unwrap();
      message.success(t('expense.created_successfully'));
      setCreateModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || t('expense.creation_failed'));
    }
  };

  // Handle update expense
  const handleUpdate = async (values: any) => {
    if (!selectedExpense || !selectedExpense.id || selectedExpense.id <= 0) {
      message.error('Invalid expense selected');
      return;
    }
    try {
      const data: UpdateExpenseRequest = {
        title: values.title,
        description: values.description,
        amount: values.amount,
        type: values.type,
        expense_date: values.expense_date?.format('YYYY-MM-DD'),
        due_date: values.due_date?.format('YYYY-MM-DD'),
        department_id: values.department_id,
        receipt_file: values.receipt_file,
        attachments: values.attachments,
      };
      await dispatch(updateExpense({ id: selectedExpense.id, data })).unwrap();
      message.success(t('expense.updated_successfully'));
      setEditModalVisible(false);
      editForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('expense.update_failed'));
    }
  };

  // Handle delete expense
  const handleDelete = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid expense ID');
      return;
    }
    try {
      await dispatch(deleteExpense(id)).unwrap();
      message.success(t('expense.deleted_successfully'));
    } catch (error: any) {
      message.error(error.message || t('expense.deletion_failed'));
    }
  };

  // Handle approve expense
  const handleApprove = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid expense ID');
      return;
    }
    try {
      await dispatch(approveExpense(id)).unwrap();
      message.success(t('expense.approved_successfully'));
    } catch (error: any) {
      message.error(error.message || t('expense.approval_failed'));
    }
  };

  // Handle reject expense
  const handleReject = async (values: any) => {
    if (!selectedExpense || !selectedExpense.id || selectedExpense.id <= 0) {
      message.error('Invalid expense selected');
      return;
    }
    try {
      const data: RejectExpenseRequest = {
        rejection_reason: values.rejection_reason,
      };
      await dispatch(rejectExpense({ id: selectedExpense.id, data })).unwrap();
      message.success(t('expense.rejected_successfully'));
      setRejectModalVisible(false);
      rejectForm.resetFields();
    } catch (error: any) {
      message.error(error.message || t('expense.rejection_failed'));
    }
  };

  // Handle mark as paid
  const handleMarkAsPaid = async (id: number) => {
    if (!id || id <= 0) {
      message.error('Invalid expense ID');
      return;
    }
    try {
      await dispatch(markExpenseAsPaid(id)).unwrap();
      message.success(t('expense.marked_as_paid_successfully'));
    } catch (error: any) {
      message.error(error.message || t('expense.payment_failed'));
    }
  };

  // Handle view details
  const handleViewDetails = (record: Expense) => {
    dispatch(setSelectedExpense(record));
    setDetailDrawerVisible(true);
  };

  // Handle edit
  const handleEdit = (record: Expense) => {
    dispatch(setSelectedExpense(record));
    editForm.setFieldsValue({
      title: record.title,
      description: record.description,
      amount: record.amount,
      type: record.type,
      expense_date: record.expense_date ? moment(record.expense_date) : null,
      due_date: record.due_date ? moment(record.due_date) : null,
      department_id: record.department_id,
    });
    setEditModalVisible(true);
  };

  // Handle reject modal
  const handleRejectModal = (record: Expense) => {
    dispatch(setSelectedExpense(record));
    setRejectModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: t('expense.code'),
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Text strong>{code}</Text>,
    },
    {
      title: t('expense.title'),
      dataIndex: 'title',
      key: 'title',
      render: (title: string) => <Text strong>{title}</Text>,
    },
    {
      title: t('expense.employee'),
      dataIndex: ['employee', 'name'],
      key: 'employee',
      render: (name: string, record: Expense) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.department?.name}
          </Text>
        </div>
      ),
    },
    {
      title: t('expense.amount'),
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#ff4d4f' }}>
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: t('expense.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeConfig = {
          operational: { color: 'blue', text: t('expense.type_operational') },
          administrative: { color: 'green', text: t('expense.type_administrative') },
          marketing: { color: 'orange', text: t('expense.type_marketing') },
          travel: { color: 'purple', text: t('expense.type_travel') },
          utilities: { color: 'cyan', text: t('expense.type_utilities') },
          maintenance: { color: 'geekblue', text: t('expense.type_maintenance') },
          other: { color: 'default', text: t('expense.type_other') },
        };
        const config = typeConfig[type as keyof typeof typeConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('expense.expense_date'),
      dataIndex: 'expense_date',
      key: 'expense_date',
      render: (date: string) => <Text>{date}</Text>,
    },
    {
      title: t('expense.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          pending: { color: 'default', text: t('expense.status_pending') },
          approved: { color: 'processing', text: t('expense.status_approved') },
          rejected: { color: 'error', text: t('expense.status_rejected') },
          paid: { color: 'success', text: t('expense.status_paid') },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (record: Expense) => (
        <Space>
          <Tooltip title={t('common.view_details')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
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
              <Tooltip title={t('expense.approve')}>
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  onClick={() => handleApprove(record.id)}
                />
              </Tooltip>
              <Tooltip title={t('expense.reject')}>
                <Button
                  type="text"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => handleRejectModal(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'approved' && (
            <Tooltip title={t('expense.mark_as_paid')}>
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
  const expensesData = Array.isArray(expenses) ? expenses : ((expenses as any)?.data || []);
  const stats = {
    total: expensesData.length,
    totalAmount: expensesData.reduce((sum: number, expense: any) => sum + expense.amount, 0),
    pending: expensesData.filter((e: any) => e.status === 'pending').length,
    approved: expensesData.filter((e: any) => e.status === 'approved').length,
    paid: expensesData.filter((e: any) => e.status === 'paid').length,
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
            <Breadcrumb.Item>{t('expense.expense_management')}</Breadcrumb.Item>
          </Breadcrumb>

          <Title level={2}>{t('expense.expense_management')}</Title>

          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('expense.total_expenses')}
                  value={stats.total}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('expense.total_amount')}
                  value={stats.totalAmount}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                  formatter={(value) => `$${value?.toLocaleString()}`}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('expense.pending')}
                  value={stats.pending}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={t('expense.paid')}
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
                {t('expense.create_expense')}
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => dispatch(fetchExpenses(filters))}
              >
                {t('common.refresh')}
              </Button>
            </Space>
          </Card>

          {/* Error Alert */}
          {expenseError && (
            <Alert
              message={t('common.error')}
              description={expenseError}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Expense Table */}
          <Card>
            <Spin spinning={expenseLoading}>
              <Table
                columns={columns}
                dataSource={expensesData}
                rowKey="id"
                pagination={{
                  total: expensesData.length,
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

      {/* Create Expense Modal */}
      <Modal
        title={t('expense.create_expense')}
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label={t('expense.title')}
                rules={[{ required: true, message: t('expense.title_required') }]}
              >
                <Input placeholder={t('expense.enter_title')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label={t('expense.type')}
                rules={[{ required: true, message: t('expense.type_required') }]}
              >
                <Select placeholder={t('expense.select_type')}>
                  <Option value="operational">{t('expense.type_operational')}</Option>
                  <Option value="administrative">{t('expense.type_administrative')}</Option>
                  <Option value="marketing">{t('expense.type_marketing')}</Option>
                  <Option value="travel">{t('expense.type_travel')}</Option>
                  <Option value="utilities">{t('expense.type_utilities')}</Option>
                  <Option value="maintenance">{t('expense.type_maintenance')}</Option>
                  <Option value="other">{t('expense.type_other')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label={t('expense.amount')}
                rules={[{ required: true, message: t('expense.amount_required') }]}
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
                name="expense_date"
                label={t('expense.expense_date')}
                rules={[{ required: true, message: t('expense.expense_date_required') }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="employee_id"
                label={t('expense.employee')}
                rules={[{ required: true, message: t('expense.employee_required') }]}
              >
                <Select placeholder={t('expense.select_employee')}>
                  <Option value={1}>John Doe</Option>
                  <Option value={2}>Jane Smith</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="department_id" label={t('expense.department')}>
                <Select placeholder={t('expense.select_department')}>
                  <Option value={1}>IT Department</Option>
                  <Option value={2}>HR Department</Option>
                  <Option value={3}>Marketing Department</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="due_date" label={t('expense.due_date')}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label={t('common.description')}>
            <TextArea rows={3} placeholder={t('expense.enter_description')} />
          </Form.Item>
          <Form.Item name="receipt_file" label={t('expense.receipt')}>
            <Upload>
              <Button icon={<UploadOutlined />}>{t('expense.upload_receipt')}</Button>
            </Upload>
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

      {/* Edit Expense Modal */}
      <Modal
        title={t('expense.edit_expense')}
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label={t('expense.title')}
                rules={[{ required: true, message: t('expense.title_required') }]}
              >
                <Input placeholder={t('expense.enter_title')} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label={t('expense.type')}
                rules={[{ required: true, message: t('expense.type_required') }]}
              >
                <Select placeholder={t('expense.select_type')}>
                  <Option value="operational">{t('expense.type_operational')}</Option>
                  <Option value="administrative">{t('expense.type_administrative')}</Option>
                  <Option value="marketing">{t('expense.type_marketing')}</Option>
                  <Option value="travel">{t('expense.type_travel')}</Option>
                  <Option value="utilities">{t('expense.type_utilities')}</Option>
                  <Option value="maintenance">{t('expense.type_maintenance')}</Option>
                  <Option value="other">{t('expense.type_other')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="amount"
                label={t('expense.amount')}
                rules={[{ required: true, message: t('expense.amount_required') }]}
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
              <Form.Item name="department_id" label={t('expense.department')}>
                <Select placeholder={t('expense.select_department')}>
                  <Option value={1}>IT Department</Option>
                  <Option value={2}>HR Department</Option>
                  <Option value={3}>Marketing Department</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label={t('common.description')}>
            <TextArea rows={3} placeholder={t('expense.enter_description')} />
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

      {/* Reject Expense Modal */}
      <Modal
        title={t('expense.reject_expense')}
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form form={rejectForm} layout="vertical" onFinish={handleReject}>
          <Form.Item
            name="rejection_reason"
            label={t('expense.rejection_reason')}
            rules={[{ required: true, message: t('expense.rejection_reason_required') }]}
          >
            <TextArea rows={4} placeholder={t('expense.enter_rejection_reason')} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" danger htmlType="submit">
                {t('expense.reject')}
              </Button>
              <Button onClick={() => setRejectModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Expense Details Drawer */}
      <Drawer
        title={t('expense.expense_details')}
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedExpense && (
          <div>
            <Descriptions column={1} bordered>
              <Descriptions.Item label={t('expense.code')}>
                <Text strong>{selectedExpense.code}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.title')}>
                {selectedExpense.title}
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.description')}>
                {selectedExpense.description || t('common.no_description')}
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.amount')}>
                <Text strong style={{ color: '#ff4d4f' }}>
                  ${selectedExpense.amount.toLocaleString()}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.type')}>
                <Tag color={
                  selectedExpense.type === 'operational' ? 'blue' :
                  selectedExpense.type === 'administrative' ? 'green' :
                  selectedExpense.type === 'marketing' ? 'orange' :
                  selectedExpense.type === 'travel' ? 'purple' :
                  selectedExpense.type === 'utilities' ? 'cyan' :
                  selectedExpense.type === 'maintenance' ? 'geekblue' : 'default'
                }>
                  {t(`expense.type_${selectedExpense.type}`)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.employee')}>
                {selectedExpense.employee?.name}
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.department')}>
                {selectedExpense.department?.name || t('common.not_assigned')}
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.expense_date')}>
                {selectedExpense.expense_date}
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.due_date')}>
                {selectedExpense.due_date || t('common.no_due_date')}
              </Descriptions.Item>
              <Descriptions.Item label={t('expense.status')}>
                <Tag color={
                  selectedExpense.status === 'pending' ? 'default' :
                  selectedExpense.status === 'approved' ? 'processing' :
                  selectedExpense.status === 'rejected' ? 'error' : 'success'
                }>
                  {t(`expense.status_${selectedExpense.status}`)}
                </Tag>
              </Descriptions.Item>
              {selectedExpense.rejection_reason && (
                <Descriptions.Item label={t('expense.rejection_reason')}>
                  <Text type="danger">{selectedExpense.rejection_reason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ExpensePage; 