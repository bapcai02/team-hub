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
  Typography,
  Card,
  Collapse
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { deletePermission, setSelectedPermission } from '../../features/rbac/rbacSlice';
import { Permission } from '../../features/rbac/types';
import PermissionForm from './PermissionForm';

const { Text } = Typography;
const { Panel } = Collapse;

const PermissionManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { permissions, loading } = useAppSelector((state) => state.rbac);
  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);

  const handleCreatePermission = () => {
    setEditingPermission(null);
    setShowForm(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setEditingPermission(permission);
    dispatch(setSelectedPermission(permission));
    setShowForm(true);
  };

  const handleDeletePermission = async (id: number) => {
    try {
      await dispatch(deletePermission(id)).unwrap();
      message.success(t('rbac.permissions.delete_success') || 'Permission deleted successfully');
    } catch (error) {
      message.error(t('rbac.permissions.delete_error') || 'Failed to delete permission');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPermission(null);
    dispatch(setSelectedPermission(null));
  };

  const columns = [
    {
      title: t('rbac.permissions.table.name') || 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <SafetyCertificateOutlined style={{ color: '#4B48E5' }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: t('rbac.permissions.table.description') || 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <Text type="secondary">{text || '-'}</Text>
      ),
    },
    {
      title: t('rbac.permissions.table.module') || 'Module',
      dataIndex: 'module',
      key: 'module',
      render: (module: string) => (
        <Tag color="green" style={{ textTransform: 'capitalize' }}>
          {module}
        </Tag>
      ),
    },
    {
      title: t('rbac.permissions.table.status') || 'Status',
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
      title: t('rbac.permissions.table.actions') || 'Actions',
      key: 'actions',
      render: (_: any, record: Permission) => (
        <Space>
          <Tooltip title={t('rbac.permissions.actions.view') || 'View details'}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleEditPermission(record)}
            />
          </Tooltip>
          <Tooltip title={t('rbac.permissions.actions.edit') || 'Edit permission'}>
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditPermission(record)}
            />
          </Tooltip>
          <Popconfirm
            title={t('rbac.permissions.delete_confirm') || 'Are you sure you want to delete this permission?'}
            onConfirm={() => handleDeletePermission(record.id)}
            okText={t('common.yes') || 'Yes'}
            cancelText={t('common.no') || 'No'}
          >
            <Tooltip title={t('rbac.permissions.actions.delete') || 'Delete permission'}>
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

  const renderPermissionsByModule = () => {
    return Object.keys(permissions).map((module) => (
      <Panel
        header={
          <Space>
            <Text strong style={{ textTransform: 'capitalize' }}>
              {module}
            </Text>
            <Tag color="blue">{permissions[module].length} permissions</Tag>
          </Space>
        }
        key={module}
      >
        <Table
          columns={columns}
          dataSource={permissions[module]}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Panel>
    ));
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text strong style={{ fontSize: 16 }}>
            {t('rbac.permissions.title') || 'Permissions Management'}
          </Text>
          <br />
          <Text type="secondary">
            {t('rbac.permissions.description') || 'Manage system permissions organized by modules'}
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreatePermission}
        >
          {t('rbac.permissions.create') || 'Create Permission'}
        </Button>
      </div>

      {/* Permissions by Module */}
      <Card>
        <Collapse defaultActiveKey={Object.keys(permissions)}>
          {renderPermissionsByModule()}
        </Collapse>
      </Card>

      {/* Permission Form Modal */}
      <Modal
        title={
          editingPermission
            ? t('rbac.permissions.edit_title') || 'Edit Permission'
            : t('rbac.permissions.create_title') || 'Create New Permission'
        }
        open={showForm}
        onCancel={handleFormClose}
        footer={null}
        width={600}
        destroyOnClose
      >
        <PermissionForm
          permission={editingPermission}
          onSuccess={handleFormClose}
          onCancel={handleFormClose}
        />
      </Modal>
    </div>
  );
};

export default PermissionManagement; 