import React from 'react';
import { Input, Avatar, Badge, Typography, Button, Tooltip, Spin } from 'antd';
import { SearchOutlined, CheckOutlined, PlusOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { UIConversation } from '../../types/chat';

const { Text } = Typography;

interface ChatSidebarProps {
  conversations: UIConversation[];
  selectedConversation: UIConversation | null;
  onConversationSelect: (conversation: UIConversation) => void;
  onCreateConversation: () => void;
  loading?: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  onCreateConversation,
  loading = false
}) => {
  
  // Helper function to get conversation display name
  const getConversationName = (conversation: UIConversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.type === 'group') return 'Group Chat';
    return 'Personal Chat';
  };

  // Helper function to get member count text
  const getMemberCountText = (conversation: UIConversation) => {
    if (conversation.type === 'group') {
      const memberCount = conversation.participants?.length || 0;
      const onlineCount = conversation.onlineCount || 0;
      return `${memberCount} member${memberCount !== 1 ? 's' : ''}${onlineCount > 0 ? `, ${onlineCount} online` : ''}`;
    }
    return 'Personal chat';
  };

  // Helper function to get avatar content
  const getAvatarContent = (conversation: UIConversation) => {
    if (conversation.type === 'group') {
      return conversation.avatar || 'G';
    }
    return conversation.avatar || 'U';
  };

  // Helper function to get avatar color
  const getAvatarColor = (conversation: UIConversation) => {
    if (conversation.type === 'group') {
      return '#7B7FFF';
    }
    return '#4B4BFF';
  };

  return (
    <div style={{ 
      width: '400px', 
      backgroundColor: '#F5F7FF', 
      padding: '16px', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '16px', 
      borderRight: '1px solid rgba(0,0,0,0.1)',
      borderRadius: '8px 0 0 8px',
      height: '100%',
    }}>
      {/* Header with Create Button */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '8px'
      }}>
        <Text strong style={{ fontSize: '16px' }}>Conversations</Text>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="small"
          onClick={onCreateConversation}
          style={{ 
            backgroundColor: '#7B7FFF',
            borderColor: '#7B7FFF'
          }}
        >
          New Chat
        </Button>
      </div>

      {/* Search */}
      <Input
        placeholder="Search conversations..."
        prefix={<SearchOutlined />}
        style={{
          backgroundColor: '#D9DBFF',
          borderRadius: '8px',
          border: 'none'
        }}
      />
      
      {/* Conversations List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '20px',
            fontSize: '14px'
          }}>
            <div style={{ marginBottom: '12px' }}>No conversations yet</div>
            <Button 
              type="primary" 
              size="small"
              onClick={onCreateConversation}
              style={{ 
                backgroundColor: '#7B7FFF',
                borderColor: '#7B7FFF'
              }}
            >
              Create Conversation
            </Button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onConversationSelect(conversation)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: selectedConversation?.id === conversation.id ? '#E6E8FF' : 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: selectedConversation?.id === conversation.id ? '1px solid #7B7FFF' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedConversation?.id !== conversation.id) {
                  e.currentTarget.style.backgroundColor = '#F0F2FF';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedConversation?.id !== conversation.id) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* Avatar */}
              <div style={{ position: 'relative', marginRight: '12px' }}>
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: getAvatarColor(conversation),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {getAvatarContent(conversation)}
                </Avatar>
                
                {/* Online indicator for personal chats */}
                {conversation.type === 'personal' && (conversation.onlineCount || 0) > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#52C41A',
                    borderRadius: '50%',
                    border: '2px solid white'
                  }} />
                )}
              </div>

              {/* Conversation Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <Text strong style={{ 
                    fontSize: '14px',
                    color: selectedConversation?.id === conversation.id ? '#7B7FFF' : '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {getConversationName(conversation)}
                  </Text>
                  
                  {/* Conversation type icon */}
                  <div style={{ marginLeft: '8px' }}>
                    {conversation.type === 'group' ? (
                      <TeamOutlined style={{ color: '#7B7FFF', fontSize: '12px' }} />
                    ) : (
                      <UserOutlined style={{ color: '#4B4BFF', fontSize: '12px' }} />
                    )}
                  </div>
                </div>
                
                <Text style={{ 
                  fontSize: '12px',
                  color: '#666',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {getMemberCountText(conversation)}
                </Text>
                
                {/* Last message preview */}
                <Text style={{ 
                  fontSize: '12px',
                  color: '#999',
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginTop: '2px'
                }}>
                  {conversation.lastMessage || 'No messages yet'}
                </Text>
              </div>

              {/* Status indicators */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-end',
                marginLeft: '8px'
              }}>
                {/* Unread badge */}
                {(conversation.unreadCount || 0) > 0 && (
                  <Badge count={conversation.unreadCount} size="small" />
                )}
                
                {/* Pinned indicator */}
                {conversation.isPinned && (
                  <Tooltip title="Pinned">
                    <CheckOutlined style={{ 
                      color: '#7B7FFF', 
                      fontSize: '12px',
                      marginTop: '4px'
                    }} />
                  </Tooltip>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar; 