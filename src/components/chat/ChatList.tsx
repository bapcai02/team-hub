import React, { useState, useEffect } from 'react';
import { List, Avatar, Typography, Space, Badge, Input, Button, Empty, Spin } from 'antd';
import { UserOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getConversations, searchConversations } from '../../features/chat/chatSlice';
import { UIConversation } from '../../types/chat';

const { Text, Title } = Typography;
const { Search } = Input;

interface ChatListProps {
  onConversationSelect: (conversation: UIConversation) => void;
  onCreateConversation: () => void;
  selectedConversationId?: number;
}

const ChatList: React.FC<ChatListProps> = ({
  onConversationSelect,
  onCreateConversation,
  selectedConversationId
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading } = useSelector((state: RootState) => state.chat);
  const [searchQuery, setSearchQuery] = useState('');

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

  const formatLastMessage = (conversation: UIConversation) => {
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
                  borderBottom: '1px solid #f0f0f0'
                }}
                onClick={() => onConversationSelect(conversation)}
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
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {formatTime(conversation)}
                      </Text>
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
                              {conversation.memberCount} {t('chat.members', 'members')}
                            </Text>
                            {(conversation.onlineCount || 0) > 0 && (
                              <Text type="success" style={{ fontSize: '11px' }}>
                                {conversation.onlineCount} {t('chat.online', 'online')}
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