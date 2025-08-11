import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Badge, Button, Tooltip } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { UIMessage } from '../../types/chat';

interface MessageListProps {
  messages: UIMessage[];
  onAddReaction?: (messageId: number, emoji: string) => void;
  onRemoveReaction?: (messageId: number, emoji: string) => void;
}

const emojiIconMap: Record<string, string> = {
  '👍': '👍',
  '❤️': '❤️',
  '😂': '😂',
  '😮': '😮',
  '😢': '😢',
  '😡': '😡',
  '🔥': '🔥',
  '👏': '👏',
  '🎉': '🎉',
};

const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '👏', '🎉'];

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onAddReaction, 
  onRemoveReaction 
}) => {
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [showReactions, setShowReactions] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowReactions(null);
      }
    }
    if (showReactions !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  const handleReactionClick = (messageId: number, emoji: string) => {
    if (onAddReaction) {
      onAddReaction(messageId, emoji);
    }
    setShowReactions(null);
  };

  const handleRemoveReaction = (messageId: number, emoji: string) => {
    if (onRemoveReaction) {
      onRemoveReaction(messageId, emoji);
    }
  };

  // Helper function to check if messages are from the same user and consecutive
  const shouldShowAvatar = (message: UIMessage, index: number) => {
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    if (!prevMessage) return true;
    
    const timeDiff = Math.abs(
      new Date(message.createdAt || '').getTime() - 
      new Date(prevMessage.createdAt || '').getTime()
    );
    const fiveMinutes = 5 * 60 * 1000;
    
    const shouldShow = (
      message.senderId !== prevMessage.senderId ||
      timeDiff > fiveMinutes
    );
    
    // Debug logging
    console.log(`Message ${index}:`, {
      messageId: message.id,
      senderId: message.senderId,
      isOwn: message.isOwn,
      prevSenderId: prevMessage.senderId,
      prevIsOwn: prevMessage.isOwn,
      timeDiff,
      shouldShow
    });
    
    return shouldShow;
  };

  // Helper function to check if this is the last message in a group
  const isLastInGroup = (message: UIMessage, index: number) => {
    if (index === messages.length - 1) return true;
    
    const nextMessage = messages[index + 1];
    if (!nextMessage) return true;
    
    const timeDiff = Math.abs(
      new Date(message.createdAt || '').getTime() - 
      new Date(nextMessage.createdAt || '').getTime()
    );
    const fiveMinutes = 5 * 60 * 1000;
    
    return (
      message.senderId !== nextMessage.senderId ||
      timeDiff > fiveMinutes
    );
  };

  // Helper function to get border radius for grouped messages
  const getMessageBorderRadius = (message: UIMessage, index: number, messages: UIMessage[]) => {
    const isFirst = shouldShowAvatar(message, index);
    const isLast = isLastInGroup(message, index);
    
    if (message.isOwn) {
      if (isFirst && isLast) return '12px';
      if (isFirst) return '12px 12px 4px 12px';
      if (isLast) return '12px 4px 12px 12px';
      return '12px 4px 4px 12px';
    } else {
      if (isFirst && isLast) return '12px';
      if (isFirst) return '12px 12px 12px 4px';
      if (isLast) return '4px 12px 12px 12px';
      return '4px 12px 12px 4px';
    }
  };

  if (!messages || messages.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#999',
        padding: '24px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>No messages yet</div>
        <div style={{ fontSize: '14px', textAlign: 'center' }}>Start the conversation by sending your first message</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      height: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {messages.map((message, index) => {
        const showAvatar = shouldShowAvatar(message, index);
        const isLast = isLastInGroup(message, index);
        
        return (
          <div
            key={message.id || index}
            style={{
              display: 'flex',
              justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
              marginBottom: isLast ? '12px' : '2px'
            }}
            onMouseEnter={() => setHoveredMessage(message.id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              maxWidth: '70%',
              position: 'relative'
            }}>
              {/* Avatar for other users - only show for first message in group */}
              {!message.isOwn && showAvatar && (
                <div style={{ position: 'relative' }}>
                  <Avatar
                    size={32}
                    style={{
                      backgroundColor: message.avatar ? undefined : '#1890ff',
                      marginBottom: '4px'
                    }}
                    src={message.avatar}
                  >
                    {message.sender?.charAt(0)}
                  </Avatar>
                  
                  {/* Online/offline status */}
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: message.isOnline ? '#52c41a' : '#d9d9d9',
                    border: '2px solid #fff'
                  }} />
                </div>
              )}
              
              {/* Invisible spacer for grouped messages without avatar */}
              {!message.isOwn && !showAvatar && (
                <div style={{ width: '40px' }} />
              )}

              {/* Message bubble */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isOwn ? 'flex-end' : 'flex-start',
                minWidth: 'fit-content'
              }}>
                {/* Sender name for group chats - only show for first message in group */}
                {!message.isOwn && message.sender && showAvatar && (
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '4px',
                    marginLeft: '4px'
                  }}>
                    {message.sender}
                  </div>
                )}

                {/* Message content */}
                <div style={{
                  padding: '8px 12px',
                  borderRadius: getMessageBorderRadius(message, index, messages),
                  backgroundColor: message.isOwn ? '#1890ff' : '#f0f0f0',
                  color: message.isOwn ? '#fff' : '#000',
                  maxWidth: '100%',
                  wordWrap: 'break-word',
                  position: 'relative',
                  alignSelf: message.isOwn ? 'flex-end' : 'flex-start'
                }}>
                  {message.content}
                  
                  {/* Read receipts for own messages */}
                  {message.isOwn && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-16px',
                      right: '0',
                      fontSize: '10px',
                      color: '#999'
                    }}>
                      {message.readBy && message.readBy.length > 0 ? '✓✓' : '✓'}
                    </div>
                  )}
                </div>

                {/* Reactions */}
                {Object.entries(message.uiReactions || {}).map(([emoji, count]) => {
                  if (typeof count === 'number' && count > 0) {
                    const users = message.uiReactions?.users?.[emoji] || [];
                    const tooltipText = users.length > 0 
                      ? `${emoji} by ${users.join(', ')}`
                      : `${emoji} reaction`;
                    
                    return (
                      <Tooltip key={emoji} title={tooltipText}>
                        <span 
                          style={{ 
                            fontSize: '16px', 
                            cursor: 'pointer',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            backgroundColor: '#fff3cd',
                            border: '1px solid #ffeaa7',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                          }}
                          onClick={() => handleRemoveReaction(message.id, emoji)}
                        >
                          {emoji} {count}
                        </span>
                      </Tooltip>
                    );
                  }
                  return null;
                })}

                {/* Timestamp */}
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '4px',
                  marginLeft: message.isOwn ? '0' : '4px',
                  marginRight: message.isOwn ? '4px' : '0'
                }}>
                  {message.time}
                </div>

                {/* Reaction button - show on hover */}
                {hoveredMessage === message.id && (
                  <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: message.isOwn ? 'auto' : '0',
                    left: message.isOwn ? '0' : 'auto',
                    zIndex: 10
                  }}>
                    <Tooltip title="Add reaction">
                      <Button
                        type="text"
                        size="small"
                        icon={<SmileOutlined />}
                        onClick={() => setShowReactions(showReactions === message.id ? null : message.id)}
                        style={{
                          backgroundColor: '#fff',
                          border: '1px solid #d9d9d9',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      />
                    </Tooltip>
                  </div>
                )}

                {/* Emoji picker */}
                {showReactions === message.id && (
                  <div
                    ref={pickerRef}
                    style={{
                      position: 'absolute',
                      top: '-40px',
                      right: message.isOwn ? 'auto' : '0',
                      left: message.isOwn ? '0' : 'auto',
                      backgroundColor: '#fff',
                      border: '1px solid #d9d9d9',
                      borderRadius: '8px',
                      padding: '8px',
                      display: 'flex',
                      gap: '4px',
                      flexWrap: 'wrap',
                      maxWidth: '200px',
                      zIndex: 20,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}
                  >
                    {commonEmojis.map((emoji) => (
                      <Tooltip key={emoji} title={emoji}>
                        <span
                          style={{
                            fontSize: '20px',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f0f0f0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                          onClick={() => handleReactionClick(message.id, emoji)}
                        >
                          {emoji}
                        </span>
                      </Tooltip>
                    ))}
                  </div>
                )}
              </div>

              {/* Avatar for own messages - only show for first message in group */}
              {message.isOwn && showAvatar && (
                <div style={{ position: 'relative' }}>
                  <Avatar
                    size={32}
                    style={{
                      backgroundColor: message.avatar ? undefined : '#1890ff',
                      marginBottom: '4px'
                    }}
                    src={message.avatar}
                  >
                    {message.sender?.charAt(0)}
                  </Avatar>
                  
                  {/* Online status for own messages */}
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: message.isOnline ? '#52c41a' : '#d9d9d9',
                    border: '2px solid #fff'
                  }} />
                </div>
              )}
              
              {/* Invisible spacer for grouped own messages without avatar */}
              {message.isOwn && !showAvatar && (
                <div style={{ width: '40px' }} />
              )}
            </div>
          </div>
        );
      })}
      
      {/* Invisible div for auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 