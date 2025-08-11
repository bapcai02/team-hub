import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, List, Avatar, Typography, Tabs, Spin } from 'antd';
import { SearchOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { CreateConversationDto } from '../../types/chat';
import apiClient from '../../lib/apiClient';

const { Text } = Typography;
const { TabPane } = Tabs;

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface CreateConversationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (data: CreateConversationDto) => void;
  loading?: boolean;
}

const CreateConversationModal: React.FC<CreateConversationModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (visible && users.length === 0) {
      fetchUsers();
    }
  }, [visible]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users || []);
    } else {
      const filtered = (users || []).filter((user: User) =>
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await apiClient.get('/users');
      console.log('Users API response:', response.data);
      const usersData = response.data?.data?.users || response.data?.users || response.data?.data || response.data || [];
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = async (value: string) => {
    setSearchQuery(value);
    setSearchLoading(true);
    
    // Simulate search delay
    setTimeout(() => {
      setSearchLoading(false);
    }, 300);
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    if (activeTab === 'personal') {
      // For personal chat, only one user can be selected
      setSelectedUsers([user]);
    } else {
      // For group chat, multiple users can be selected
      const isSelected = selectedUsers.some(u => u.id === user.id);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (activeTab === 'personal' && selectedUsers.length !== 1) {
      return;
    }
    
    if (activeTab === 'group' && selectedUsers.length === 0) {
      return;
    }

    const data: CreateConversationDto = {
      type: activeTab as 'personal' | 'group',
      name: activeTab === 'group' ? conversationName : undefined,
      memberIds: selectedUsers.map(user => user.id)
    };

    onSubmit(data);
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setActiveTab('personal');
      setSearchQuery('');
      setSelectedUsers([]);
      setConversationName('');
    }
  }, [visible]);

  // Check if form is valid
  const isValid = () => {
    if (activeTab === 'personal') {
      return selectedUsers.length === 1;
    } else {
      return selectedUsers.length > 0 && conversationName.trim();
    }
  };

  return (
    <Modal
      title="Create New Conversation"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          disabled={!isValid() || loading}
          loading={loading}
        >
          Create
        </Button>
      ]}
      width={600}
    >
      {/* Conversation type tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Personal Chat
            </span>
          }
          key="personal"
        >
          <div style={{ marginBottom: '12px' }}>
            <Text>Select a user to start a personal conversation</Text>
          </div>
        </TabPane>
        
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              Group Chat
            </span>
          }
          key="group"
        >
          <div style={{ marginBottom: '12px' }}>
            <Text>Create a group conversation with multiple users</Text>
          </div>
          
          {/* Group name input */}
          <Input
            placeholder="Enter group name"
            value={conversationName}
            onChange={(e) => setConversationName(e.target.value)}
            style={{ marginBottom: '12px' }}
          />
        </TabPane>
      </Tabs>

      {/* Search input */}
      <Input
        placeholder="Search users..."
        prefix={<SearchOutlined />}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: '12px' }}
      />

      {/* User list */}
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        {usersLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : searchLoading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : !Array.isArray(filteredUsers) || filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            No users found
          </div>
        ) : (
          <List
            dataSource={filteredUsers || []}
            renderItem={(user) => {
              const isSelected = selectedUsers.some(u => u.id === user.id);
              return (
                <List.Item
                  onClick={() => handleUserSelect(user)}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    backgroundColor: isSelected ? '#f0f8ff' : 'transparent',
                    borderRadius: '6px',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar src={user.avatar}>
                        {user.name?.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text strong>{user.name}</Text>
                        {isSelected && (
                          <span style={{ color: '#1890ff', fontSize: '12px' }}>
                            ✓ Selected
                          </span>
                        )}
                      </div>
                    }
                    description={user.email}
                  />
                </List.Item>
              );
            }}
          />
        )}
      </div>

      {/* Selected users summary */}
      {selectedUsers.length > 0 && (
        <div style={{ marginTop: '12px', padding: '8px', backgroundColor: '#f0f8ff', borderRadius: '6px' }}>
          <Text strong>Selected ({selectedUsers.length}):</Text>
          <div style={{ marginTop: '4px' }}>
            {selectedUsers.map(user => (
              <span key={user.id} style={{ marginRight: '8px' }}>
                {user.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};

export default CreateConversationModal; 