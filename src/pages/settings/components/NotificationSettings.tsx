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
            label={t('settings.notifications.enabled')}
            valuePropName="checked"
            initialValue={data?.[category]?.enabled ?? true}
          >
            <Switch />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            name={`${category}_channels`}
            label={t('settings.notifications.channels')}
            initialValue={data?.[category]?.channels || ['email', 'in_app']}
          >
            <Select mode="multiple" placeholder={t('settings.notifications.selectChannels')}>
              <Option value="email">{t('settings.notifications.email')}</Option>
              <Option value="in_app">{t('settings.notifications.inApp')}</Option>
              <Option value="push">{t('settings.notifications.push')}</Option>
              <Option value="sms">{t('settings.notifications.sms')}</Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col xs={24} md={8}>
          <Form.Item
            name={`${category}_frequency`}
            label={t('settings.notifications.frequency')}
            initialValue={data?.[category]?.frequency || 'immediate'}
          >
            <Select placeholder={t('settings.notifications.selectFrequency')}>
              <Option value="immediate">{t('settings.notifications.immediate')}</Option>
              <Option value="hourly">{t('settings.notifications.hourly')}</Option>
              <Option value="daily">{t('settings.notifications.daily')}</Option>
              <Option value="weekly">{t('settings.notifications.weekly')}</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Divider>{t('settings.notifications.quietHours')}</Divider>
      
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Form.Item
            name={`${category}_quiet_hours`}
            label={t('settings.notifications.quietHoursEnabled')}
            valuePropName="checked"
            initialValue={data?.[category]?.quiet_hours?.enabled || false}
          >
            <Switch />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={9}>
          <Form.Item
            name={`${category}_quiet_start`}
            label={t('settings.notifications.quietStart')}
            initialValue={data?.[category]?.quiet_hours?.start ? dayjs(data[category].quiet_hours.start, 'HH:mm') : dayjs('22:00', 'HH:mm')}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={9}>
          <Form.Item
            name={`${category}_quiet_end`}
            label={t('settings.notifications.quietEnd')}
            initialValue={data?.[category]?.quiet_hours?.end ? dayjs(data[category].quiet_hours.end, 'HH:mm') : dayjs('08:00', 'HH:mm')}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Card title={t('settings.notifications.title')} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.general')}
        </Title>
        {renderNotificationSection(
          'general',
          t('settings.notifications.generalTitle'),
          t('settings.notifications.generalDesc')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.project')}
        </Title>
        {renderNotificationSection(
          'projects',
          t('settings.notifications.projectsTitle'),
          t('settings.notifications.projectsDesc')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.task')}
        </Title>
        {renderNotificationSection(
          'tasks',
          t('settings.notifications.tasksTitle'),
          t('settings.notifications.tasksDesc')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.chat')}
        </Title>
        {renderNotificationSection(
          'chat',
          t('settings.notifications.chatTitle'),
          t('settings.notifications.chatDesc')
        )}

        <Title level={4} style={{ marginBottom: 16 }}>
          {t('settings.notifications.meeting')}
        </Title>
        {renderNotificationSection(
          'meetings',
          t('settings.notifications.meetingsTitle'),
          t('settings.notifications.meetingsDesc')
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
              {t('common.save')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default NotificationSettings; 