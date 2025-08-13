import React from 'react';
import { Form, Switch, Select, Slider, Card, Row, Col, Space, Divider, Typography, Button, Alert } from 'antd';
import { SaveOutlined, ToolOutlined, EyeOutlined, SoundOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { Title, Text } = Typography;

interface AccessibilitySettingsProps {
  data?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ data, onSave, saving }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const settings = {
        high_contrast: values.high_contrast,
        font_size: values.font_size,
        line_spacing: values.line_spacing,
        color_blind_friendly: values.color_blind_friendly,
        reduce_motion: values.reduce_motion,
        screen_reader: values.screen_reader,
        keyboard_navigation: values.keyboard_navigation,
        focus_indicators: values.focus_indicators,
        sound_notifications: values.sound_notifications,
        visual_notifications: values.visual_notifications,
        auto_play_media: values.auto_play_media,
        simplified_layout: values.simplified_layout,
      };
      
      await onSave({ settings });
    } catch (error) {
      console.error('Error saving accessibility settings:', error);
    }
  };

  return (
    <Card title={t('settings.accessibility.title')} style={{ marginBottom: 24 }}>
      <Alert
        message={t('settings.accessibility.accessibilityNotice')}
        description={t('settings.accessibility.accessibilityNoticeDesc')}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          high_contrast: data?.high_contrast || false,
          font_size: data?.font_size || 'medium',
          line_spacing: data?.line_spacing || 1.5,
          color_blind_friendly: data?.color_blind_friendly || false,
          reduce_motion: data?.reduce_motion || false,
          screen_reader: data?.screen_reader || false,
          keyboard_navigation: data?.keyboard_navigation || true,
          focus_indicators: data?.focus_indicators || true,
          sound_notifications: data?.sound_notifications || true,
          visual_notifications: data?.visual_notifications || true,
          auto_play_media: data?.auto_play_media || false,
          simplified_layout: data?.simplified_layout || false,
        }}
        onFinish={handleSubmit}
      >
        {/* Visual Accessibility */}
        <Card 
          title={
            <Space>
              <EyeOutlined />
              {t('settings.accessibility.visual')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="high_contrast"
                label={t('settings.accessibility.highContrast')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.highContrastDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="color_blind_friendly"
                label={t('settings.accessibility.colorBlindFriendly')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.colorBlindFriendlyDesc')}
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="font_size"
                label={t('settings.accessibility.fontSize')}
                rules={[
                  { required: true, message: t('settings.accessibility.fontSizeRequired') }
                ]}
              >
                <Select placeholder={t('settings.accessibility.selectFontSize')}>
                  <Option value="small">{t('settings.accessibility.small')}</Option>
                  <Option value="medium">{t('settings.accessibility.medium')}</Option>
                  <Option value="large">{t('settings.accessibility.large')}</Option>
                  <Option value="extra_large">{t('settings.accessibility.extraLarge')}</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="line_spacing"
                label={t('settings.accessibility.lineSpacing')}
              >
                <Slider
                  min={1}
                  max={3}
                  step={0.1}
                  marks={{
                    1: t('settings.accessibility.tight'),
                    1.5: t('settings.accessibility.normal'),
                    2: t('settings.accessibility.loose'),
                    3: t('settings.accessibility.veryLoose'),
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Motion & Animation */}
        <Card 
          title={t('settings.accessibility.motion')} 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="reduce_motion"
                label={t('settings.accessibility.reduceMotion')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.reduceMotionDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="auto_play_media"
                label={t('settings.accessibility.autoPlayMedia')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.autoPlayMediaDesc')}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Navigation & Interaction */}
        <Card 
          title={t('settings.accessibility.navigation')} 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="keyboard_navigation"
                label={t('settings.accessibility.keyboardNavigation')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.keyboardNavigationDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="focus_indicators"
                label={t('settings.accessibility.focusIndicators')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.focusIndicatorsDesc')}
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="screen_reader"
                label={t('settings.accessibility.screenReader')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.screenReaderDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="simplified_layout"
                label={t('settings.accessibility.simplifiedLayout')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.simplifiedLayoutDesc')}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Notifications */}
        <Card 
          title={
            <Space>
              <SoundOutlined />
              {t('settings.accessibility.notifications')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="sound_notifications"
                label={t('settings.accessibility.soundNotifications')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.soundNotificationsDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="visual_notifications"
                label={t('settings.accessibility.visualNotifications')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.visualNotificationsDesc')}
              </Text>
            </Col>
          </Row>
        </Card>

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

export default AccessibilitySettings; 