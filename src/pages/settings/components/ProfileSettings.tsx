import React, { useState } from 'react';
import { Form, Input, DatePicker, Radio, Upload, Button, Avatar, message, Space, Row, Col, Card } from 'antd';
import { UserOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface ProfileSettingsProps {
  data?: any;
  onSave: (data: any) => void;
  saving: boolean;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ data, onSave, saving }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState(data?.avatar || '');

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      
      // Add basic fields
      Object.keys(values).forEach(key => {
        if (key === 'birth_date' && values[key]) {
          formData.append(key, values[key].format('YYYY-MM-DD'));
        } else if (key === 'avatar' && values[key]?.fileList?.[0]) {
          formData.append('avatar', values[key].fileList[0].originFileObj);
        } else if (key !== 'avatar') {
          formData.append(key, values[key] || '');
        }
      });

      await onSave(formData);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const uploadProps = {
    name: 'avatar',
    fileList: avatarUrl ? [{
      uid: '-1',
      name: 'avatar.jpg',
      status: 'done' as const,
      url: avatarUrl,
    }] : [],
    beforeUpload: () => false,
    onChange: (info: any) => {
      if (info.fileList.length > 0) {
        const file = info.fileList[0];
        if (file.originFileObj) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setAvatarUrl(e.target?.result as string);
          };
          reader.readAsDataURL(file.originFileObj);
        }
      }
    },
  };

  return (
    <Card title={t('settings.profile.title')} style={{ marginBottom: 24 }}>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: data?.name || '',
          email: data?.email || '',
          phone: data?.phone || '',
          birth_date: data?.birth_date ? dayjs(data.birth_date) : null,
          gender: data?.gender || 'male',
          bio: data?.bio || '',
          location: data?.location || '',
        }}
        onFinish={handleSubmit}
      >
        <Row gutter={24}>
          <Col xs={24} md={8}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={120} 
                src={avatarUrl} 
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Form.Item name="avatar">
                <Upload {...uploadProps} maxCount={1}>
                  <Button icon={<UploadOutlined />}>
                    {t('settings.profile.uploadAvatar')}
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </Col>
          
          <Col xs={24} md={16}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label={t('settings.profile.name')}
                  rules={[
                    { required: true, message: t('settings.profile.nameRequired') }
                  ]}
                >
                  <Input placeholder={t('settings.profile.namePlaceholder')} />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label={t('settings.profile.email', 'Email')}
                  rules={[
                    { required: true, message: t('settings.profile.emailRequired', 'Please enter your email') },
                    { type: 'email', message: t('settings.profile.emailInvalid', 'Please enter a valid email') }
                  ]}
                >
                  <Input disabled placeholder={t('settings.profile.emailPlaceholder', 'Enter your email')} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="phone"
                  label={t('settings.profile.phone', 'Phone Number')}
                >
                  <Input placeholder={t('settings.profile.phonePlaceholder', 'Enter your phone number')} />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="birth_date"
                  label={t('settings.profile.birthDate', 'Birth Date')}
                >
                  <DatePicker 
                    style={{ width: '100%' }}
                    placeholder={t('settings.profile.birthDatePlaceholder', 'Select birth date')}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="gender"
              label={t('settings.profile.gender', 'Gender')}
            >
              <Radio.Group>
                <Radio value="male">{t('settings.profile.male', 'Male')}</Radio>
                <Radio value="female">{t('settings.profile.female', 'Female')}</Radio>
                <Radio value="other">{t('settings.profile.other', 'Other')}</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="location"
              label={t('settings.profile.location', 'Location')}
            >
              <Input placeholder={t('settings.profile.locationPlaceholder', 'Enter your location')} />
            </Form.Item>

            <Form.Item
              name="bio"
              label={t('settings.profile.bio', 'Bio')}
            >
              <TextArea 
                rows={4}
                placeholder={t('settings.profile.bioPlaceholder', 'Tell us about yourself')}
                maxLength={500}
                showCount
              />
            </Form.Item>

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
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default ProfileSettings; 