import React, { useState, useRef, useEffect } from 'react';
import { Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { UIMessage } from '../../types/chat';
import { useTranslation } from 'react-i18next';

interface MessageListProps {
  messages: UIMessage[];
  onAddReaction?: (messageId: number, emoji: string) => void;
  onRemoveReaction?: (messageId: number, emoji: string) => void;
  onDeleteMessage?: (messageId: number) => void;
  onQuoteMessage?: (message: UIMessage) => void;
}


const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onAddReaction, 
  onRemoveReaction,
  onDeleteMessage,
  onQuoteMessage
}) => {
  const { t } = useTranslation();
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const reactionPickerRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (reactionPickerRef.current && !reactionPickerRef.current.contains(event.target as Node)) {
        setShowReactionPicker(null);
      }
    }
    if (showReactionPicker !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactionPicker]);

  const handleReactionClick = (messageId: number, emoji: string) => {
    if (onAddReaction) {
      onAddReaction(messageId, emoji);
    }
    setShowReactionPicker(null);
  };

  const handleRemoveReaction = (messageId: number, emoji: string) => {
    if (onRemoveReaction) {
      onRemoveReaction(messageId, emoji);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      if (onDeleteMessage) {
        await onDeleteMessage(messageId);
        message.success(t('chat.message.deleteSuccess', 'Message deleted successfully'));
      }
      setShowDeleteModal(null);
    } catch (error) {
      console.error('Error deleting message:', error);
      message.error(t('chat.message.deleteError', 'Failed to delete message'));
    }
  };

  // Helper function to check if messages are from the same user and consecutive
  const shouldShowAvatar = (message: UIMessage, index: number) => {
    if (index === 0) return true;
    
    const prevMessage = messages[index - 1];
    if (!prevMessage) return true;
    
    const timeDiff = Math.abs(
      new Date((message as any).created_at || '').getTime() - 
      new Date((prevMessage as any).created_at || '').getTime()
    );
    const fiveMinutes = 5 * 60 * 1000;
    
    // Dùng user_id từ data thực tế thay vì senderId
    const currentUserId = (message as any).user_id;
    const prevUserId = (prevMessage as any).user_id;
    
    return (
      currentUserId !== prevUserId ||
      timeDiff > fiveMinutes
    );
  };

  // Helper function to check if this is the last message in a group
  const isLastInGroup = (message: UIMessage, index: number) => {
    if (index === messages.length - 1) return true;
    
    const nextMessage = messages[index + 1];
    if (!nextMessage) return true;
    
    const timeDiff = Math.abs(
      new Date((message as any).created_at || '').getTime() - 
      new Date((nextMessage as any).created_at || '').getTime()
    );
    const fiveMinutes = 5 * 60 * 1000;
    
    // Dùng user_id từ data thực tế thay vì senderId
    const currentUserId = (message as any).user_id;
    const nextUserId = (nextMessage as any).user_id;
    
    return (
      currentUserId !== nextUserId ||
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
      gap: '12px',
      backgroundColor: '#ffffff' // White background
    }}>
      {messages.map((message, index) => {
        const isLast = isLastInGroup(message, index);
        
        return (
          <div
            key={message.id || index}
            style={{
              display: 'flex',
              justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
              marginBottom: isLast ? '4px' : '0px'
            }}
            onMouseEnter={() => setHoveredMessage(message.id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              maxWidth: '70%'
            }}>
              {/* Reply icon - always visible for messages with replies */}
              {(message as any).replyCount > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  color: '#1890ff',
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
                onClick={() => onQuoteMessage && onQuoteMessage(message)}
                title={`${(message as any).replyCount} replies`}
                >
                  💬
                </div>
              )}
              {/* Avatar for other users (left side) - only show for last message in group */}
              {!message.isOwn && isLast && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#666',
                  flexShrink: 0,
                  marginTop: '4px'
                }}>
                  {message.sender?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              
              {/* Spacer for other users when no avatar */}
              {!message.isOwn && !isLast && (
                <div style={{ width: '32px', flexShrink: 0 }}></div>
              )}
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isOwn ? 'flex-end' : 'flex-start'
              }}>
                <div 
                  style={{
                    backgroundColor: message.isOwn ? '#1890ff' : '#f0f0f0',
                    color: message.isOwn ? '#ffffff' : '#000000',
                    padding: '8px 12px',
                    borderRadius: getMessageBorderRadius(message, index, messages),
                    maxWidth: '100%',
                    wordWrap: 'break-word',
                    position: 'relative'
                  }}
                  onMouseEnter={() => setHoveredMessage(message.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {/* Reply preview */}
                  {(message as any).replyTo && (
                    <div style={{
                      borderLeft: '3px solid #1890ff',
                      paddingLeft: '8px',
                      marginBottom: '8px',
                      backgroundColor: 'rgba(24, 144, 255, 0.1)',
                      borderRadius: '4px',
                      padding: '6px 8px',
                      fontSize: '12px',
                      color: message.isOwn ? 'rgba(255, 255, 255, 0.8)' : '#666',
                      cursor: 'pointer'
                    }}
                    onClick={() => onQuoteMessage && onQuoteMessage((message as any).replyTo)}
                    title="Click to view original message"
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                        {(message as any).replyTo.sender}
                      </div>
                      <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap',
                        maxWidth: '200px'
                      }}>
                        {(message as any).replyTo.content}
                      </div>
                    </div>
                  )}
                  
                  {message.content}
                  

                  
                  {/* Reply icon - always visible for own messages */}
                  {message.isOwn && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      color: '#1890ff',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #d9d9d9'
                    }}
                    onClick={() => onQuoteMessage && onQuoteMessage(message)}
                    title={t('chat.message.quote', 'Quote message')}
                    >
                      💬
                    </div>
                  )}
                  
                  {/* Action buttons for other users' messages */}
                  {!message.isOwn && hoveredMessage === message.id && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      display: 'flex',
                      gap: '4px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      padding: '2px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #d9d9d9'
                    }}>
                      {/* Quote/Reply button */}
                      <button
                        onClick={() => onQuoteMessage && onQuoteMessage(message)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '2px',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px',
                          color: '#1890ff'
                        }}
                        title={t('chat.message.quote', 'Quote message')}
                      >
                        💬
                      </button>
                      
                      {/* Reaction button */}
                      <button
                        onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '2px',
                          borderRadius: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '20px',
                          height: '20px'
                        }}
                        title={t('chat.message.addReaction', 'Add reaction')}
                      >
                        😀
                      </button>
                    </div>
                  )}
                  
                  {/* Reply icon - always visible for other users' messages */}
                  {!message.isOwn && (
                    <div style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      color: '#1890ff',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #d9d9d9'
                    }}
                    onClick={() => onQuoteMessage && onQuoteMessage(message)}
                    title={t('chat.message.quote', 'Quote message')}
                    >
                      💬
                    </div>
                  )}
                </div>
                
                {/* Reactions */}
                {message.uiReactions && Object.keys(message.uiReactions).length > 0 && (
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginTop: '4px',
                    flexWrap: 'wrap'
                  }}>
                    {Object.entries(message.uiReactions).map(([emoji, count]) => {
                      if (typeof count === 'number' && count > 0) {
                        return (
                          <span
                            key={emoji}
                            style={{
                              backgroundColor: '#f0f0f0',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px'
                            }}
                            onClick={() => handleReactionClick(message.id, emoji)}
                          >
                            {emoji} {count}
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
                
                {/* Timestamp - only show for the very last message */}
                {index === messages.length - 1 && (
                  <div style={{
                    fontSize: '11px',
                    color: '#999',
                    marginTop: '2px',
                    textAlign: message.isOwn ? 'right' : 'left'
                  }}>
                    {message.time}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      
      <div ref={messagesEndRef} />
      
      {/* Reaction picker */}
      {showReactionPicker && (
        <div
          ref={reactionPickerRef}
          style={{
            position: 'absolute',
            backgroundColor: '#ffffff',
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            display: 'flex',
            gap: '4px',
            flexWrap: 'wrap',
            maxWidth: '200px'
          }}
        >
          {['😀', '😂', '😍', '😡', '😢', '👍', '👎', '❤️', '🔥', '👏'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                handleReactionClick(showReactionPicker, emoji);
                setShowReactionPicker(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <Modal
        title={t('chat.message.deleteConfirmTitle', 'Delete Message')}
        open={showDeleteModal !== null}
        onOk={() => showDeleteModal && handleDeleteMessage(showDeleteModal)}
        onCancel={() => setShowDeleteModal(null)}
        okText={t('common.delete', 'Delete')}
        cancelText={t('common.cancel', 'Cancel')}
        okType="danger"
        confirmLoading={false}
      >
        <p>{t('chat.message.deleteConfirmContent', 'Are you sure you want to delete this message? This action cannot be undone.')}</p>
      </Modal>
    </div>
  );
};

export default MessageList; 