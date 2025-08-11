import React, { useState } from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Button, Space, Typography, Select, Card, Tag } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Event {
  id?: string;
  title: string;
  description?: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  location?: string;
  attendees: string[];
  type: 'meeting' | 'reminder' | 'deadline' | 'social';
}

interface EventSchedulerProps {
  visible: boolean;
  onClose: () => void;
  onSendEvent: (event: Event) => void;
  availableUsers: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

const EventScheduler: React.FC<EventSchedulerProps> = ({
  visible,
  onClose,
  onSendEvent,
  availableUsers
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const eventTypes = [
    { value: 'meeting', label: t('chat.event.meeting', 'Meeting'), color: '#1890ff' },
    { value: 'reminder', label: t('chat.event.reminder', 'Reminder'), color: '#52c41a' },
    { value: 'deadline', label: t('chat.event.deadline', 'Deadline'), color: '#faad14' },
    { value: 'social', label: t('chat.event.social', 'Social'), color: '#722ed1' }
  ];

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const event: Event = {
        ...values,
        startDate: values.startDate,
        endDate: values.endDate || values.startDate.add(1, 'hour'),
        attendees: values.attendees || []
      };
      
      await onSendEvent(event);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarOutlined style={{ color: '#1890ff' }} />
          <span>{t('chat.event.scheduleEvent', 'Schedule Event')}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'meeting',
          startDate: dayjs(),
          endDate: dayjs().add(1, 'hour')
        }}
      >
        {/* Event Type */}
        <Form.Item
          name="type"
          label={t('chat.event.type', 'Event Type')}
          rules={[{ required: true, message: t('chat.event.typeRequired', 'Please select event type') }]}
        >
          <Select>
            {eventTypes.map(type => (
              <Option key={type.value} value={type.value}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: type.color
                  }} />
                  {type.label}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Event Title */}
        <Form.Item
          name="title"
          label={t('chat.event.title', 'Event Title')}
          rules={[{ required: true, message: t('chat.event.titleRequired', 'Please enter event title') }]}
        >
          <Input
            placeholder={t('chat.event.titlePlaceholder', 'Enter event title')}
            maxLength={100}
            showCount
          />
        </Form.Item>

        {/* Event Description */}
        <Form.Item
          name="description"
          label={t('chat.event.description', 'Description')}
        >
          <TextArea
            placeholder={t('chat.event.descriptionPlaceholder', 'Enter event description (optional)')}
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        {/* Date and Time */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="startDate"
            label={t('chat.event.startDate', 'Start Date & Time')}
            rules={[{ required: true, message: t('chat.event.startDateRequired', 'Please select start date') }]}
            style={{ flex: 1 }}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={t('chat.event.startDatePlaceholder', 'Select start date')}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label={t('chat.event.endDate', 'End Date & Time')}
            style={{ flex: 1 }}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={t('chat.event.endDatePlaceholder', 'Select end date')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>

        {/* Location */}
        <Form.Item
          name="location"
          label={t('chat.event.location', 'Location')}
        >
          <Input
            placeholder={t('chat.event.locationPlaceholder', 'Enter location (optional)')}
            prefix={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}
            maxLength={200}
          />
        </Form.Item>

        {/* Attendees */}
        <Form.Item
          name="attendees"
          label={t('chat.event.attendees', 'Attendees')}
        >
          <Select
            mode="multiple"
            placeholder={t('chat.event.attendeesPlaceholder', 'Select attendees')}
            optionFilterProp="children"
            showSearch
            style={{ width: '100%' }}
          >
            {availableUsers.map(user => (
              <Option key={user.id} value={user.id.toString()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserOutlined />
                  <span>{user.name}</span>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    ({user.email})
                  </Text>
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Event Preview */}
        <Form.Item label={t('chat.event.preview', 'Event Preview')}>
          <Card size="small" style={{ backgroundColor: '#f8f9fa' }}>
            <Form.Item shouldUpdate>
              {() => {
                const values = form.getFieldsValue();
                const selectedType = eventTypes.find(t => t.value === values.type);
                
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Tag color={selectedType?.color}>
                        {selectedType?.label}
                      </Tag>
                      <Text strong>{values.title || t('chat.event.noTitle', 'No title')}</Text>
                    </div>
                    
                    {values.description && (
                      <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                        {values.description}
                      </Text>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#666' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ClockCircleOutlined />
                        {values.startDate ? values.startDate.format('MMM DD, YYYY HH:mm') : t('chat.event.noDate', 'No date')}
                      </div>
                      
                      {values.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <EnvironmentOutlined />
                          {values.location}
                        </div>
                      )}
                    </div>
                    
                    {values.attendees && values.attendees.length > 0 && (
                      <div style={{ marginTop: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {t('chat.event.attendeesCount', '{{count}} attendees', { count: values.attendees.length })}
                        </Text>
                      </div>
                    )}
                  </div>
                );
              }}
            </Form.Item>
          </Card>
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<CalendarOutlined />}
            >
              {t('chat.event.schedule', 'Schedule Event')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EventScheduler; 