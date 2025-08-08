import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Checkbox,
  Card,
  Typography,
  message,
  Select
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { createPermission, updatePermission } from '../../features/rbac/rbacSlice';
import { Permission } from '../../features/rbac/types';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface PermissionFormProps {
  permission?: Permission | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({ permission, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { modules, loading } = useAppSelector((state) => state.rbac);
  const [form] = Form.useForm();

  const isEditing = !!permission;

  useEffect(() => {
    if (permission) {
      form.setFieldsValue({
        name: permission.name,
        description: permission.description,
        module: permission.module,
        is_active: permission.is_active,
      });
    }
  }, [permission, form]);

  const handleSubmit = async (values: any) => {
    try {
      if (isEditing) {
        await dispatch(updatePermission({ id: permission!.id, data: values })).unwrap();
        message.success(t('rbac.permissions.update_success') || 'Permission updated successfully');
      } else {
        await dispatch(createPermission(values)).unwrap();
        message.success(t('rbac.permissions.create_success') || 'Permission created successfully');
      }

      onSuccess();
    } catch (error) {
      message.error(
        isEditing
          ? t('rbac.permissions.update_error') || 'Failed to update permission'
          : t('rbac.permissions.create_error') || 'Failed to create permission'
      );
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          is_active: true,
        }}
      >
        {/* Basic Information */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5}>{t('rbac.permissions.basic_info') || 'Basic Information'}</Title>
          
          <Form.Item
            name="name"
            label={t('rbac.permissions.form.name') || 'Permission Name'}
            rules={[
              { required: true, message: t('rbac.permissions.form.name_required') || 'Permission name is required' },
              { max: 255, message: t('rbac.permissions.form.name_max') || 'Permission name cannot exceed 255 characters' }
            ]}
          >
            <Input placeholder={t('rbac.permissions.form.name_placeholder') || 'Enter permission name'} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('rbac.permissions.form.description') || 'Description'}
          >
            <TextArea
              rows={3}
              placeholder={t('rbac.permissions.form.description_placeholder') || 'Enter permission description'}
            />
          </Form.Item>

          <Form.Item
            name="module"
            label={t('rbac.permissions.form.module') || 'Module'}
            rules={[
              { required: true, message: t('rbac.permissions.form.module_required') || 'Module is required' }
            ]}
          >
            <Select
              placeholder={t('rbac.permissions.form.module_placeholder') || 'Select module'}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {Object.keys(modules).map((module) => (
                <Option key={module} value={module}>
                  {modules[module]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('rbac.permissions.form.status') || 'Status'}
            valuePropName="checked"
          >
            <Checkbox>{t('rbac.permissions.form.active') || 'Active'}</Checkbox>
          </Form.Item>
        </Card>

        {/* Actions */}
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Space>
            <Button onClick={onCancel}>
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing
                ? t('common.update') || 'Update'
                : t('common.create') || 'Create'
              }
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default PermissionForm; 