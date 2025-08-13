import React from 'react';
import { Form, Switch, Select, Card, Row, Col, Space, Divider, Typography, Button, Alert } from 'antd';
import { SaveOutlined, EyeOutlined, ShieldOutlined } from '@ant-design/icons';
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
    <Card title={t('settings.privacy.title', 'Privacy Settings')} style={{ marginBottom: 24 }}>
      <Alert
        message={t('settings.privacy.privacyNotice', 'Privacy Notice')}
        description={t('settings.privacy.privacyNoticeDesc', 'We respect your privacy and are committed to protecting your personal data. These settings help you control how your information is shared and used.')}
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
              {t('settings.privacy.profilePrivacy', 'Profile Privacy')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="profile_visibility"
                label={t('settings.privacy.profileVisibility', 'Profile Visibility')}
                rules={[
                  { required: true, message: t('settings.privacy.profileVisibilityRequired', 'Please select profile visibility') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectProfileVisibility', 'Select who can see your profile')}>
                  <Option value="public">{t('settings.privacy.public', 'Public - Anyone can see')}</Option>
                  <Option value="team">{t('settings.privacy.team', 'Team - Only team members')}</Option>
                  <Option value="private">{t('settings.privacy.private', 'Private - Only you')}</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="activity_status"
                label={t('settings.privacy.activityStatus', 'Activity Status')}
                rules={[
                  { required: true, message: t('settings.privacy.activityStatusRequired', 'Please select activity status visibility') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectActivityStatus', 'Select who can see your activity status')}>
                  <Option value="public">{t('settings.privacy.public', 'Public - Anyone can see')}</Option>
                  <Option value="team">{t('settings.privacy.team', 'Team - Only team members')}</Option>
                  <Option value="private">{t('settings.privacy.private', 'Private - Only you')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="contact_visibility"
                label={t('settings.privacy.contactVisibility', 'Contact Information')}
                rules={[
                  { required: true, message: t('settings.privacy.contactVisibilityRequired', 'Please select contact visibility') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectContactVisibility', 'Select who can see your contact info')}>
                  <Option value="public">{t('settings.privacy.public', 'Public - Anyone can see')}</Option>
                  <Option value="team">{t('settings.privacy.team', 'Team - Only team members')}</Option>
                  <Option value="private">{t('settings.privacy.private', 'Private - Only you')}</Option>
                </Select>
              </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="search_visibility"
                label={t('settings.privacy.searchVisibility', 'Search Visibility')}
                rules={[
                  { required: true, message: t('settings.privacy.searchVisibilityRequired', 'Please select search visibility') }
                ]}
              >
                <Select placeholder={t('settings.privacy.selectSearchVisibility', 'Select who can find you in search')}>
                  <Option value="public">{t('settings.privacy.public', 'Public - Anyone can find')}</Option>
                  <Option value="team">{t('settings.privacy.team', 'Team - Only team members')}</Option>
                  <Option value="private">{t('settings.privacy.private', 'Private - Hidden from search')}</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Data & Analytics */}
        <Card 
          title={
            <Space>
              <ShieldOutlined />
              {t('settings.privacy.dataAnalytics', 'Data & Analytics')}
            </Space>
          } 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="analytics_tracking"
                label={t('settings.privacy.analyticsTracking', 'Analytics Tracking')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.analyticsTrackingDesc', 'Help us improve by allowing anonymous usage analytics')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="data_sharing"
                label={t('settings.privacy.dataSharing', 'Data Sharing')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.dataSharingDesc', 'Allow sharing of anonymized data for research')}
              </Text>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="third_party_sharing"
                label={t('settings.privacy.thirdPartySharing', 'Third-Party Sharing')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.thirdPartySharingDesc', 'Allow sharing data with trusted third-party services')}
              </Text>
            </Col>
            
            <Col xs={24} md={12}>
              <Form.Item
                name="location_sharing"
                label={t('settings.privacy.locationSharing', 'Location Sharing')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.locationSharingDesc', 'Share your location for location-based features')}
              </Text>
            </Col>
          </Row>

          <Form.Item
            name="data_retention"
            label={t('settings.privacy.dataRetention', 'Data Retention Period')}
            rules={[
              { required: true, message: t('settings.privacy.dataRetentionRequired', 'Please select data retention period') }
            ]}
          >
            <Select placeholder={t('settings.privacy.selectDataRetention', 'Select how long to keep your data')}>
              <Option value="30_days">{t('settings.privacy.30Days', '30 Days')}</Option>
              <Option value="90_days">{t('settings.privacy.90Days', '90 Days')}</Option>
              <Option value="6_months">{t('settings.privacy.6Months', '6 Months')}</Option>
              <Option value="1_year">{t('settings.privacy.1Year', '1 Year')}</Option>
              <Option value="indefinite">{t('settings.privacy.indefinite', 'Indefinite')}</Option>
            </Select>
          </Form.Item>
        </Card>

        {/* Communication Preferences */}
        <Card 
          title={t('settings.privacy.communication', 'Communication Preferences')} 
          style={{ marginBottom: 24 }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="marketing_emails"
                label={t('settings.privacy.marketingEmails', 'Marketing Emails')}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren={t('settings.privacy.enabled', 'Enabled')} 
                  unCheckedChildren={t('settings.privacy.disabled', 'Disabled')}
                />
              </Form.Item>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {t('settings.privacy.marketingEmailsDesc', 'Receive promotional emails and newsletters')}
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

export default PrivacySettings; 