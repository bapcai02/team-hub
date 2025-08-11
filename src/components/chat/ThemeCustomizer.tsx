import React, { useState, useEffect } from 'react';
import { Modal, Button, Space, Typography, Card, Slider, ColorPicker, Switch, Divider, Row, Col } from 'antd';
import { BgColorsOutlined, EyeOutlined, UndoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

interface ThemeSettings {
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
  darkMode: boolean;
  compactMode: boolean;
}

interface ThemeCustomizerProps {
  visible: boolean;
  onCancel: () => void;
  onApply: (settings: ThemeSettings) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  visible,
  onCancel,
  onApply
}) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: '#1890ff',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: 6,
    fontSize: 14,
    darkMode: false,
    compactMode: false
  });

  const [previewSettings, setPreviewSettings] = useState<ThemeSettings>(settings);

  useEffect(() => {
    setPreviewSettings(settings);
  }, [settings]);

  const handleReset = () => {
    const defaultSettings: ThemeSettings = {
      primaryColor: '#1890ff',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      borderRadius: 6,
      fontSize: 14,
      darkMode: false,
      compactMode: false
    };
    setSettings(defaultSettings);
  };

  const handleApply = () => {
    onApply(settings);
    onCancel();
  };

  const updatePreview = (newSettings: Partial<ThemeSettings>) => {
    setPreviewSettings({ ...previewSettings, ...newSettings });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BgColorsOutlined style={{ color: '#722ed1' }} />
          <span>{t('chat.theme.customize', 'Customize Theme')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
    >
      <Row gutter={24}>
        {/* Settings Panel */}
        <Col span={12}>
          <div style={{ padding: '20px 0' }}>
            <Title level={4} style={{ marginBottom: '20px' }}>
              {t('chat.theme.settings', 'Theme Settings')}
            </Title>

            {/* Colors */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Title level={5} style={{ marginBottom: '12px' }}>
                {t('chat.theme.colors', 'Colors')}
              </Title>
              
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  {t('chat.theme.primaryColor', 'Primary Color')}
                </Text>
                <ColorPicker
                  value={settings.primaryColor}
                  onChange={(color) => {
                    setSettings({ ...settings, primaryColor: color.toHexString() });
                    updatePreview({ primaryColor: color.toHexString() });
                  }}
                  showText
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  {t('chat.theme.backgroundColor', 'Background Color')}
                </Text>
                <ColorPicker
                  value={settings.backgroundColor}
                  onChange={(color) => {
                    setSettings({ ...settings, backgroundColor: color.toHexString() });
                    updatePreview({ backgroundColor: color.toHexString() });
                  }}
                  showText
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  {t('chat.theme.textColor', 'Text Color')}
                </Text>
                <ColorPicker
                  value={settings.textColor}
                  onChange={(color) => {
                    setSettings({ ...settings, textColor: color.toHexString() });
                    updatePreview({ textColor: color.toHexString() });
                  }}
                  showText
                />
              </div>
            </Card>

            {/* Layout */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Title level={5} style={{ marginBottom: '12px' }}>
                {t('chat.theme.layout', 'Layout')}
              </Title>
              
              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  {t('chat.theme.borderRadius', 'Border Radius')}: {settings.borderRadius}px
                </Text>
                <Slider
                  min={0}
                  max={20}
                  value={settings.borderRadius}
                  onChange={(value) => {
                    setSettings({ ...settings, borderRadius: value });
                    updatePreview({ borderRadius: value });
                  }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                  {t('chat.theme.fontSize', 'Font Size')}: {settings.fontSize}px
                </Text>
                <Slider
                  min={12}
                  max={20}
                  value={settings.fontSize}
                  onChange={(value) => {
                    setSettings({ ...settings, fontSize: value });
                    updatePreview({ fontSize: value });
                  }}
                />
              </div>
            </Card>

            {/* Options */}
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Title level={5} style={{ marginBottom: '12px' }}>
                {t('chat.theme.options', 'Options')}
              </Title>
              
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{t('chat.theme.darkMode', 'Dark Mode')}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('chat.theme.darkModeDesc', 'Use dark color scheme')}
                    </Text>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onChange={(checked) => {
                      setSettings({ ...settings, darkMode: checked });
                      updatePreview({ darkMode: checked });
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong>{t('chat.theme.compactMode', 'Compact Mode')}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('chat.theme.compactModeDesc', 'Reduce spacing and padding')}
                    </Text>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onChange={(checked) => {
                      setSettings({ ...settings, compactMode: checked });
                      updatePreview({ compactMode: checked });
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <Space>
              <Button icon={<UndoOutlined />} onClick={handleReset}>
                {t('chat.theme.reset', 'Reset')}
              </Button>
              <Button type="primary" onClick={handleApply}>
                {t('chat.theme.apply', 'Apply Theme')}
              </Button>
            </Space>
          </div>
        </Col>

        {/* Preview Panel */}
        <Col span={12}>
          <div style={{ padding: '20px 0' }}>
            <Title level={4} style={{ marginBottom: '20px' }}>
              <EyeOutlined style={{ marginRight: '8px' }} />
              {t('chat.theme.preview', 'Preview')}
            </Title>

            <div
              style={{
                backgroundColor: previewSettings.backgroundColor,
                color: previewSettings.textColor,
                borderRadius: `${previewSettings.borderRadius}px`,
                padding: previewSettings.compactMode ? '12px' : '20px',
                border: `1px solid ${previewSettings.primaryColor}20`,
                minHeight: '400px'
              }}
            >
              {/* Mock Chat Interface */}
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    backgroundColor: previewSettings.primaryColor,
                    color: '#ffffff',
                    padding: previewSettings.compactMode ? '8px 12px' : '12px 16px',
                    borderRadius: `${previewSettings.borderRadius}px`,
                    fontSize: `${previewSettings.fontSize}px`,
                    display: 'inline-block',
                    maxWidth: '70%'
                  }}
                >
                  {t('chat.theme.sampleMessage', 'This is a sample message to preview the theme.')}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    backgroundColor: previewSettings.darkMode ? '#f0f0f0' : '#f5f5f5',
                    color: previewSettings.textColor,
                    padding: previewSettings.compactMode ? '8px 12px' : '12px 16px',
                    borderRadius: `${previewSettings.borderRadius}px`,
                    fontSize: `${previewSettings.fontSize}px`,
                    display: 'inline-block',
                    maxWidth: '70%',
                    marginLeft: 'auto'
                  }}
                >
                  {t('chat.theme.sampleReply', 'This is a sample reply message.')}
                </div>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${previewSettings.primaryColor}20`,
                  paddingTop: previewSettings.compactMode ? '8px' : '12px',
                  marginTop: '16px'
                }}
              >
                <div
                  style={{
                    border: `1px solid ${previewSettings.primaryColor}40`,
                    borderRadius: `${previewSettings.borderRadius}px`,
                    padding: previewSettings.compactMode ? '8px 12px' : '12px 16px',
                    fontSize: `${previewSettings.fontSize}px`,
                    backgroundColor: previewSettings.darkMode ? '#fafafa' : '#ffffff'
                  }}
                >
                  {t('chat.theme.typeMessage', 'Type a message...')}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default ThemeCustomizer; 