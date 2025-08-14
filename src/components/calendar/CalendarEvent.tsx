import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { 
  fetchReplies, 
  createReply, 
  updateReply, 
  deleteReply 
} from '../../features/calendar/calendarSlice';
import { CalendarEvent as CalendarEventType, CalendarEventReply, CreateEventReplyRequest } from '../../features/calendar/types';
import { calendarSocketService } from '../../services/calendarSocket.service';
import { formatDate } from '../../utils/formatDate';
import { useTranslation } from 'react-i18next';
import { Card, Button, Input, Space, Typography, Avatar, Divider, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface CalendarEventProps {
  event: CalendarEventType;
  onEdit: () => void;
  onDelete: () => void;
}

const CalendarEvent: React.FC<CalendarEventProps> = ({ event, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { replies, loading } = useAppSelector(state => state.calendar);
  
  const [showReplies, setShowReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editingReply, setEditingReply] = useState<CalendarEventReply | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();

  useEffect(() => {
    // Get current user ID
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUserId(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Socket event listeners for replies
    calendarSocketService.onReplyCreated((reply: any) => {
      if (reply.event_id === event.id) {
        dispatch(fetchReplies(event.id));
      }
    });
    
    calendarSocketService.onReplyUpdated((reply: any) => {
      if (reply.event_id === event.id) {
        dispatch(fetchReplies(event.id));
      }
    });
    
    calendarSocketService.onReplyDeleted((data: { id: number }) => {
      dispatch(fetchReplies(event.id));
    });

    return () => {
      // Cleanup socket listeners
    };
  }, [event.id, dispatch]);

  const handleShowReplies = () => {
    if (!showReplies) {
      dispatch(fetchReplies(event.id));
    }
    setShowReplies(!showReplies);
  };

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const replyData: CreateEventReplyRequest = {
        content: replyContent.trim(),
      };
      
      await dispatch(createReply({ eventId: event.id, data: replyData })).unwrap();
      setReplyContent('');
      message.success(t('calendar.replySent'));
    } catch (error) {
      console.error('Failed to create reply:', error);
      message.error(t('calendar.replyError'));
    }
  };

  const handleEditReply = async (replyId: number, content: string) => {
    try {
      await dispatch(updateReply({ 
        eventId: event.id, 
        replyId, 
        data: { content } 
      })).unwrap();
      setEditingReply(null);
      message.success(t('calendar.replyUpdated'));
    } catch (error) {
      console.error('Failed to update reply:', error);
      message.error(t('calendar.replyUpdateError'));
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    try {
      await dispatch(deleteReply({ eventId: event.id, replyId })).unwrap();
      message.success(t('calendar.replyDeleted'));
    } catch (error) {
      console.error('Failed to delete reply:', error);
      message.error(t('calendar.replyDeleteError'));
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      meeting: '#1890ff',
      task: '#52c41a',
      reminder: '#faad14',
      other: '#722ed1'
    };
    return colors[type as keyof typeof colors] || '#1890ff';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: '#1890ff',
      ongoing: '#52c41a',
      completed: '#52c41a',
      cancelled: '#ff4d4f'
    };
    return colors[status as keyof typeof colors] || '#1890ff';
  };

  const isOwnedByCurrentUser = () => {
    return currentUserId === event.user_id;
  };

  return (
    <Card
      style={{
        marginBottom: '16px',
        borderLeft: `4px solid ${getEventTypeColor(event.event_type)}`,
      }}
      actions={[
        <Button 
          type="text" 
          icon={<MessageOutlined />}
          onClick={handleShowReplies}
        >
          {event.reply_count || 0} {t('calendar.replies')}
        </Button>,
        isOwnedByCurrentUser() && (
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={onEdit}
          >
            {t('calendar.edit')}
          </Button>
        ),
        isOwnedByCurrentUser() && (
          <Button 
            type="text" 
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
          >
            {t('calendar.delete')}
          </Button>
        )
      ].filter(Boolean)}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <Title level={4} style={{ margin: 0, color: getEventTypeColor(event.event_type) }}>
            {event.title}
          </Title>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              backgroundColor: getEventTypeColor(event.event_type) + '20',
              color: getEventTypeColor(event.event_type)
            }}>
              {t(`calendar.eventType.${event.event_type}`)}
            </span>
            <span style={{ 
              padding: '2px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              backgroundColor: getStatusColor(event.status) + '20',
              color: getStatusColor(event.status)
            }}>
              {t(`calendar.status.${event.status}`)}
            </span>
          </div>
        </div>

        {event.description && (
          <Text style={{ color: '#666', marginBottom: '8px', display: 'block' }}>
            {event.description}
          </Text>
        )}

        <div style={{ marginBottom: '8px' }}>
          <Text strong>{t('calendar.startTime')}:</Text> {formatDate(event.start_time)}
        </div>
        <div style={{ marginBottom: '8px' }}>
          <Text strong>{t('calendar.endTime')}:</Text> {formatDate(event.end_time)}
        </div>

        {event.location && (
          <div style={{ marginBottom: '8px' }}>
            <Text strong>{t('calendar.location')}:</Text> {event.location}
          </div>
        )}

        {event.user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <Avatar size="small" style={{ backgroundColor: getEventTypeColor(event.event_type) }}>
              {event.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Text style={{ fontSize: '12px', color: '#666' }}>
              {event.user.name}
            </Text>
          </div>
        )}

        {/* Replies Section */}
        {showReplies && (
          <div style={{ marginTop: '16px' }}>
            <Divider style={{ margin: '12px 0' }} />
            
            {/* Reply Input */}
            <div style={{ marginBottom: '16px' }}>
              <TextArea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={t('calendar.addReply')}
                rows={2}
                style={{ marginBottom: '8px' }}
              />
              <Button 
                type="primary" 
                icon={<SendOutlined />}
                onClick={handleSubmitReply}
                disabled={!replyContent.trim()}
                size="small"
              >
                {t('calendar.send')}
              </Button>
            </div>

            {/* Replies List */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                {t('calendar.loading')}
              </div>
            ) : replies.length > 0 ? (
              <div>
                {replies.map((reply) => (
                  <div key={reply.id} style={{ marginBottom: '12px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <Avatar size="small">
                          {reply.user?.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Text strong style={{ fontSize: '12px' }}>
                          {reply.user?.name}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#999' }}>
                          {formatDate(reply.created_at)}
                        </Text>
                      </div>
                      
                      {currentUserId === reply.user_id && (
                        <Space size="small">
                          <Button 
                            type="text" 
                            size="small"
                            onClick={() => setEditingReply(reply)}
                          >
                            {t('calendar.edit')}
                          </Button>
                          <Button 
                            type="text" 
                            size="small"
                            danger
                            onClick={() => handleDeleteReply(reply.id)}
                          >
                            {t('calendar.delete')}
                          </Button>
                        </Space>
                      )}
                    </div>
                    
                    {editingReply?.id === reply.id ? (
                      <div>
                        <TextArea
                          defaultValue={reply.content}
                          rows={2}
                          style={{ marginBottom: '8px' }}
                          onPressEnter={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            handleEditReply(reply.id, target.value);
                          }}
                        />
                        <Space>
                          <Button 
                            size="small"
                            onClick={() => {
                              const target = document.querySelector(`textarea[data-reply-id="${reply.id}"]`) as HTMLTextAreaElement;
                              handleEditReply(reply.id, target.value);
                            }}
                          >
                            {t('calendar.update')}
                          </Button>
                          <Button 
                            size="small"
                            onClick={() => setEditingReply(null)}
                          >
                            {t('calendar.cancel')}
                          </Button>
                        </Space>
                      </div>
                    ) : (
                      <Text style={{ fontSize: '13px' }}>
                        {reply.content}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
                {t('calendar.noReplies')}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default CalendarEvent; 