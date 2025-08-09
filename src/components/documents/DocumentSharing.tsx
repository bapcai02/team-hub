import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  List, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Select,
  Input,
  Switch,
  Form,
  message,
  Tooltip,
  Avatar,
  Divider
} from 'antd';
import { 
  ShareAltOutlined,
  UserAddOutlined,
  LinkOutlined,
  CopyOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  UserOutlined,
  TeamOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import { Document } from '../../features/documents/types';
import {
  fetchSharedUsers,
  shareDocument,
  unshareDocument,
  updateSharePermission,
  searchUsers
} from '../../features/documents/documentsSlice';

const { Option } = Select;
const { Text, Title } = Typography;
const { TextArea } = Input;

interface DocumentShare {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  permission: 'view' | 'edit' | 'comment';
  shared_by: {
    id: number;
    name: string;
  };
  shared_at: string;
  expires_at?: string;
  can_view: boolean;
  can_edit: boolean;
  can_comment: boolean;
}

interface DocumentSharingProps {
  visible: boolean;
  document: Document | null;
  onCancel: () => void;
}

const DocumentSharing: React.FC<DocumentSharingProps> = ({
  visible,
  document,
  onCancel,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [shares, setShares] = useState<DocumentShare[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [publicLink, setPublicLink] = useState<string>('');
  const [isPublic, setIsPublic] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && document) {
      fetchShares();
      generatePublicLink();
    }
  }, [visible, document]);

  const fetchShares = async () => {
    if (!document) return;
    
    setLoading(true);
    try {
      const result = await dispatch(fetchSharedUsers(document.id)).unwrap();
      setShares(result || []);
    } catch (error) {
      message.error(t('documents.failedToLoadShares'));
      setShares([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    setSearchLoading(true);
    try {
      const excludeUserIds = shares.map(share => share.user.id);
      const result = await dispatch(searchUsers({ query, excludeUserIds })).unwrap();
      setUsers(result || []);
    } catch (error) {
      message.error(t('documents.failedToSearchUsers'));
      setUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const generatePublicLink = () => {
    if (document) {
      setPublicLink(`${window.location.origin}/documents/${document.id}/shared`);
    }
  };

  const handleShareWithUser = async (values: any) => {
    if (!document) return;

    try {
      const userIds = values.users || [];
      const permission = values.permission || 'view';
      const expiresAt = values.expires_at;

      await dispatch(shareDocument({ 
        documentId: document.id, 
        userIds, 
        permission, 
        expiresAt 
      })).unwrap();

      message.success(t('documents.documentShared'));
      setShareModalVisible(false);
      form.resetFields();
      setUsers([]);
      fetchShares();
    } catch (error) {
      message.error(t('documents.failedToShareDocument'));
    }
  };

  const handleUpdatePermission = async (userId: number, permission: string) => {
    if (!document) return;

    try {
      await dispatch(updateSharePermission({ 
        documentId: document.id, 
        userId, 
        permission 
      })).unwrap();

      message.success(t('documents.permissionUpdated'));
      fetchShares();
    } catch (error) {
      message.error(t('documents.failedToUpdatePermission'));
    }
  };

  const handleRemoveShare = async (userId: number) => {
    if (!document) return;

    try {
      await dispatch(unshareDocument({ 
        documentId: document.id, 
        userId 
      })).unwrap();

      message.success(t('documents.shareRemoved'));
      fetchShares();
    } catch (error) {
      message.error(t('documents.failedToRemoveShare'));
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    message.success(t('documents.linkCopied'));
  };

  const handleTogglePublicAccess = async (checked: boolean) => {
    try {
      // TODO: Implement API call to toggle public access
      setIsPublic(checked);
      message.success(
        checked ? t('documents.publicAccessEnabled') : t('documents.publicAccessDisabled')
      );
    } catch (error) {
      message.error(t('documents.failedToTogglePublicAccess'));
    }
  };

  const getPermissionColor = (permission: string) => {
    const colors: { [key: string]: string } = {
      view: 'blue',
      edit: 'orange',
      admin: 'red',
    };
    return colors[permission] || 'default';
  };

  const getPermissionText = (permission: string) => {
    const texts: { [key: string]: string } = {
      view: t('documents.permissions.view'),
      edit: t('documents.permissions.edit'),
      admin: t('documents.permissions.admin'),
    };
    return texts[permission] || permission;
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <ShareAltOutlined />
            <span>{t('documents.shareDocument')}</span>
            {document && (
              <Text type="secondary">
                - {document.title}
              </Text>
            )}
          </Space>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
      >
        {/* Public Link Section */}
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>
            <LinkOutlined /> {t('documents.publicLink')}
          </Title>
          
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Switch
                checked={isPublic}
                onChange={handleTogglePublicAccess}
                checkedChildren={<UnlockOutlined />}
                unCheckedChildren={<LockOutlined />}
              />
              <Text>{t('documents.enablePublicAccess')}</Text>
            </Space>
          </div>

          {isPublic && (
            <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 6 }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  value={publicLink}
                  readOnly
                  style={{ flex: 1 }}
                />
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopyLink}
                >
                  {t('common.copy')}
                </Button>
              </Space.Compact>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('documents.publicLinkHint')}
                </Text>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* Share with Users Section */}
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Title level={5}>
              <UserOutlined /> {t('documents.shareWithUsers')}
            </Title>
            <Button 
              type="primary" 
              icon={<UserAddOutlined />}
              onClick={() => setShareModalVisible(true)}
            >
              {t('documents.addUser')}
            </Button>
          </Space>
        </div>

        <List
          loading={loading}
          dataSource={shares}
          renderItem={(share) => (
            <List.Item
              actions={[
                <Select
                  value={share.permission}
                  onChange={(value) => handleUpdatePermission(share.id, value)}
                  style={{ width: 120 }}
                >
                  <Option value="view">{t('documents.permissions.view')}</Option>
                  <Option value="edit">{t('documents.permissions.edit')}</Option>
                  <Option value="admin">{t('documents.permissions.admin')}</Option>
                </Select>,
                <Tooltip title={t('common.remove')}>
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveShare(share.id)}
                  />
                </Tooltip>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar 
                    src={share.user.avatar} 
                    icon={<UserOutlined />}
                  />
                }
                title={
                  <Space>
                    <Text strong>{share.user.name}</Text>
                    <Tag color={getPermissionColor(share.permission)}>
                      {getPermissionText(share.permission)}
                    </Tag>
                    {share.expires_at && (
                      <Tag color="orange">
                        {t('documents.expires')} {new Date(share.expires_at).toLocaleDateString()}
                      </Tag>
                    )}
                  </Space>
                }
                description={
                  <div>
                    <div>
                      <Text type="secondary">{share.user.email}</Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        {t('documents.sharedAt')}: {new Date(share.shared_at).toLocaleString()}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
          locale={{
            emptyText: t('documents.noShares'),
          }}
        />
      </Modal>

      {/* Share with User Modal */}
      <Modal
        title={t('documents.shareWithUser')}
        open={shareModalVisible}
        onCancel={() => setShareModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleShareWithUser}
        >
          <Form.Item
            name="user_id"
            label={t('documents.selectUser')}
            rules={[{ required: true, message: t('documents.userRequired') }]}
          >
            <Select
              placeholder={t('documents.selectUserPlaceholder')}
              showSearch
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="permission"
            label={t('documents.permission')}
            rules={[{ required: true, message: t('documents.permissionRequired') }]}
            initialValue="view"
          >
            <Select>
              <Option value="view">
                <Space>
                  <EyeOutlined />
                  {t('documents.permissions.view')} - {t('documents.permissions.viewDesc')}
                </Space>
              </Option>
              <Option value="edit">
                <Space>
                  <EditOutlined />
                  {t('documents.permissions.edit')} - {t('documents.permissions.editDesc')}
                </Space>
              </Option>
              <Option value="admin">
                <Space>
                  <DownloadOutlined />
                  {t('documents.permissions.admin')} - {t('documents.permissions.adminDesc')}
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="expires_at"
            label={t('documents.expiryDate')}
          >
            <Input type="datetime-local" />
          </Form.Item>

          <Form.Item
            name="message"
            label={t('documents.message')}
          >
            <TextArea 
              rows={3} 
              placeholder={t('documents.messagePlaceholder')} 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('documents.share')}
              </Button>
              <Button onClick={() => setShareModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DocumentSharing; 