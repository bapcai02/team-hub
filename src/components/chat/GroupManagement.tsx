import React, { useState, useEffect } from 'react';
import { Modal, List, Avatar, Button, Input, Typography, Space, Tag, Popconfirm, message, Tabs, Switch, Select, Divider } from 'antd';
import { UserOutlined, PlusOutlined, DeleteOutlined, CrownOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import apiClient from '../../lib/apiClient';
import { 
  getConversationSettings, 
  updateConversationSettings, 
  addMemberToConversation, 
  removeMemberFromConversation,
  leaveConversation,
  deleteConversation
} from '../../features/chat/chatSlice';

const { Text, Title } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;

interface GroupMember {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  isOnline: boolean;
}

interface GroupSettings {
  name: string;
  description: string;
  isPrivate: boolean;
  allowInvites: boolean;
  readOnly: boolean;
  slowMode: boolean;
  slowModeInterval: number;
}

interface GroupManagementProps {
  visible: boolean;
  onCancel: () => void;
  conversationId?: number;
}

const GroupManagement: React.FC<GroupManagementProps> = ({
  visible,
  onCancel,
  conversationId
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { conversationSettings } = useSelector((state: RootState) => state.chat);
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<GroupMember[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [settings, setSettings] = useState<GroupSettings>({
    name: '',
    description: '',
    isPrivate: false,
    allowInvites: true,
    readOnly: false,
    slowMode: false,
    slowModeInterval: 30
  });
  const [loading, setLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);

  // Mock current user - replace with actual user from auth state
  const currentUser = {
    id: 1,
    name: 'Current User',
    email: 'user@example.com',
    role: 'admin' as const
  };

  // Mock conversation - replace with actual conversation from state
  const conversation = {
    id: conversationId || 1,
    members: conversationSettings?.members || []
  };

  // Load settings and members when modal opens
  useEffect(() => {
    if (visible && conversationId) {
      loadConversationData();
    }
  }, [visible, conversationId]);

  // Load available users for adding members
  useEffect(() => {
    if (visible && conversationSettings) {
      loadAvailableUsers();
    }
  }, [visible, conversationSettings]);

  // Reset filtered users when available users change
  useEffect(() => {
    setFilteredUsers(availableUsers);
  }, [availableUsers]);

  // Filter members based on search
  useEffect(() => {
    if (conversationSettings?.members) {
      const filtered = conversationSettings.members.filter((member: any) =>
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, conversationSettings?.members]);

  const loadConversationData = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      await dispatch(getConversationSettings(conversationId)).unwrap();
    } catch (error) {
      console.error('Error loading conversation data:', error);
      message.error(t('chat.group.loadError', 'Failed to load group data'));
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    if (!conversationId) return;
    
    try {
      // Sử dụng API /users hiện có từ Laravel backend
      const response = await apiClient.get('/users');
      
      const allUsers = response.data.data?.users || [];
      
      // Filter ra những user chưa có trong conversation
      const currentMembers = conversationSettings?.members || [];
      const currentMemberIds = currentMembers.map((member: any) => member.id);
      
      const availableUsers = allUsers.filter((user: any) => !currentMemberIds.includes(user.id));
      
      setAvailableUsers(availableUsers);
      setFilteredUsers(availableUsers);
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  const handleAddMember = async (userId: number) => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      await dispatch(addMemberToConversation({ conversationId, userId })).unwrap();
      message.success(t('chat.group.memberAdded', 'Member added successfully'));
      await loadConversationData(); // Refresh data
    } catch (error) {
      console.error('Error adding member:', error);
      message.error(t('chat.group.addMemberError', 'Failed to add member'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      await dispatch(removeMemberFromConversation({ conversationId, userId })).unwrap();
      message.success(t('chat.group.memberRemoved', 'Member removed successfully'));
      await loadConversationData(); // Refresh data
    } catch (error) {
      console.error('Error removing member:', error);
      message.error(t('chat.group.removeMemberError', 'Failed to remove member'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      await dispatch(updateConversationSettings({ conversationId, settings })).unwrap();
      message.success(t('chat.group.settingsUpdated', 'Settings updated successfully'));
    } catch (error) {
      console.error('Error updating settings:', error);
      message.error(t('chat.group.updateSettingsError', 'Failed to update settings'));
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = () => {
    if (!conversationId) return;
    
    Modal.confirm({
      title: t('chat.group.leaveConfirmTitle', 'Leave Group'),
      content: t('chat.group.leaveConfirmContent', 'Are you sure you want to leave this group?'),
      okText: t('common.leave', 'Leave'),
      cancelText: t('common.cancel', 'Cancel'),
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          await dispatch(leaveConversation(conversationId)).unwrap();
          message.success(t('chat.group.leftGroup', 'You have left the group'));
          onCancel();
        } catch (error) {
          console.error('Error leaving group:', error);
          message.error(t('chat.group.leaveError', 'Failed to leave group'));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDeleteGroup = () => {
    if (!conversationId) return;
    
    Modal.confirm({
      title: t('chat.group.deleteConfirmTitle', 'Delete Group'),
      content: t('chat.group.deleteConfirmContent', 'Are you sure you want to delete this group? This action cannot be undone.'),
      okText: t('common.delete', 'Delete'),
      cancelText: t('common.cancel', 'Cancel'),
      okType: 'danger',
      onOk: async () => {
        try {
          setLoading(true);
          await dispatch(deleteConversation(conversationId)).unwrap();
          message.success(t('chat.group.groupDeleted', 'Group deleted successfully'));
          onCancel();
        } catch (error) {
          console.error('Error deleting group:', error);
          message.error(t('chat.group.deleteError', 'Failed to delete group'));
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const isAdmin = currentUser.role === 'admin';
  const isOwner = conversation.members.find((m: any) => m.id === currentUser.id)?.role === 'admin';

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingOutlined style={{ color: '#1890ff' }} />
          <span>{t('chat.group.manageGroup', 'Manage Group')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
      centered
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {/* Members Tab */}
        <TabPane tab={t('chat.group.members', 'Members')} key="members">
          <div style={{ marginBottom: '16px' }}>
            <Search
              placeholder={t('chat.group.searchMembers', 'Search members...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: '16px' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text strong>
                {t('chat.group.memberCount', '{{count}} members', { count: conversation.members.length })}
              </Text>
              {isAdmin && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setActiveTab('add')}
                >
                  {t('chat.group.addMember', 'Add Member')}
                </Button>
              )}
            </div>
          </div>

          <List
            dataSource={filteredMembers}
            renderItem={(member) => (
              <List.Item
                actions={
                  isAdmin && member.id !== currentUser.id ? [
                    <Popconfirm
                      title={t('chat.group.removeMemberConfirm', 'Remove this member?')}
                      onConfirm={() => handleRemoveMember(member.id)}
                      okText={t('common.yes', 'Yes')}
                      cancelText={t('common.no', 'No')}
                    >
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        danger
                        size="small"
                      />
                    </Popconfirm>
                  ] : []
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={member.avatar} icon={<UserOutlined />}>
                      {member.name.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{member.name}</Text>
                      {member.role === 'admin' && (
                        <Tag color="gold" icon={<CrownOutlined />}>
                          {t('chat.group.admin', 'Admin')}
                        </Tag>
                      )}
                      {member.isOnline && (
                        <Tag color="green">
                          {t('chat.group.online', 'Online')}
                        </Tag>
                      )}
                    </div>
                  }
                  description={member.email}
                />
              </List.Item>
            )}
          />
        </TabPane>

        {/* Add Members Tab */}
        <TabPane tab={t('chat.group.addMembers', 'Add Members')} key="add">
          <div style={{ marginBottom: '16px' }}>
            <Search
              placeholder={t('chat.group.searchUsers', 'Search users...')}
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                const filtered = availableUsers.filter(user => 
                  user.name?.toLowerCase().includes(query) ||
                  user.email?.toLowerCase().includes(query)
                );
                setFilteredUsers(filtered);
              }}
              style={{ marginBottom: '16px' }}
            />
          </div>

          <List
            dataSource={filteredUsers.filter(user => 
              !conversation.members.find((member: any) => member.id === user.id)
            )}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                  {availableUsers.length === 0 ? 'No users available to add' : 'No users match your search'}
                </div>
              )
            }}
            renderItem={(user) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleAddMember(user.id)}
                    loading={loading}
                  >
                    {t('chat.group.add', 'Add')}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={user.avatar} icon={<UserOutlined />}>
                      {user.name.charAt(0)}
                    </Avatar>
                  }
                  title={user.name}
                  description={user.email}
                />
              </List.Item>
            )}
          />
        </TabPane>

        {/* Settings Tab */}
        <TabPane tab={t('chat.group.settings', 'Settings')} key="settings">
          <div style={{ marginBottom: '24px' }}>
            <Title level={4}>{t('chat.group.basicSettings', 'Basic Settings')}</Title>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>{t('chat.group.groupName', 'Group Name')}</Text>
              <Input
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                placeholder={t('chat.group.enterGroupName', 'Enter group name')}
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text strong>{t('chat.group.description', 'Description')}</Text>
              <Input.TextArea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                placeholder={t('chat.group.enterDescription', 'Enter group description')}
                rows={3}
                style={{ marginTop: '8px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{t('chat.group.privateGroup', 'Private Group')}</Text>
                  <Switch
                    checked={settings.isPrivate}
                    onChange={(checked) => setSettings({ ...settings, isPrivate: checked })}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{t('chat.group.allowInvites', 'Allow Invites')}</Text>
                  <Switch
                    checked={settings.allowInvites}
                    onChange={(checked) => setSettings({ ...settings, allowInvites: checked })}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text>{t('chat.group.readOnly', 'Read Only')}</Text>
                  <Switch
                    checked={settings.readOnly}
                    onChange={(checked) => setSettings({ ...settings, readOnly: checked })}
                  />
                </div>
              </Space>
            </div>

            <Button
              type="primary"
              onClick={handleUpdateSettings}
              loading={loading}
              style={{ marginRight: '8px' }}
            >
              {t('chat.group.saveSettings', 'Save Settings')}
            </Button>
          </div>

          <Divider />

          {/* Danger Zone */}
          <div>
            <Title level={4} style={{ color: '#ff4d4f' }}>
              {t('chat.group.dangerZone', 'Danger Zone')}
            </Title>
            
            <div style={{ marginBottom: '16px' }}>
              <Text type="danger">
                {t('chat.group.leaveGroupWarning', 'Leave this group. You will no longer receive messages from this group.')}
              </Text>
              <br />
              <Button
                danger
                onClick={handleLeaveGroup}
                style={{ marginTop: '8px' }}
              >
                {t('chat.group.leaveGroup', 'Leave Group')}
              </Button>
            </div>

            {isOwner && (
              <div>
                <Text type="danger">
                  {t('chat.group.deleteGroupWarning', 'Delete this group permanently. This action cannot be undone.')}
                </Text>
                <br />
                <Button
                  danger
                  onClick={handleDeleteGroup}
                  style={{ marginTop: '8px' }}
                >
                  {t('chat.group.deleteGroup', 'Delete Group')}
                </Button>
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>

      {/* Footer */}
      <div style={{ marginTop: '24px', textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>
            {t('common.cancel', 'Cancel')}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default GroupManagement; 