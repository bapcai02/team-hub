import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Space,
  Typography,
  Tag,
  Select,
  Button,
  message,
  Modal,
  Avatar,
  Tooltip
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  EditOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { assignRolesToUser, fetchRoles } from '../../features/rbac/rbacSlice';
import { Role } from '../../features/rbac/types';

const { Text } = Typography;
const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  roles?: Role[];
}

const UserRoleAssignment: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state) => state.rbac);
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      roles: [{ 
        id: 1, 
        name: 'admin', 
        description: 'Administrator',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@example.com',
      roles: [{ 
        id: 2, 
        name: 'manager', 
        description: 'Manager',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }]
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@example.com',
      roles: [{ 
        id: 3, 
        name: 'user', 
        description: 'Regular User',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }]
    }
  ]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleEditRoles = (user: User) => {
    setEditingUser(user);
    setSelectedRoles(user.roles?.map(role => role.id) || []);
    setShowModal(true);
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;

    try {
      await dispatch(assignRolesToUser({ userId: editingUser.id, roleIds: selectedRoles })).unwrap();
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, roles: roles.filter((role: any) => selectedRoles.includes(role.id)) }
          : user
      ));

      message.success(t('rbac.user_assignment.success') || 'Roles assigned successfully');
      setShowModal(false);
      setEditingUser(null);
      setSelectedRoles([]);
    } catch (error) {
      message.error(t('rbac.user_assignment.error') || 'Failed to assign roles');
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingUser(null);
    setSelectedRoles([]);
  };

  const columns = [
    {
      title: t('rbac.user_assignment.table.user') || 'User',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: User) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('rbac.user_assignment.table.roles') || 'Current Roles',
      dataIndex: 'roles',
      key: 'roles',
      render: (userRoles: Role[]) => (
        <Space wrap>
          {userRoles?.map(role => (
            <Tag key={role.id} color="blue">
              <TeamOutlined /> {role.name}
            </Tag>
          ))}
          {(!userRoles || userRoles.length === 0) && (
            <Text type="secondary">No roles assigned</Text>
          )}
        </Space>
      ),
    },
    {
      title: t('rbac.user_assignment.table.actions') || 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Tooltip title={t('rbac.user_assignment.actions.edit') || 'Edit roles'}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditRoles(record)}
          >
            {t('rbac.user_assignment.actions.edit_roles') || 'Edit Roles'}
          </Button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ fontSize: 16 }}>
          {t('rbac.user_assignment.title') || 'User Role Assignment'}
        </Text>
        <br />
        <Text type="secondary">
          {t('rbac.user_assignment.description') || 'Assign roles to users to control their access permissions'}
        </Text>
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>

      {/* Role Assignment Modal */}
      <Modal
        title={
          <Space>
            <UserOutlined />
            {t('rbac.user_assignment.modal.title') || 'Assign Roles to User'}
          </Space>
        }
        open={showModal}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t('common.cancel') || 'Cancel'}
          </Button>,
          <Button
            key="save"
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSaveRoles}
          >
            {t('common.save') || 'Save'}
          </Button>,
        ]}
        width={600}
      >
        {editingUser && (
          <div>
            {/* User Info */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space>
                <Avatar src={editingUser.avatar} icon={<UserOutlined />} size="large" />
                <div>
                  <Text strong>{editingUser.name}</Text>
                  <br />
                  <Text type="secondary">{editingUser.email}</Text>
                </div>
              </Space>
            </Card>

            {/* Role Selection */}
            <div>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                {t('rbac.user_assignment.modal.select_roles') || 'Select Roles'}
              </Text>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={t('rbac.user_assignment.modal.placeholder') || 'Select roles to assign'}
                value={selectedRoles}
                onChange={setSelectedRoles}
                optionFilterProp="children"
              >
                {roles.map((role: any) => (
                  <Option key={role.id} value={role.id}>
                    <Space>
                      <TeamOutlined />
                      {role.name}
                      {role.description && (
                        <Text type="secondary">({role.description})</Text>
                      )}
                    </Space>
                  </Option>
                ))}
              </Select>
            </div>

            {/* Current Roles */}
            {editingUser.roles && editingUser.roles.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Text type="secondary">
                  {t('rbac.user_assignment.modal.current_roles') || 'Current Roles:'}
                </Text>
                <div style={{ marginTop: 8 }}>
                  {editingUser.roles.map((role: any) => (
                    <Tag key={role.id} color="blue" style={{ marginBottom: 4 }}>
                      {role.name}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserRoleAssignment; 