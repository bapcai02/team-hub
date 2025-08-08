import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Space,
  Checkbox,
  Card,
  Typography,
  message,
  Spin,
  Divider
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { createRole, updateRole } from '../../features/rbac/rbacSlice';
import { Role, Permission } from '../../features/rbac/types';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface RoleFormProps {
  role?: Role | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { permissions, loading } = useAppSelector((state) => state.rbac);
  const [form] = Form.useForm();
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const isEditing = !!role;

  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
        is_active: role.is_active,
      });
      setSelectedPermissions(role.permissions?.map(p => p.id) || []);
    }
  }, [role, form]);

  const handleSubmit = async (values: any) => {
    try {
      const data = {
        ...values,
        permissions: selectedPermissions,
      };

      if (isEditing) {
        await dispatch(updateRole({ id: role!.id, data })).unwrap();
        message.success(t('rbac.roles.update_success') || 'Role updated successfully');
      } else {
        await dispatch(createRole(data)).unwrap();
        message.success(t('rbac.roles.create_success') || 'Role created successfully');
      }

      onSuccess();
    } catch (error) {
      message.error(
        isEditing
          ? t('rbac.roles.update_error') || 'Failed to update role'
          : t('rbac.roles.create_error') || 'Failed to create role'
      );
    }
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    }
  };

  const handleSelectAllModule = (module: string, checked: boolean) => {
    const modulePermissions = permissions[module] || [];
    const modulePermissionIds = modulePermissions.map((p: Permission) => p.id);

    if (checked) {
      setSelectedPermissions([...selectedPermissions, ...modulePermissionIds]);
    } else {
      setSelectedPermissions(selectedPermissions.filter(id => !modulePermissionIds.includes(id)));
    }
  };

  const isModuleSelected = (module: string) => {
    const modulePermissions = permissions[module] || [];
    const modulePermissionIds = modulePermissions.map((p: any) => p.id);
    return modulePermissionIds.every((id: any) => selectedPermissions.includes(id));
  };

  const isModuleIndeterminate = (module: string) => {
    const modulePermissions = permissions[module] || [];
    const modulePermissionIds = modulePermissions.map((p: any) => p.id);
    const selectedInModule = modulePermissionIds.filter((id: any) => selectedPermissions.includes(id));
    return selectedInModule.length > 0 && selectedInModule.length < modulePermissionIds.length;
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
          <Title level={5}>{t('rbac.roles.basic_info') || 'Basic Information'}</Title>
          
          <Form.Item
            name="name"
            label={t('rbac.roles.form.name') || 'Role Name'}
            rules={[
              { required: true, message: t('rbac.roles.form.name_required') || 'Role name is required' },
              { max: 255, message: t('rbac.roles.form.name_max') || 'Role name cannot exceed 255 characters' }
            ]}
          >
            <Input placeholder={t('rbac.roles.form.name_placeholder') || 'Enter role name'} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('rbac.roles.form.description') || 'Description'}
          >
            <TextArea
              rows={3}
              placeholder={t('rbac.roles.form.description_placeholder') || 'Enter role description'}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={t('rbac.roles.form.status') || 'Status'}
            valuePropName="checked"
          >
            <Checkbox>{t('rbac.roles.form.active') || 'Active'}</Checkbox>
          </Form.Item>
        </Card>

        {/* Permissions */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5}>{t('rbac.roles.permissions') || 'Permissions'}</Title>
          <Text type="secondary">
            {t('rbac.roles.permissions_description') || 'Select the permissions that this role should have'}
          </Text>

          <Divider />

          {Object.keys(permissions).map((module) => (
            <div key={module} style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8 }}>
                <Checkbox
                  checked={isModuleSelected(module)}
                  indeterminate={isModuleIndeterminate(module)}
                  onChange={(e) => handleSelectAllModule(module, e.target.checked)}
                >
                  <Text strong style={{ textTransform: 'capitalize' }}>
                    {module}
                  </Text>
                </Checkbox>
              </div>
              
              <div style={{ marginLeft: 24 }}>
                {permissions[module]?.map((permission: Permission) => (
                  <div key={permission.id} style={{ marginBottom: 4 }}>
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                    >
                      <Text>{permission.description || permission.name}</Text>
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
          ))}
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

export default RoleForm; 