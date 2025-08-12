import React, { useState, useEffect } from 'react';
import { List, Avatar, Typography, Space, Badge, Input, Button, Empty, Spin, Modal, message, Popconfirm } from 'antd';
import { UserOutlined, SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getConversations, searchConversations, deleteConversation } from '../../features/chat/chatSlice';
import { UIConversation } from '../../types/chat';

const { Text, Title } = Typography;
const { Search } = Input;

interface ChatListProps {
  onConversationSelect: (conversation: UIConversation) => void;
  onCreateConversation: () => void;
  selectedConversationId?: number;
  onDeleteConversation?: (conversationId: number) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  onConversationSelect,
  onCreateConversation,
  selectedConversationId,
  onDeleteConversation
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading } = useSelector((state: RootState) => state.chat);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredConversation, setHoveredConversation] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getConversations());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      dispatch(searchConversations(value));
    } else {
      dispatch(getConversations());
    }
  };

  const handleDeleteConversation = async (conversationId: number, conversationName: string) => {
    try {
      await dispatch(deleteConversation(conversationId)).unwrap();
      message.success(t('chat.deleteSuccess', 'Conversation deleted successfully'));
      if (onDeleteConversation) {
        onDeleteConversation(conversationId);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      message.error(t('chat.deleteError', 'Failed to delete conversation'));
    }
  };

  const formatLastMessage = (conversation: UIConversation) => {
    // Debug logging for group conversations
    if (conversation.type === 'group') {
      console.log('Group conversation debug:', {
        id: conversation.id,
        name: conversation.name,
        participants: conversation.participants,
        participantsLength: conversation.participants?.length
      });
    }
    
    if (conversation.lastMessage) {
      return conversation.lastMessage.length > 30 
        ? conversation.lastMessage.substring(0, 30) + '...'
        : conversation.lastMessage;
    }
    return t('chat.noMessages', 'No messages yet');
  };

  const formatTime = (conversation: UIConversation) => {
    if (conversation.updatedAt) {
      const date = new Date(conversation.updatedAt);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return t('chat.justNow', 'Just now');
      } else if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffInHours < 48) {
        return t('chat.yesterday', 'Yesterday');
      } else {
        return date.toLocaleDateString();
      }
    }
    return '';
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.participants.some(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('chat.conversations', 'Conversations')}
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreateConversation}
            size="small"
          >
            {t('chat.newConversation', 'New')}
          </Button>
        </div>
        
        <Search
          placeholder={t('chat.searchConversations', 'Search conversations...')}
          onSearch={handleSearch}
          onChange={(e) => setSearchQuery(e.target.value)}
          allowClear
        />
      </div>

      {/* Conversation List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading.conversations ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Spin size="large" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <Empty
            description={searchQuery ? t('chat.noConversationsFound', 'No conversations found') : t('chat.noConversations', 'No conversations yet')}
            style={{ marginTop: '50px' }}
          />
        ) : (
          <List
            dataSource={filteredConversations}
            renderItem={(conversation) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: selectedConversationId === conversation.id ? '#f0f8ff' : 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  position: 'relative'
                }}
                onClick={() => onConversationSelect(conversation)}
                onMouseEnter={() => setHoveredConversation(conversation.id)}
                onMouseLeave={() => setHoveredConversation(null)}
              >
                <List.Item.Meta
                  avatar={
                    <Badge
                      count={conversation.unreadCount || 0}
                      size="small"
                      offset={[-5, 5]}
                    >
                      <Avatar
                        size={48}
                        src={conversation.avatar}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: conversation.type === 'group' ? '#1890ff' : '#52c41a' }}
                      >
                        {conversation.avatar}
                      </Avatar>
                    </Badge>
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ fontSize: '14px' }}>
                        {conversation.name}
                      </Text>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {formatTime(conversation)}
                        </Text>
                        {/* Delete button - only show on hover */}
                        {hoveredConversation === conversation.id && (
                          <Popconfirm
                            title={t('chat.deleteConfirmTitle', 'Delete Conversation')}
                            description={t('chat.deleteConfirmContent', 'Are you sure you want to delete this conversation? This action cannot be undone.')}
                            onConfirm={() => handleDeleteConversation(conversation.id, conversation.name || '')}
                            okText={t('common.delete', 'Delete')}
                            cancelText={t('common.cancel', 'Cancel')}
                            okType="danger"
                          >
                            <Button
                              type="text"
                              icon={<DeleteOutlined />}
                              size="small"
                              danger
                              style={{
                                padding: '4px 8px',
                                minWidth: 'auto',
                                height: 'auto'
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent conversation selection
                              }}
                            />
                          </Popconfirm>
                        )}
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatLastMessage(conversation)}
                      </Text>
                      {conversation.type === 'group' && (
                        <div style={{ marginTop: '4px' }}>
                          <Space size="small">
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              {conversation.participants?.length || 0} {t('chat.members', 'members')}
                            </Text>
                            {(conversation.onlineCount || 0) > 0 && (
                              <Text type="success" style={{ fontSize: '11px' }}>
                                {conversation.onlineCount} {t('chat.online', 'online')}
                              </Text>
                            )}
                            {/* Debug info - remove in production */}
                            {process.env.NODE_ENV === 'development' && (
                              <Text type="secondary" style={{ fontSize: '10px', opacity: 0.6 }}>
                                (O: {conversation.onlineCount || 0})
                              </Text>
                            )}
                          </Space>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ChatList; 