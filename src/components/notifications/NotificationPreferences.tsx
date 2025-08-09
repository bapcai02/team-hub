import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Form,
  Switch,
  Select,
  TimePicker,
  Button,
  Space,
  Typography,
  message,
  Spin,
  Collapse,
  Checkbox,
  Row,
  Col,
} from 'antd';
import {
  BellOutlined,
  MailOutlined,
  MobileOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { RootState } from '../../app/store';
import {
  fetchNotificationPreferences,
  fetchNotificationOptions,
  updateNotificationPreferences,
} from '../../features/notifications/notificationSlice';
import { NotificationPreference, UpdatePreferenceRequest } from '../../features/notifications/api';

const { Title, Text } = Typography;
const { Option } = Select;

const NotificationPreferences: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const {
    preferences,
    preferencesLoading,
    preferencesError,
    categories,
    channels,
  } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotificationPreferences() as any);
    dispatch(fetchNotificationOptions() as any);
  }, [dispatch]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <MailOutlined />;
      case 'push':
        return <BellOutlined />;
      case 'sms':
        return <MobileOutlined />;
      case 'in_app':
        return <MessageOutlined />;
      default:
        return <BellOutlined />;
    }
  };

  const handleSavePreference = async (category: string, values: any) => {
    setLoading(true);
    try {
      const preferenceData: UpdatePreferenceRequest = {
        category,
        channels: values.channels || [],
        frequency: {
          type: values.frequency || 'immediate',
        },
        quiet_hours: values.enableQuietHours ? {
          start: values.quietStart?.format('HH:mm') || '22:00',
          end: values.quietEnd?.format('HH:mm') || '08:00',
        } : undefined,
        is_active: values.is_active !== false,
      };

      await dispatch(updateNotificationPreferences(preferenceData) as any);
      message.success(t('notifications.preferences.saveSuccess'));
    } catch (error) {
      message.error(t('notifications.preferences.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const getPreferenceForCategory = (category: string): NotificationPreference | null => {
    return preferences.find(p => p.category === category) || null;
  };

  const renderCategoryPreferences = (category: string, categoryLabel: string) => {
    const preference = getPreferenceForCategory(category);
    
    const initialValues = preference ? {
      is_active: preference.is_active,
      channels: preference.channels,
      frequency: preference.frequency?.type || 'immediate',
      enableQuietHours: !!preference.quiet_hours,
      quietStart: preference.quiet_hours?.start ? dayjs(preference.quiet_hours.start, 'HH:mm') : dayjs('22:00', 'HH:mm'),
      quietEnd: preference.quiet_hours?.end ? dayjs(preference.quiet_hours.end, 'HH:mm') : dayjs('08:00', 'HH:mm'),
    } : {
      is_active: true,
      channels: ['email', 'in_app'],
      frequency: 'immediate',
      enableQuietHours: false,
      quietStart: dayjs('22:00', 'HH:mm'),
      quietEnd: dayjs('08:00', 'HH:mm'),
    };

    return {
      key: category,
      label: (
        <Space>
          <Switch 
            checked={initialValues.is_active}
            size="small"
            onChange={(checked) => {
              handleSavePreference(category, { ...initialValues, is_active: checked });
            }}
          />
          <Text strong>{categoryLabel}</Text>
        </Space>
      ),
      extra: <SettingOutlined />,
      children: (
        <Form
          layout="vertical"
          initialValues={initialValues}
          onFinish={(values) => handleSavePreference(category, values)}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="channels"
                label={t('notifications.preferences.channels')}
              >
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    {Object.entries(channels).map(([key, label]) => (
                      <Col span={24} key={key} style={{ marginBottom: 8 }}>
                        <Checkbox value={key}>
                          <Space>
                            {getChannelIcon(key)}
                            {label}
                          </Space>
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="frequency"
                label={t('notifications.preferences.frequency')}
              >
                <Select>
                  <Option value="immediate">{t('notifications.preferences.immediate')}</Option>
                  <Option value="daily">{t('notifications.preferences.daily')}</Option>
                  <Option value="weekly">{t('notifications.preferences.weekly')}</Option>
                  <Option value="never">{t('notifications.preferences.never')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="enableQuietHours"
            valuePropName="checked"
          >
            <Switch
              checkedChildren={t('notifications.preferences.quietHoursEnabled')}
              unCheckedChildren={t('notifications.preferences.quietHoursDisabled')}
            />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.enableQuietHours !== curr.enableQuietHours}>
            {({ getFieldValue }) => {
              const enableQuietHours = getFieldValue('enableQuietHours');
              return enableQuietHours ? (
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item
                      name="quietStart"
                      label={t('notifications.preferences.quietStart')}
                    >
                      <TimePicker 
                        format="HH:mm"
                        placeholder={t('notifications.preferences.selectTime')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      name="quietEnd"
                      label={t('notifications.preferences.quietEnd')}
                    >
                      <TimePicker 
                        format="HH:mm"
                        placeholder={t('notifications.preferences.selectTime')}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              ) : null;
            }}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {t('notifications.preferences.save')}
            </Button>
          </Form.Item>
        </Form>
      ),
    };
  };

  return (
    <div>
      <Card>
        <Title level={4}>
          <SettingOutlined style={{ marginRight: 8 }} />
          {t('notifications.preferences.title')}
        </Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
          {t('notifications.preferences.description')}
        </Text>

        <Spin spinning={preferencesLoading}>
          {preferencesError && (
            <Text type="danger" style={{ display: 'block', marginBottom: 16 }}>
              {preferencesError}
            </Text>
          )}

          <Collapse 
            ghost
            items={Object.entries(categories).map(([category, label]) =>
              renderCategoryPreferences(category, label)
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default NotificationPreferences;