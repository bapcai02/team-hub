import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Space,
  DatePicker,
  Switch,
  Row,
  Col,
  message,
  Tabs,
  Tag,
} from 'antd';
import {
  SendOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { RootState } from '../../app/store';
import {
  sendNotification,
  sendTemplateNotification,
  fetchNotificationTemplates,
  fetchNotificationOptions,
} from '../../features/notifications/notificationSlice';
import { SendNotificationRequest, SendTemplateNotificationRequest } from '../../features/notifications/api';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface SendNotificationFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const SendNotificationForm: React.FC<SendNotificationFormProps> = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [templateForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templateData, setTemplateData] = useState<Record<string, any>>({});

  const {
    templates,
    templatesLoading,
    categories,
    channels,
    priorities,
  } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationTemplates() as any);
    dispatch(fetchNotificationOptions() as any);
  }, [dispatch]);

  const handleSendNotification = async (values: any) => {
    setLoading(true);
    try {
      const notificationData: SendNotificationRequest = {
        title: values.title,
        message: values.message,
        recipients: values.recipients,
        type: values.type,
        priority: values.priority || 'normal',
        category: values.category,
        action_url: values.action_url,
        scheduled_at: values.scheduled_at?.toISOString(),
        data: values.data ? JSON.parse(values.data) : undefined,
      };

      await dispatch(sendNotification(notificationData) as any);
      message.success(t('notifications.send.success'));
      form.resetFields();
      onSuccess?.();
    } catch (error) {
      const errorMessage = t('notifications.send.error');
      message.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTemplateNotification = async (values: any) => {
    if (!selectedTemplate) {
      const errorMessage = t('notifications.send.selectTemplate');
      message.error(errorMessage);
      onError?.(errorMessage);
      return;
    }

    setLoading(true);
    try {
      const notificationData: SendTemplateNotificationRequest = {
        template_name: selectedTemplate.name,
        recipients: values.recipients,
        data: templateData,
      };

      await dispatch(sendTemplateNotification(notificationData) as any);
      message.success(t('notifications.send.templateSuccess'));
      templateForm.resetFields();
      setSelectedTemplate(null);
      setTemplateData({});
      onSuccess?.();
    } catch (error) {
      const errorMessage = t('notifications.send.templateError');
      message.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateId: number) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template);
    setTemplateData({});
  };

  const handleTemplateDataChange = (key: string, value: any) => {
    setTemplateData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderTemplateVariables = () => {
    if (!selectedTemplate?.variables) return null;

    return (
      <Card size="small" title={t('notifications.send.templateVariables')}>
        <Row gutter={[16, 16]}>
          {selectedTemplate.variables.map((variable: any) => (
            <Col xs={24} md={12} key={variable.key}>
              <div>
                <Text strong>
                  {variable.label}
                  {variable.required && <Text type="danger"> *</Text>}
                </Text>
                <Input
                  placeholder={variable.default || `Enter ${variable.label}`}
                  value={templateData[variable.key] || ''}
                  onChange={(e) => handleTemplateDataChange(variable.key, e.target.value)}
                  style={{ marginTop: 4 }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    let title = selectedTemplate.title_template;
    let message = selectedTemplate.message_template;

    // Replace variables with actual data
    selectedTemplate.variables?.forEach((variable: any) => {
      const value = templateData[variable.key] || variable.default || `{${variable.key}}`;
      title = title.replace(new RegExp(`{{${variable.key}}}`, 'g'), value);
      message = message.replace(new RegExp(`{{${variable.key}}}`, 'g'), value);
    });

    return (
      <Card size="small" title={t('notifications.send.preview')}>
        <div style={{ marginBottom: 8 }}>
          <Text strong>{t('notifications.send.title')}: </Text>
          <Text>{title}</Text>
        </div>
        <div>
          <Text strong>{t('notifications.send.message')}: </Text>
          <Text>{message}</Text>
        </div>
        <div style={{ marginTop: 8 }}>
          <Space>
            <Tag color="blue">{categories[selectedTemplate.category]}</Tag>
            <Tag color="green">{priorities[selectedTemplate.priority]}</Tag>
            {selectedTemplate.channels?.map((channel: string) => (
              <Tag key={channel}>{channels[channel]}</Tag>
            ))}
          </Space>
        </div>
      </Card>
    );
  };

  return (
    <Card>
      <Title level={4}>
        <SendOutlined style={{ marginRight: 8 }} />
        {t('notifications.send.title')}
      </Title>

      <Tabs 
        defaultActiveKey="custom"
        items={[
          {
            key: 'custom',
            label: (
              <span>
                <SettingOutlined />
                {t('notifications.send.customNotification')}
              </span>
            ),
            children: (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSendNotification}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="title"
                  label={t('notifications.send.title')}
                  rules={[{ required: true, message: t('notifications.send.titleRequired') }]}
                >
                  <Input placeholder={t('notifications.send.titlePlaceholder')} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="recipients"
                  label={t('notifications.send.recipients')}
                  rules={[{ required: true, message: t('notifications.send.recipientsRequired') }]}
                >
                  <Select
                    mode="tags"
                    placeholder={t('notifications.send.recipientsPlaceholder')}
                    tokenSeparators={[',']}
                  >
                    {/* You can populate this with actual users */}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="message"
                  label={t('notifications.send.message')}
                  rules={[{ required: true, message: t('notifications.send.messageRequired') }]}
                >
                  <TextArea 
                    rows={4} 
                    placeholder={t('notifications.send.messagePlaceholder')} 
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="category"
                  label={t('notifications.send.category')}
                >
                  <Select placeholder={t('notifications.send.selectCategory')}>
                    {Object.entries(categories).map(([key, label]) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="priority"
                  label={t('notifications.send.priority')}
                >
                  <Select placeholder={t('notifications.send.selectPriority')} defaultValue="normal">
                    {Object.entries(priorities).map(([key, label]) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  name="type"
                  label={t('notifications.send.type')}
                >
                  <Select placeholder={t('notifications.send.selectType')} defaultValue="in_app">
                    {Object.entries(channels).map(([key, label]) => (
                      <Option key={key} value={key}>{label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="action_url"
                  label={t('notifications.send.actionUrl')}
                >
                  <Input placeholder={t('notifications.send.actionUrlPlaceholder')} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="scheduled_at"
                  label={t('notifications.send.scheduledAt')}
                >
                  <DatePicker 
                    showTime 
                    placeholder={t('notifications.send.selectDateTime')}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="data"
                  label={t('notifications.send.additionalData')}
                  help={t('notifications.send.dataHelp')}
                >
                  <TextArea 
                    rows={3}
                    placeholder='{"key": "value"}'
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                <SendOutlined />
                {t('notifications.send.sendNotification')}
              </Button>
            </Form.Item>
          </Form>
            ),
          },
          {
            key: 'template',
            label: (
              <span>
                <FileTextOutlined />
                {t('notifications.send.templateNotification')}
              </span>
            ),
            children: (
          <Form
            form={templateForm}
            layout="vertical"
            onFinish={handleSendTemplateNotification}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="template_id"
                  label={t('notifications.send.selectTemplate')}
                  rules={[{ required: true, message: t('notifications.send.templateRequired') }]}
                >
                  <Select 
                    placeholder={t('notifications.send.selectTemplatePlaceholder')}
                    loading={templatesLoading}
                    onChange={handleTemplateSelect}
                  >
                    {templates.map(template => (
                      <Option key={template.id} value={template.id}>
                        <Space>
                          <Text strong>{template.name}</Text>
                          <Tag>{categories[template.category]}</Tag>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="recipients"
                  label={t('notifications.send.recipients')}
                  rules={[{ required: true, message: t('notifications.send.recipientsRequired') }]}
                >
                  <Select
                    mode="tags"
                    placeholder={t('notifications.send.recipientsPlaceholder')}
                    tokenSeparators={[',']}
                  >
                    {/* You can populate this with actual users */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {selectedTemplate && (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {renderTemplateVariables()}
                {renderTemplatePreview()}
              </Space>
            )}

            <Form.Item style={{ marginTop: 24 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                disabled={!selectedTemplate}
              >
                <SendOutlined />
                {t('notifications.send.sendTemplateNotification')}
              </Button>
            </Form.Item>
          </Form>
            ),
          },
        ]}
      />
    </Card>
  );
};

export default SendNotificationForm;