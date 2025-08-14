import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Switch, Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { CalendarEvent, CreateCalendarEventRequest } from '../../features/calendar/types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface CreateEventModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateCalendarEventRequest) => void;
  event: CalendarEvent | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  event
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const isEditing = !!event;

  useEffect(() => {
    if (visible) {
      if (event) {
        // Editing mode - populate form with event data
        form.setFieldsValue({
          title: event.title,
          description: event.description,
          start_time: dayjs(event.start_time),
          end_time: dayjs(event.end_time),
          event_type: event.event_type,
          color: event.color,
          is_all_day: event.is_all_day,
          location: event.location,
          status: event.status,
        });
      } else {
        // Create mode - reset form
        form.resetFields();
        form.setFieldsValue({
          event_type: 'other',
          color: '#4285f4',
          is_all_day: false,
          status: 'scheduled',
        });
      }
    }
  }, [visible, event, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const eventData: CreateCalendarEventRequest = {
        title: values.title,
        description: values.description,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
        end_time: values.end_time.format('YYYY-MM-DD HH:mm:ss'),
        event_type: values.event_type,
        color: values.color,
        is_all_day: values.is_all_day,
        location: values.location,
        status: values.status,
      };

      await onSubmit(eventData);
      message.success(isEditing ? t('calendar.eventUpdated') : t('calendar.eventCreated'));
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
      message.error(t('calendar.formError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? t('calendar.editEvent') : t('calendar.createEvent')}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('calendar.cancel')}
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading}
          onClick={handleSubmit}
        >
          {isEditing ? t('calendar.update') : t('calendar.create')}
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          event_type: 'other',
          color: '#4285f4',
          is_all_day: false,
          status: 'scheduled',
        }}
      >
        <Form.Item
          name="title"
          label={t('calendar.title')}
          rules={[{ required: true, message: t('calendar.titleRequired') }]}
        >
          <Input placeholder={t('calendar.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('calendar.description')}
        >
          <TextArea 
            rows={3} 
            placeholder={t('calendar.descriptionPlaceholder')} 
          />
        </Form.Item>

        <Form.Item
          name="start_time"
          label={t('calendar.startTime')}
          rules={[{ required: true, message: t('calendar.startTimeRequired') }]}
        >
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            placeholder={t('calendar.startTimePlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="end_time"
          label={t('calendar.endTime')}
          rules={[{ required: true, message: t('calendar.endTimeRequired') }]}
        >
          <DatePicker 
            showTime 
            format="YYYY-MM-DD HH:mm:ss"
            style={{ width: '100%' }}
            placeholder={t('calendar.endTimePlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="event_type"
          label={t('calendar.type')}
          rules={[{ required: true, message: t('calendar.typeRequired') }]}
        >
          <Select placeholder={t('calendar.typePlaceholder')}>
            <Option value="meeting">{t('calendar.eventType.meeting')}</Option>
            <Option value="task">{t('calendar.eventType.task')}</Option>
            <Option value="reminder">{t('calendar.eventType.reminder')}</Option>
            <Option value="other">{t('calendar.eventType.other')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={t('calendar.status')}
          rules={[{ required: true, message: t('calendar.statusRequired') }]}
        >
          <Select placeholder={t('calendar.statusPlaceholder')}>
            <Option value="scheduled">{t('calendar.status.scheduled')}</Option>
            <Option value="ongoing">{t('calendar.status.ongoing')}</Option>
            <Option value="completed">{t('calendar.status.completed')}</Option>
            <Option value="cancelled">{t('calendar.status.cancelled')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="location"
          label={t('calendar.location')}
        >
          <Input placeholder={t('calendar.locationPlaceholder')} />
        </Form.Item>

        <Form.Item
          name="color"
          label={t('calendar.color')}
        >
          <Input type="color" style={{ width: '100px' }} />
        </Form.Item>

        <Form.Item
          name="is_all_day"
          label={t('calendar.allDay')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEventModal; 