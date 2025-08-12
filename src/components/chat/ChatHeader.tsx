import React from 'react';
import { Typography, Avatar, Button, Tooltip } from 'antd';
import { SearchOutlined, PhoneOutlined, MoreOutlined } from '@ant-design/icons';
import { UIConversation } from '../../types/chat';

const { Text } = Typography;

interface ChatHeaderProps {
  conversation: UIConversation;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  // Helper function to get conversation display name
  const getConversationName = () => {
    if (conversation.name) return conversation.name;
    if (conversation.type === 'group') return 'Group Chat';
    return 'Personal Chat';
  };

  // Helper function to get member count text
  const getMemberCountText = () => {
    if (conversation.type === 'group') {
      const memberCount = conversation.participants?.length || 0;
      const onlineCount = conversation.onlineCount || 0;
      return `${memberCount} member${memberCount !== 1 ? 's' : ''}${onlineCount > 0 ? `, ${onlineCount} online` : ''}`;
    }
    return 'Personal chat';
  };

  // Helper function to get avatar content
  const getAvatarContent = () => {
    if (conversation.type === 'group') {
      return conversation.avatar || 'G';
    }
    return conversation.avatar || 'U';
  };

  // Helper function to get avatar color
  const getAvatarColor = () => {
    if (conversation.type === 'group') {
      return '#7B7FFF';
    }
    return '#4B4BFF';
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #f0f0f0',
      borderTop: '1px solid #f0f0f0'
    }}>
      {/* Left side - Conversation info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: getAvatarColor(),
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            {getAvatarContent()}
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

        {/* Conversation details */}
        <div>
          <Text strong style={{ fontSize: '16px', display: 'block' }}>
            {getConversationName()}
          </Text>
          <Text style={{ fontSize: '12px', color: '#666' }}>
            {getMemberCountText()}
          </Text>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Tooltip title="Search messages">
          <Button
            type="text"
            icon={<SearchOutlined />}
            size="small"
            style={{ color: '#666' }}
          />
        </Tooltip>
        
        <Tooltip title="Voice call">
          <Button
            type="text"
            icon={<PhoneOutlined />}
            size="small"
            style={{ color: '#666' }}
          />
        </Tooltip>
        
        <Tooltip title="More options">
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            style={{ color: '#666' }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default ChatHeader; 