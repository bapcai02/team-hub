import React from 'react';
import { Form, Switch, Select, Card, Row, Col, Space, Divider, Typography, Button, Alert } from 'antd';
import { SaveOutlined, EyeOutlined, SafetyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Option } = Select;
const { Title, Text } = Typography;

interface PrivacySettingsProps {
  data?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ data, onSave, saving }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      const settings = {
        profile_visibility: values.profile_visibility,
        activity_status: values.activity_status,
        data_sharing: values.data_sharing,
        analytics_tracking: values.analytics_tracking,
        marketing_emails: values.marketing_emails,
        third_party_sharing: values.third_party_sharing,
        data_retention: values.data_retention,
        location_sharing: values.location_sharing,
        contact_visibility: values.contact_visibility,
        search_visibility: values.search_visibility,
      };
      
      await onSave({ settings });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    }
  };

  return (
    <Card title={t('settings.privacy.title')} style={{ marginBottom: 24 }}>
      <Alert
        message={t('settings.privacy.privacyNotice')}
        description={t('settings.privacy.privacyNoticeDesc')}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          profile_visibility: data?.profile_visibility || 'team',
          activity_status: data?.activity_status || 'team',
          data_sharing: data?.data_sharing || false,
          analytics_tracking: data?.analytics_tracking || true,
          marketing_emails: data?.marketing_emails || false,
          third_party_sharing: data?.third_party_sharing || false,
          data_retention: data?.data_retention || '1_year',
          location_sharing: data?.location_sharing || false,
          contact_visibility: data?.contact_visibility || 'team',
          search_visibility: data?.search_visibility || 'team',
        }}
        onFinish={handleSubmit}
      >
        {/* Profile Privacy */}
        <Card 
          title={
            <Space>
              <EyeOutlined />
              {t('settings.privacy.profilePrivacy')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="profile_visibility"
                label={t('settings.privacy.profileVisibility')}
                rules={[
                  { required: true, message: t('settings.privacy.profileVisibilityRequired') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectProfileVisibility')}>
                  <Option value="public">{t('settings.privacy.public')}</Option>
                  <Option value="team">{t('settings.privacy.team')}</Option>
                  <Option value="private">{t('settings.privacy.private')}</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="activity_status"
                label={t('settings.privacy.activityStatus')}
                rules={[
                  { required: true, message: t('settings.privacy.activityStatusRequired') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectActivityStatus')}>
                  <Option value="public">{t('settings.privacy.public')}</Option>
                  <Option value="team">{t('settings.privacy.team')}</Option>
                  <Option value="private">{t('settings.privacy.private')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="contact_visibility"
                label={t('settings.privacy.contactVisibility')}
                rules={[
                  { required: true, message: t('settings.privacy.contactVisibilityRequired') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectContactVisibility')}>
                  <Option value="public">{t('settings.privacy.public')}</Option>
                  <Option value="team">{t('settings.privacy.team')}</Option>
                  <Option value="private">{t('settings.privacy.private')}</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="search_visibility"
                label={t('settings.privacy.searchVisibility')}
                rules={[
                  { required: true, message: t('settings.privacy.searchVisibilityRequired') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectSearchVisibility')}>
                  <Option value="public">{t('settings.privacy.public')}</Option>
                  <Option value="team">{t('settings.privacy.team')}</Option>
                  <Option value="private">{t('settings.privacy.private')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Data & Analytics */}
        <Card 
          title={
            <Space>
              <SafetyOutlined />
              {t('settings.privacy.dataAnalytics')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="analytics_tracking"
                label={t('settings.privacy.analyticsTracking')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.analyticsTrackingDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="data_sharing"
                label={t('settings.privacy.dataSharing')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.dataSharingDesc')}
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="third_party_sharing"
                label={t('settings.privacy.thirdPartySharing')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.thirdPartySharingDesc')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="location_sharing"
                label={t('settings.privacy.locationSharing')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.locationSharingDesc')}
              </Text>
            </Col>
          </Row>

          <Form.Item
            name="data_retention"
            label={t('settings.privacy.dataRetention')}
            rules={[
              { required: true, message: t('settings.privacy.dataRetentionRequired') }
            ]}
          >
            <Select placeholder={t('settings.privacy.selectDataRetention')}>
              <Option value="30_days">{t('settings.privacy.30Days')}</Option>
              <Option value="90_days">{t('settings.privacy.90Days')}</Option>
              <Option value="6_months">{t('settings.privacy.6Months')}</Option>
              <Option value="1_year">{t('settings.privacy.1Year')}</Option>
              <Option value="indefinite">{t('settings.privacy.indefinite')}</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Communication Preferences */}
        <Card 
          title={t('settings.privacy.communication')} 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="marketing_emails"
                label={t('settings.privacy.marketingEmails')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.marketingEmailsDesc')}
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

export default PrivacySettings; 