import React, { useState, useEffect } from 'react';
import { 
  List, 
  Avatar, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Tooltip,
  message,
  Modal,
  Form,
  Popconfirm
} from 'antd';
import { 
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  LikeOutlined,
  DislikeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import { Document, DocumentComment } from '../../features/documents/types';
import { addDocumentComment } from '../../features/documents/documentsSlice';

const { TextArea } = Input;
const { Text } = Typography;

interface DocumentCommentsProps {
  document: Document | null;
  comments: DocumentComment[];
  onCommentAdded?: (comment: DocumentComment) => void;
  onCommentUpdated?: (comment: DocumentComment) => void;
  onCommentDeleted?: (commentId: number) => void;
}

const DocumentComments: React.FC<DocumentCommentsProps> = ({
  document,
  comments = [],
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<DocumentComment | null>(null);
  const [editText, setEditText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<DocumentComment | null>(null);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !document) return;

    setSubmitting(true);
    try {
      const commentData = {
        content: newComment,
        parent_id: replyTo?.id || null,
      };

      const result = await dispatch(addDocumentComment({
        documentId: document.id,
        data: commentData
      })).unwrap();

      setNewComment('');
      setReplyTo(null);
      onCommentAdded?.(result);
      message.success(t('documents.commentAdded'));
    } catch (error: any) {
      message.error(error || t('documents.failedToAddComment'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async () => {
    if (!editingComment || !editText.trim()) return;

    setSubmitting(true);
    try {
      // TODO: Implement API call to update comment
      message.success(t('documents.commentUpdated'));
      setEditingComment(null);
      setEditText('');
      onCommentUpdated?.(editingComment);
    } catch (error: any) {
      message.error(error || t('documents.failedToUpdateComment'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (comment: DocumentComment) => {
    try {
      // TODO: Implement API call to delete comment
      message.success(t('documents.commentDeleted'));
      onCommentDeleted?.(comment.id);
    } catch (error: any) {
      message.error(error || t('documents.failedToDeleteComment'));
    }
  };

  const handleLikeComment = async (comment: DocumentComment) => {
    try {
      // TODO: Implement like functionality
      message.success(t('documents.commentLiked'));
    } catch (error) {
      message.error(t('documents.failedToLikeComment'));
    }
  };

  const handleReply = (comment: DocumentComment) => {
    setReplyTo(comment);
    setNewComment(`@${comment.user?.name || 'Unknown'} `);
  };

  const startEdit = (comment: DocumentComment) => {
    setEditingComment(comment);
    setEditText(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditText('');
  };

  const canEditComment = (comment: DocumentComment) => {
    // TODO: Check user permissions
    return true; // For now, allow all users to edit
  };

  const canDeleteComment = (comment: DocumentComment) => {
    // TODO: Check user permissions
    return true; // For now, allow all users to delete
  };

  const renderComment = (comment: DocumentComment) => (
    <List.Item
      actions={[
        <Tooltip title={t('documents.like')}>
          <Button 
            type="text" 
            icon={<LikeOutlined />}
            onClick={() => handleLikeComment(comment)}
          >
            {comment.likes_count || 0}
          </Button>
        </Tooltip>,
        <Tooltip title={t('documents.reply')}>
          <Button 
            type="text" 
            icon={<MessageOutlined />}
            onClick={() => handleReply(comment)}
          />
        </Tooltip>,
        canEditComment(comment) && (
          <Tooltip title={t('common.edit')}>
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => startEdit(comment)}
            />
          </Tooltip>
        ),
        canDeleteComment(comment) && (
          <Popconfirm
            title={t('documents.deleteCommentConfirm')}
            onConfirm={() => handleDeleteComment(comment)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Tooltip title={t('common.delete')}>
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        ),
      ]}
    >
      <List.Item.Meta
        avatar={
          <Avatar 
            src={comment.user?.avatar} 
            icon={<UserOutlined />}
          />
        }
        title={
          <Space>
            <Text strong>{comment.user?.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(comment.created_at).toLocaleString()}
            </Text>
            {comment.is_edited && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                ({t('documents.edited')})
              </Text>
            )}
          </Space>
        }
        description={
          editingComment?.id === comment.id ? (
            <div>
              <TextArea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={3}
                style={{ marginBottom: 8 }}
              />
              <Space>
                <Button 
                  type="primary" 
                  size="small"
                  loading={submitting}
                  onClick={handleEditComment}
                >
                  {t('common.save')}
                </Button>
                <Button 
                  size="small"
                  onClick={cancelEdit}
                >
                  {t('common.cancel')}
                </Button>
              </Space>
            </div>
          ) : (
            <div>
              {replyTo?.id === comment.id && (
                <div style={{ marginBottom: 8, padding: 8, background: '#f0f0f0', borderRadius: 4 }}>
                  <Text type="secondary">
                    {t('documents.replyingTo')} {comment.user?.name}
                  </Text>
                </div>
              )}
              <Text>{comment.content}</Text>
            </div>
          )
        }
      />
    </List.Item>
  );

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text strong>{t('documents.comments')} ({comments.length})</Text>
      </div>

      {/* Add Comment */}
      <div style={{ marginBottom: 16 }}>
        {replyTo && (
          <div style={{ marginBottom: 8, padding: 8, background: '#e6f7ff', borderRadius: 4 }}>
            <Space>
              <Text type="secondary">
                {t('documents.replyingTo')} {replyTo.user?.name}
              </Text>
              <Button 
                type="text" 
                size="small"
                onClick={() => {
                  setReplyTo(null);
                  setNewComment('');
                }}
              >
                {t('common.cancel')}
              </Button>
            </Space>
          </div>
        )}
        
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t('documents.addCommentPlaceholder')}
            rows={3}
            style={{ flex: 1 }}
            onPressEnter={(e) => {
              if (e.ctrlKey || e.metaKey) {
                handleSubmitComment();
              }
            }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            loading={submitting}
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            {t('common.send')}
          </Button>
        </Space.Compact>
        
        <div style={{ marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('documents.commentHint')}
          </Text>
        </div>
      </div>

      {/* Comments List */}
      <List
        className="comment-list"
        itemLayout="horizontal"
        dataSource={comments}
        renderItem={renderComment}
        locale={{
          emptyText: t('documents.noComments'),
        }}
      />
    </div>
  );
};

export default DocumentComments; 