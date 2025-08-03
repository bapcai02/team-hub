import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  InputNumber, 
  Button, 
  message,
  Select,
  Space,
  Avatar,
  Checkbox
} from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  UserOutlined,
  LinkOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../app/store';
import { createMeeting } from '../../features/meeting';
import { getUsers } from '../../features/user/userSlice';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface CreateMeetingModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.meeting);
  const { list: users } = useSelector((state: RootState) => state.user);
  
  const [form] = Form.useForm();
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      dispatch(getUsers());
      form.resetFields();
      setSelectedParticipants([]);
    }
  }, [visible, dispatch, form]);

  const handleSubmit = async (values: any) => {
    try {
      const meetingData = {
        ...values,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
        participant_ids: selectedParticipants,
      };
      
      await dispatch(createMeeting(meetingData)).unwrap();
      message.success(t('meeting.created'));
      onSuccess();
    } catch (error: any) {
      message.error(error.message || t('meeting.createFailed'));
    }
  };

  const handleParticipantChange = (checkedValues: number[]) => {
    setSelectedParticipants(checkedValues);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const disabledTime = (date: dayjs.Dayjs) => {
    if (date && date.isSame(dayjs(), 'day')) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();
      return {
        disabledHours: () => Array.from({ length: currentHour }, (_, i) => i),
        disabledMinutes: (selectedHour: number) => 
          selectedHour === currentHour ? Array.from({ length: currentMinute }, (_, i) => i) : [],
      };
    }
    return {};
  };

  return (
          <Modal
        title={t('meeting.create')}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          duration_minutes: 60,
        }}
      >
        <Form.Item
          name="title"
          label={t('meeting.title')}
          rules={[
            { required: true, message: t('meeting.titleRequired') }
          ]}
        >
          <Input 
            placeholder={t('meeting.titlePlaceholder')}
            prefix={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('meeting.description')}
        >
          <TextArea 
            rows={3}
            placeholder={t('meeting.descriptionPlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="start_time"
          label={t('meeting.startTime')}
          rules={[
            { required: true, message: t('meeting.startTimeRequired') }
          ]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={t('meeting.startTimePlaceholder')}
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            disabledTime={disabledTime}
            prefix={<ClockCircleOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="duration_minutes"
          label={t('meeting.duration')}
          rules={[
            { required: true, message: t('meeting.durationRequired') },
            { type: 'number', min: 15, message: t('meeting.durationMin15') },
            { type: 'number', max: 480, message: t('meeting.durationMax480') }
          ]}
        >
          <InputNumber
            min={15}
            max={480}
            style={{ width: '100%' }}
            placeholder={t('meeting.durationPlaceholder')}
          />
        </Form.Item>

        <Form.Item
          name="link"
          label={t('meeting.link')}
        >
          <Input 
            placeholder={t('meeting.linkPlaceholder')}
            prefix={<LinkOutlined />}
          />
        </Form.Item>

        <Form.Item
          label={t('meeting.participants')}
        >
          <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #d9d9d9', borderRadius: '6px', padding: '8px' }}>
            <Checkbox.Group
              value={selectedParticipants}
              onChange={handleParticipantChange}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                {users.map(user => (
                  <Checkbox key={user.id} value={user.id}>
                    <Space>
                      <Avatar size="small" src={user.avatar}>
                        {user.name?.charAt(0)}
                      </Avatar>
                      <span>{user.name}</span>
                    </Space>
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading.creating}
            >
              {t('common.create')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateMeetingModal; 