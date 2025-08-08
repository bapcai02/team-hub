import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Popconfirm,
  Tooltip,
  Switch,
  Typography
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { deleteRole, setSelectedRole } from '../../features/rbac/rbacSlice';
import { Role } from '../../features/rbac/types';
import RoleForm from './RoleForm';

const { Text } = Typography;

const RoleManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { roles, loading } = useAppSelector((state) => state.rbac);
  const [showForm, setShowForm] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleCreateRole = () => {
    setEditingRole(null);
    setShowForm(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    dispatch(setSelectedRole(role));
    setShowForm(true);
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await dispatch(deleteRole(id)).unwrap();
      message.success(t('rbac.roles.delete_success') || 'Role deleted successfully');
    } catch (error) {
      message.error(t('rbac.roles.delete_error') || 'Failed to delete role');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingRole(null);
    dispatch(setSelectedRole(null));
  };

  const columns = [
    {
      title: t('rbac.roles.table.name') || 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <TeamOutlined style={{ color: '#4B48E5' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: t('rbac.roles.table.description') || 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Text type="secondary">{text || '-'}</Text>
      ),
    },
    {
      title: t('rbac.roles.table.permissions') || 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: any[]) => (
        <Space wrap>
          {permissions?.slice(0, 3).map((perm) => (
            <Tag key={perm.id} color="blue">
              {perm.name}
            </Tag>
          ))}
          {permissions?.length > 3 && (
            <Tag color="default">
              +{permissions.length - 3} more
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: t('rbac.roles.table.status') || 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Switch
          checked={isActive}
          disabled
          size="small"
        />
      ),
    },
    {
      title: t('rbac.roles.table.actions') || 'Actions',
      key: 'actions',
      render: (_: any, record: Role) => (
        <Space>
          <Tooltip title={t('rbac.roles.actions.view') || 'View details'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleEditRole(record)}
            />
          </Tooltip>
          <Tooltip title={t('rbac.roles.actions.edit') || 'Edit role'}>
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditRole(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('rbac.roles.delete_confirm') || 'Are you sure you want to delete this role?'}
            onConfirm={() => handleDeleteRole(record.id)}
            okText={t('common.yes') || 'Yes'}
            cancelText={t('common.no') || 'No'}
          >
            <Tooltip title={t('rbac.roles.actions.delete') || 'Delete role'}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>
            {t('rbac.roles.title') || 'Roles Management'}
          </Text>
          <br />
          <Text type="secondary">
            {t('rbac.roles.description') || 'Create and manage user roles with specific permissions'}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateRole}
        >
          {t('rbac.roles.create') || 'Create Role'}
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} roles`,
        }}
        scroll={{ x: 800 }}
      />

      {/* Role Form Modal */}
      <Modal
        title={
          editingRole
            ? t('rbac.roles.edit_title') || 'Edit Role'
            : t('rbac.roles.create_title') || 'Create New Role'
        }
        open={showForm}
        onCancel={handleFormClose}
        footer={null}
        width={800}
        destroyOnClose
      >
        <RoleForm
          role={editingRole}
          onSuccess={handleFormClose}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
};

export default RoleManagement; 