import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  InputNumber, 
  Button, 
  message,
  Space,
  Avatar,
  Checkbox,
  Tag
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
import { updateMeeting, Meeting } from '../../features/meeting';
import { getUsers } from '../../features/user/userSlice';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface EditMeetingModalProps {
  visible: boolean;
  meeting: Meeting | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditMeetingModal: React.FC<EditMeetingModalProps> = ({
  visible,
  meeting,
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
    if (visible && meeting) {
      dispatch(getUsers());
      form.setFieldsValue({
        title: meeting.title,
        description: meeting.description,
        start_time: dayjs(meeting.start_time),
        duration_minutes: meeting.duration_minutes,
        link: meeting.link,
      });
      setSelectedParticipants(meeting.participants?.map(p => p.user_id) || []);
    }
  }, [visible, meeting, dispatch, form]);

  const handleSubmit = async (values: any) => {
    if (!meeting) return;
    
    try {
      const meetingData = {
        ...values,
        start_time: values.start_time.format('YYYY-MM-DD HH:mm:ss'),
        participant_ids: selectedParticipants,
      };
      
      await dispatch(updateMeeting({ id: meeting.id, data: meetingData })).unwrap();
      message.success(t('meeting.updated'));
      onSuccess();
    } catch (error: any) {
      message.error(error.message || t('meeting.updateFailed'));
    }
  };

  const handleParticipantChange = (checkedValues: number[]) => {
    setSelectedParticipants(checkedValues);
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'blue';
      case 'ongoing': return 'green';
      case 'finished': return 'default';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return t('scheduled') || 'Đã lên lịch';
      case 'ongoing': return t('ongoing') || 'Đang diễn ra';
      case 'finished': return t('finished') || 'Đã kết thúc';
      case 'cancelled': return t('cancelled') || 'Đã hủy';
      default: return status;
    }
  };

  if (!meeting) return null;

  return (
          <Modal
        title={t('meeting.edit')}
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={600}
        destroyOnClose
      >
              <div style={{ marginBottom: '16px' }}>
          <Space>
            <span>{t('meeting.status')}:</span>
            <Tag color={getStatusColor(meeting.status)}>
              {getStatusText(meeting.status)}
            </Tag>
          </Space>
        </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label={t('title') || 'Tiêu đề'}
          rules={[
            { required: true, message: t('titleRequired') || 'Vui lòng nhập tiêu đề cuộc họp' }
          ]}
        >
          <Input 
            placeholder={t('enterMeetingTitle') || 'Nhập tiêu đề cuộc họp'}
            prefix={<CalendarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('description') || 'Mô tả'}
        >
          <TextArea 
            rows={3}
            placeholder={t('enterMeetingDescription') || 'Nhập mô tả cuộc họp'}
          />
        </Form.Item>

        <Form.Item
          name="start_time"
          label={t('startTime') || 'Thời gian bắt đầu'}
          rules={[
            { required: true, message: t('startTimeRequired') || 'Vui lòng chọn thời gian bắt đầu' }
          ]}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            placeholder={t('selectStartTime') || 'Chọn thời gian bắt đầu'}
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            prefix={<ClockCircleOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="duration_minutes"
          label={t('duration') || 'Thời lượng (phút)'}
          rules={[
            { required: true, message: t('durationRequired') || 'Vui lòng nhập thời lượng' },
            { type: 'number', min: 15, message: t('durationMin15') || 'Thời lượng tối thiểu 15 phút' },
            { type: 'number', max: 480, message: t('durationMax480') || 'Thời lượng tối đa 8 giờ' }
          ]}
        >
          <InputNumber
            min={15}
            max={480}
            style={{ width: '100%' }}
            placeholder={t('enterDuration') || 'Nhập thời lượng'}
          />
        </Form.Item>

        <Form.Item
          name="link"
          label={t('meetingLink') || 'Link cuộc họp'}
        >
          <Input 
            placeholder={t('enterMeetingLink') || 'Nhập link cuộc họp (tùy chọn)'}
            prefix={<LinkOutlined />}
          />
        </Form.Item>

        <Form.Item
          label={t('participants') || 'Người tham gia'}
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
              loading={loading.updating}
            >
              {t('common.update')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMeetingModal; 