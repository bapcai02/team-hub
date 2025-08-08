import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  InputNumber, 
  Button,
  message,
  Row,
  Col
} from 'antd';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch } from '../../app/store';
import { 
  createContract, 
  updateContract, 
  fetchContractTemplates 
} from '../../features/contract/contractSlice';
import { Contract, ContractTemplate } from '../../features/contract/types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface ContractFormProps {
  visible: boolean;
  contract?: Contract | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const ContractForm: React.FC<ContractFormProps> = ({ 
  visible, 
  contract, 
  onClose, 
  onSuccess 
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { templates, loading } = useSelector((state: RootState) => state.contract);
  const [form] = Form.useForm();
  const isEditing = !!contract;

  useEffect(() => {
    if (visible) {
      dispatch(fetchContractTemplates());
      if (contract) {
        form.setFieldsValue({
          ...contract,
          start_date: contract.start_date ? dayjs(contract.start_date) : undefined,
          end_date: contract.end_date ? dayjs(contract.end_date) : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, contract, form, dispatch]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = {
        ...values,
        start_date: values.start_date?.format('YYYY-MM-DD'),
        end_date: values.end_date?.format('YYYY-MM-DD'),
      };

      if (isEditing && contract) {
        await dispatch(updateContract({ id: contract.id, data: formData })).unwrap();
        message.success(t('contract.updateSuccess'));
      } else {
        await dispatch(createContract(formData)).unwrap();
        message.success(t('contract.createSuccess'));
      }

      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      message.error(t('contract.saveError'));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? t('contract.edit') : t('contract.create')}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: 'draft',
          signature_status: 'unsigned',
          currency: 'USD',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="title"
              label={t('contract.title')}
              rules={[{ required: true, message: t('contract.titleRequired') }]}
            >
              <Input placeholder={t('contract.titlePlaceholder')} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label={t('contract.type')}
              rules={[{ required: true, message: t('contract.typeRequired') }]}
            >
              <Select placeholder={t('contract.typePlaceholder')}>
                <Option value="employment">{t('contract.types.employment')}</Option>
                <Option value="service">{t('contract.types.service')}</Option>
                <Option value="partnership">{t('contract.types.partnership')}</Option>
                <Option value="vendor">{t('contract.types.vendor')}</Option>
                <Option value="client">{t('contract.types.client')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="template_id"
              label={t('contract.template')}
            >
              <Select placeholder={t('contract.templatePlaceholder')} allowClear>
                {templates.map(template => (
                  <Option key={template.id} value={template.id}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label={t('contract.status')}
              rules={[{ required: true, message: t('contract.statusRequired') }]}
            >
              <Select placeholder={t('contract.statusPlaceholder')}>
                <Option value="draft">{t('contract.statuses.draft')}</Option>
                <Option value="pending">{t('contract.statuses.pending')}</Option>
                <Option value="active">{t('contract.statuses.active')}</Option>
                <Option value="expired">{t('contract.statuses.expired')}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_date"
              label={t('contract.startDate')}
              rules={[{ required: true, message: t('contract.startDateRequired') }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder={t('contract.startDatePlaceholder')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_date"
              label={t('contract.endDate')}
              rules={[{ required: true, message: t('contract.endDateRequired') }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder={t('contract.endDatePlaceholder')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="value"
              label={t('contract.value')}
              rules={[{ required: true, message: t('contract.valueRequired') }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder={t('contract.valuePlaceholder')}
                min={0}
                precision={2}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="currency"
              label={t('contract.currency')}
              rules={[{ required: true, message: t('contract.currencyRequired') }]}
            >
              <Select placeholder={t('contract.currencyPlaceholder')}>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="GBP">GBP</Option>
                <Option value="JPY">JPY</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={t('contract.description')}
          rules={[{ required: true, message: t('contract.descriptionRequired') }]}
        >
          <TextArea 
            rows={4} 
            placeholder={t('contract.descriptionPlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="terms"
          label={t('contract.terms')}
        >
          <TextArea 
            rows={3} 
            placeholder={t('contract.termsPlaceholder')}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={handleCancel} style={{ marginRight: 8 }}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? t('common.update') : t('common.create')}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContractForm; 