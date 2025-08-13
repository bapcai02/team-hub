import React from 'react';
import { Form, Switch, Select, TimePicker, Card, Row, Col, Space, Divider, Typography, Button } from 'antd';
import { SaveOutlined, BellOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

interface NotificationSettingsProps {
  data?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ data, onSave, saving }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      // Transform form values to API format
      const preferences = [
        {
          category: 'general',
          channels: values.general_channels || [],
          frequency: values.general_frequency || 'immediate',
          quiet_hours: {
            enabled: values.general_quiet_hours || false,
            start: values.general_quiet_start ? values.general_quiet_start.format('HH:mm') : '22:00',
            end: values.general_quiet_end ? values.general_quiet_end.format('HH:mm') : '08:00',
          }
        },
        {
          category: 'projects',
          channels: values.projects_channels || [],
          frequency: values.projects_frequency || 'immediate',
          quiet_hours: {
            enabled: values.projects_quiet_hours || false,
            start: values.projects_quiet_start ? values.projects_quiet_start.format('HH:mm') : '22:00',
            end: values.projects_quiet_end ? values.projects_quiet_end.format('HH:mm') : '08:00',
          }
        },
        {
          category: 'tasks',
          channels: values.tasks_channels || [],
          frequency: values.tasks_frequency || 'immediate',
          quiet_hours: {
            enabled: values.tasks_quiet_hours || false,
            start: values.tasks_quiet_start ? values.tasks_quiet_start.format('HH:mm') : '22:00',
            end: values.tasks_quiet_end ? values.tasks_quiet_end.format('HH:mm') : '08:00',
          }
        },
        {
          category: 'chat',
          channels: values.chat_channels || [],
          frequency: values.chat_frequency || 'immediate',
          quiet_hours: {
            enabled: values.chat_quiet_hours || false,
            start: values.chat_quiet_start ? values.chat_quiet_start.format('HH:mm') : '22:00',
            end: values.chat_quiet_end ? values.chat_quiet_end.format('HH:mm') : '08:00',
          }
        },
        {
          category: 'meetings',
          channels: values.meetings_channels || [],
          frequency: values.meetings_frequency || 'immediate',
          quiet_hours: {
            enabled: values.meetings_quiet_hours || false,
            start: values.meetings_quiet_start ? values.meetings_quiet_start.format('HH:mm') : '22:00',
            end: values.meetings_quiet_end ? values.meetings_quiet_end.format('HH:mm') : '08:00',
          }
        }
      ];

      await onSave({ preferences });
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  };

  const renderNotificationSection = (category: string, title: string, description: string) => (
    <Card 
      title={
        <Space>
          <BellOutlined />
          {title}
        </Space>
      } 
      style={{ marginBottom: 16 }}
    >
      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        {description}
      </Text>
      
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item
            name={`${category}_enabled`}
            label={t('settings.notifications.enabled', 'Enabled')}
            valuePropName="checked"
            initialValue={data?.[category]?.enabled ?? true}
          >
            <Switch />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            name={`${category}_channels`}
            label={t('settings.notifications.channels', 'Channels')}
            initialValue={data?.[category]?.channels || ['email', 'in_app']}
          >
            <Select mode="multiple" placeholder={t('settings.notifications.selectChannels', 'Select channels')}>
              <Option value="email">{t('settings.notifications.email', 'Email')}</Option>
              <Option value="in_app">{t('settings.notifications.inApp', 'In-App')}</Option>
              <Option value="push">{t('settings.notifications.push', 'Push')}</Option>
              <Option value="sms">{t('settings.notifications.sms', 'SMS')}</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            name={`${category}_frequency`}
            label={t('settings.notifications.frequency', 'Frequency')}
            initialValue={data?.[category]?.frequency || 'immediate'}
          >
            <Select placeholder={t('settings.notifications.selectFrequency', 'Select frequency')}>
              <Option value="immediate">{t('settings.notifications.immediate', 'Immediate')}</Option>
              <Option value="hourly">{t('settings.notifications.hourly', 'Hourly')}</Option>
              <Option value="daily">{t('settings.notifications.daily', 'Daily')}</Option>
              <Option value="weekly">{t('settings.notifications.weekly', 'Weekly')}</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>{t('settings.notifications.quietHours', 'Quiet Hours')}</Divider>
      
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Form.Item
            name={`${category}_quiet_hours`}
            label={t('settings.notifications.quietHoursEnabled', 'Enable Quiet Hours')}
            valuePropName="checked"
            initialValue={data?.[category]?.quiet_hours?.enabled || false}
          >
            <Switch />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={9}>
          <Form.Item
            name={`${category}_quiet_start`}
            label={t('settings.notifications.quietStart', 'Start Time')}
            initialValue={data?.[category]?.quiet_hours?.start ? dayjs(data[category].quiet_hours.start, 'HH:mm') : dayjs('22:00', 'HH:mm')}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={9}>
          <Form.Item
            name={`${category}_quiet_end`}
            label={t('settings.notifications.quietEnd', 'End Time')}
            initialValue={data?.[category]?.quiet_hours?.end ? dayjs(data[category].quiet_hours.end, 'HH:mm') : dayjs('08:00', 'HH:mm')}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Card title={t('settings.notifications.title', 'Notification Preferences')} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.general', 'General Notifications')}
        </Title>
        {renderNotificationSection(
          'general',
          t('settings.notifications.generalTitle', 'General'),
          t('settings.notifications.generalDesc', 'System updates, announcements, and general information')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.project', 'Project Notifications')}
        </Title>
        {renderNotificationSection(
          'projects',
          t('settings.notifications.projectsTitle', 'Projects'),
          t('settings.notifications.projectsDesc', 'Project updates, milestones, and team changes')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.task', 'Task Notifications')}
        </Title>
        {renderNotificationSection(
          'tasks',
          t('settings.notifications.tasksTitle', 'Tasks'),
          t('settings.notifications.tasksDesc', 'Task assignments, deadlines, and status changes')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.chat', 'Chat Notifications')}
        </Title>
        {renderNotificationSection(
          'chat',
          t('settings.notifications.chatTitle', 'Chat'),
          t('settings.notifications.chatDesc', 'New messages, mentions, and chat activities')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.meeting', 'Meeting Notifications')}
        </Title>
        {renderNotificationSection(
          'meetings',
          t('settings.notifications.meetingsTitle', 'Meetings'),
          t('settings.notifications.meetingsDesc', 'Meeting reminders, schedule changes, and updates')
        )}

        <Divider />

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={saving}
              icon={<SaveOutlined />}
            >
              {t('settings.save', 'Save Changes')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NotificationSettings; 