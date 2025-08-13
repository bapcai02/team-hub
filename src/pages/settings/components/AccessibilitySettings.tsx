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
    <Card title={t('settings.accessibility.title', 'Accessibility Settings')} style={{ marginBottom: 24 }}>
      <Alert
        message={t('settings.accessibility.accessibilityNotice', 'Accessibility Notice')}
        description={t('settings.accessibility.accessibilityNoticeDesc', 'We are committed to making our platform accessible to everyone. These settings help customize your experience based on your needs.')}
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
              {t('settings.accessibility.visual', 'Visual Accessibility')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="high_contrast"
                label={t('settings.accessibility.highContrast', 'High Contrast Mode')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.highContrastDesc', 'Increase contrast for better visibility')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="color_blind_friendly"
                label={t('settings.accessibility.colorBlindFriendly', 'Color Blind Friendly')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.colorBlindFriendlyDesc', 'Use color blind friendly color schemes')}
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="font_size"
                label={t('settings.accessibility.fontSize', 'Font Size')}
                rules={[
                  { required: true, message: t('settings.accessibility.fontSizeRequired', 'Please select font size') }
                ]}
              >
                <Select placeholder={t('settings.accessibility.selectFontSize', 'Select font size')}>
                  <Option value="small">{t('settings.accessibility.small', 'Small')}</Option>
                  <Option value="medium">{t('settings.accessibility.medium', 'Medium')}</Option>
                  <Option value="large">{t('settings.accessibility.large', 'Large')}</Option>
                  <Option value="extra_large">{t('settings.accessibility.extraLarge', 'Extra Large')}</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="line_spacing"
                label={t('settings.accessibility.lineSpacing', 'Line Spacing')}
              >
                <Slider
                  min={1}
                  max={3}
                  step={0.1}
                  marks={{
                    1: t('settings.accessibility.tight', 'Tight'),
                    1.5: t('settings.accessibility.normal', 'Normal'),
                    2: t('settings.accessibility.loose', 'Loose'),
                    3: t('settings.accessibility.veryLoose', 'Very Loose'),
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Motion & Animation */}
        <Card 
          title={t('settings.accessibility.motion', 'Motion & Animation')} 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="reduce_motion"
                label={t('settings.accessibility.reduceMotion', 'Reduce Motion')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.reduceMotionDesc', 'Reduce or eliminate animations and transitions')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="auto_play_media"
                label={t('settings.accessibility.autoPlayMedia', 'Auto-play Media')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.autoPlayMediaDesc', 'Automatically play videos and audio')}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Navigation & Interaction */}
        <Card 
          title={t('settings.accessibility.navigation', 'Navigation & Interaction')} 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="keyboard_navigation"
                label={t('settings.accessibility.keyboardNavigation', 'Keyboard Navigation')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.keyboardNavigationDesc', 'Enable full keyboard navigation support')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="focus_indicators"
                label={t('settings.accessibility.focusIndicators', 'Focus Indicators')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.focusIndicatorsDesc', 'Show clear focus indicators for keyboard users')}
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="screen_reader"
                label={t('settings.accessibility.screenReader', 'Screen Reader Support')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.screenReaderDesc', 'Optimize for screen reader compatibility')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="simplified_layout"
                label={t('settings.accessibility.simplifiedLayout', 'Simplified Layout')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.simplifiedLayoutDesc', 'Use a simplified, distraction-free layout')}
              </Text>
            </Col>
          </Row>
        </Card>

        {/* Notifications */}
        <Card 
          title={
            <Space>
              <SoundOutlined />
              {t('settings.accessibility.notifications', 'Notifications')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="sound_notifications"
                label={t('settings.accessibility.soundNotifications', 'Sound Notifications')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.soundNotificationsDesc', 'Play sounds for notifications and alerts')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="visual_notifications"
                label={t('settings.accessibility.visualNotifications', 'Visual Notifications')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.accessibility.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.accessibility.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.accessibility.visualNotificationsDesc', 'Show visual indicators for notifications')}
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
              {t('settings.save', 'Save Changes')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AccessibilitySettings; 