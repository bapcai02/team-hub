import React, { useState, useEffect } from 'react';
import { Modal, List, Avatar, Typography, Button, Input, Space, Divider, Badge, Tooltip, Card } from 'antd';
import { UserOutlined, MessageOutlined, SendOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface ThreadedReply {
  id: number;
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  isOwn: boolean;
}

interface ThreadedRepliesProps {
  visible: boolean;
  onCancel: () => void;
  messageId?: number;
  onSendReply: (content: string) => void;
}

const ThreadedReplies: React.FC<ThreadedRepliesProps> = ({
  visible,
  onCancel,
  messageId,
  onSendReply
}) => {
  const { t } = useTranslation();
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mock threaded replies - replace with actual data from API
  const [replies, setReplies] = useState<ThreadedReply[]>([
    {
      id: 1,
      messageId: messageId || 1,
      senderId: 2,
      senderName: 'John Doe',
      content: 'This is a reply to the original message.',
      createdAt: '2024-01-15T10:35:00Z',
      isOwn: false
    },
    {
      id: 2,
      messageId: messageId || 1,
      senderId: 1,
      senderName: 'You',
      content: 'Thanks for the reply!',
      createdAt: '2024-01-15T10:36:00Z',
      isOwn: true
    }
  ]);

  const originalMessage = useSelector((state: RootState) => 
    state.chat.messages.find(msg => msg.id === messageId)
  );

  useEffect(() => {
    if (visible && messageId) {
      // Load threaded replies for this message
      loadThreadedReplies();
    }
  }, [visible, messageId]);

  const loadThreadedReplies = async () => {
    // TODO: Implement API call to load threaded replies
    console.log('Loading threaded replies for message:', messageId);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !messageId) return;

    setLoading(true);
    try {
      await onSendReply(replyContent);
      setReplyContent('');
      
      // Add the new reply to the list (optimistic update)
      const newReply: ThreadedReply = {
        id: Date.now(),
        messageId,
        senderId: 1, // Current user ID
        senderName: 'You',
        content: replyContent,
        createdAt: new Date().toISOString(),
        isOwn: true
      };
      setReplies([...replies, newReply]);
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageOutlined style={{ color: '#1890ff' }} />
          <span>{t('chat.thread.replies', 'Threaded Replies')}</span>
          <Badge count={replies.length} size="small" />
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <div style={{ maxHeight: '60vh', overflow: 'auto' }}>
        {/* Original Message */}
        {originalMessage && (
          <div style={{ marginBottom: '20px' }}>
            <Card size="small" style={{ backgroundColor: '#f8f9fa' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Avatar size={32} icon={<UserOutlined />}>
                  {originalMessage.sender.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Text strong style={{ fontSize: '14px' }}>
                      {originalMessage.sender}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatTime((originalMessage as any).created_at)}
                    </Text>
                  </div>
                  <Text style={{ fontSize: '14px' }}>
                    {originalMessage.content}
                  </Text>
                </div>
              </div>
            </Card>
          </div>
        )}

        <Divider style={{ margin: '16px 0' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {t('chat.thread.replies', 'Replies')} ({replies.length})
          </Text>
        </Divider>

        {/* Threaded Replies */}
        <List
          dataSource={replies}
          renderItem={(reply) => (
            <List.Item style={{ padding: '8px 0' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '12px',
                width: '100%',
                paddingLeft: reply.isOwn ? '0' : '20px'
              }}>
                <Avatar size={28} icon={<UserOutlined />}>
                  {reply.senderName.charAt(0)}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Text strong style={{ fontSize: '13px' }}>
                      {reply.senderName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {formatTime((reply as any).created_at)}
                    </Text>
                  </div>
                  <Text style={{ fontSize: '13px' }}>
                    {reply.content}
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />

        {/* Reply Input */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
          <div style={{ marginBottom: '12px' }}>
            <Text strong style={{ fontSize: '14px' }}>
              {t('chat.thread.addReply', 'Add Reply')}
            </Text>
          </div>
          
          <TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={t('chat.thread.replyPlaceholder', 'Type your reply...')}
            rows={3}
            maxLength={500}
            showCount
            style={{ marginBottom: '12px' }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Space>
              <Button onClick={onCancel}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendReply}
                loading={loading}
                disabled={!replyContent.trim()}
              >
                {t('chat.thread.sendReply', 'Send Reply')}
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ThreadedReplies; 