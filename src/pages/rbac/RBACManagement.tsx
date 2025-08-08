import React, { useEffect, useState } from 'react';
import {
  Card,
  Tabs,
  Typography,
  Space,
  Button,
  message,
  Spin,
  Alert
} from 'antd';
import {
  TeamOutlined,
  SafetyCertificateOutlined,
  AuditOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  fetchRoles,
  fetchPermissions,
  fetchAuditLogs,
  fetchModules,
  clearError
} from '../../features/rbac/rbacSlice';
import MainLayout from '../../layouts/MainLayout';
import RoleManagement from '../../components/rbac/RoleManagement';
import PermissionManagement from '../../components/rbac/PermissionManagement';
import AuditLogs from '../../components/rbac/AuditLogs';
import UserRoleAssignment from '../../components/rbac/UserRoleAssignment';

const { Title } = Typography;
const { TabPane } = Tabs;

const RBACManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.rbac);
  const [activeTab, setActiveTab] = useState('roles');

  useEffect(() => {
    // Load initial data
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
    dispatch(fetchModules());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    
    // Load data based on active tab
    if (key === 'audit-logs') {
      dispatch(fetchAuditLogs());
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roles':
        return <RoleManagement />;
      case 'permissions':
        return <PermissionManagement />;
      case 'user-assignment':
        return <UserRoleAssignment />;
      case 'audit-logs':
        return <AuditLogs />;
      default:
        return <RoleManagement />;
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Header */}
          <Card>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Title level={2} style={{ margin: 0 }}>
                <SafetyCertificateOutlined style={{ marginRight: 8 }} />
                {t('rbac.management.title') || 'Role-Based Access Control'}
              </Title>
              <Typography.Text type="secondary">
                {t('rbac.management.description') || 'Manage roles, permissions, and access control for your system'}
              </Typography.Text>
            </Space>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => dispatch(clearError())}
            />
          )}

          {/* Main Content */}
          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              type="card"
            >
              <TabPane
                tab={
                  <span>
                    <TeamOutlined />
                    {t('rbac.tabs.roles') || 'Roles'}
                  </span>
                }
                key="roles"
              >
                <RoleManagement />
              </TabPane>
              
              <TabPane
                tab={
                  <span>
                    <SafetyCertificateOutlined />
                    {t('rbac.tabs.permissions') || 'Permissions'}
                  </span>
                }
                key="permissions"
              >
                <PermissionManagement />
              </TabPane>
              
              <TabPane
                tab={
                  <span>
                    <SettingOutlined />
                    {t('rbac.tabs.user_assignment') || 'User Assignment'}
                  </span>
                }
                key="user-assignment"
              >
                <UserRoleAssignment />
              </TabPane>
              
              <TabPane
                tab={
                  <span>
                    <AuditOutlined />
                    {t('rbac.tabs.audit_logs') || 'Audit Logs'}
                  </span>
                }
                key="audit-logs"
              >
                <AuditLogs />
              </TabPane>
            </Tabs>
          </Card>
        </Space>

        {/* Loading Overlay */}
        {loading && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <Spin size="large" />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RBACManagement; 