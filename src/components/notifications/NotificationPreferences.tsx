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

  // Ensure preferences is always an array
  const safePreferences = Array.isArray(preferences) ? preferences : [];
  
  // Fallback categories if not loaded
  const fallbackCategories = {
    system: 'System',
    project: 'Project',
    finance: 'Finance',
    hr: 'HR',
    device: 'Device',
    contract: 'Contract',
  };
  
  // Ensure categories is a simple object with string values
  const safeCategories = (() => {
    if (Object.keys(categories).length === 0) {
      return fallbackCategories;
    }
    
    // If categories is already a simple object, use it
    if (typeof categories === 'object' && categories !== null) {
      const simpleCategories: Record<string, string> = {};
      for (const [key, value] of Object.entries(categories)) {
        if (typeof value === 'string') {
          simpleCategories[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          // If value is an object, try to extract a display name
          simpleCategories[key] = (value as any).name || (value as any).label || key;
        }
      }
      return Object.keys(simpleCategories).length > 0 ? simpleCategories : fallbackCategories;
    }
    
    return fallbackCategories;
  })();
  
  // Fallback channels if not loaded
  const fallbackChannels = {
    email: 'Email',
    push: 'Push Notification',
    sms: 'SMS',
    in_app: 'In-App',
  };
  
  // Ensure channels is a simple object with string values
  const safeChannels = (() => {
    if (Object.keys(channels).length === 0) {
      return fallbackChannels;
    }
    
    // If channels is already a simple object, use it
    if (typeof channels === 'object' && channels !== null) {
      const simpleChannels: Record<string, string> = {};
      for (const [key, value] of Object.entries(channels)) {
        if (typeof value === 'string') {
          simpleChannels[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          // If value is an object, try to extract a display name
          simpleChannels[key] = (value as any).name || (value as any).label || key;
        }
      }
      return Object.keys(simpleChannels).length > 0 ? simpleChannels : fallbackChannels;
    }
    
    return fallbackChannels;
  })();
  
  console.log('NotificationPreferences Debug:', {
    preferences: safePreferences,
    categories: safeCategories,
    channels: safeChannels,
    preferencesLoading,
    preferencesError,
    safePreferencesLength: safePreferences.length,
    rawPreferences: preferences
  });

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
    return safePreferences.find(p => p.category === category) || null;
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
                    {Object.entries(safeChannels).map(([key, label]) => (
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

          {!preferencesLoading && safePreferences.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Text type="secondary">
                {t('notifications.preferences.noPreferences') || 'No preferences found. Creating default preferences...'}
              </Text>
            </div>
          )}

          <Collapse 
            ghost
            items={Object.entries(safeCategories).map(([category, label]) =>
              renderCategoryPreferences(category, label)
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default NotificationPreferences;