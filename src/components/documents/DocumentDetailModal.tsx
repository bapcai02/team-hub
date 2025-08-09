import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Descriptions, 
  Tag, 
  Space, 
  Button, 
  Typography, 
  Divider,
  List,
  Avatar,
  Tabs,
  message
} from 'antd';
import { 
  DownloadOutlined, 
  EditOutlined, 
  UserOutlined,
  FileTextOutlined,
  HistoryOutlined,
  ShareAltOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Document } from '../../features/documents/types';
import { formatFileSize, getFileIcon, getFileTypeName } from '../../utils/documentUtils';
import DocumentVersionControl from './DocumentVersionControl';
import DocumentComments from './DocumentComments';
import DocumentSharing from './DocumentSharing';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface DocumentDetailModalProps {
  visible: boolean;
  document: Document | null;
  onCancel: () => void;
  onEdit: (document: Document) => void;
}

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  visible,
  document,
  onCancel,
  onEdit,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('details');
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const [sharingModalVisible, setSharingModalVisible] = useState(false);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (visible && document) {
      fetchComments();
    }
  }, [visible, document]);

  const fetchComments = async () => {
    try {
      // TODO: Replace with actual API call
      const mockComments = [
        {
          id: 1,
          content: 'This document looks good! Please review the changes in section 3.',
          user: { id: 1, name: 'John Doe', avatar: 'https://joeschmoe.io/api/v1/random' },
          created_at: '2024-01-15T14:30:00Z',
          likes_count: 2,
          is_edited: false,
        },
        {
          id: 2,
          content: 'I have some suggestions for the formatting. Can we make it more consistent?',
          user: { id: 2, name: 'Jane Smith', avatar: 'https://joeschmoe.io/api/v1/random' },
          created_at: '2024-01-14T16:45:00Z',
          likes_count: 1,
          is_edited: true,
        },
      ];
      setComments(mockComments);
    } catch (error) {
      message.error(t('documents.failedToLoadComments'));
    }
  };

  const handleDownload = async () => {
    try {
      // TODO: Implement download logic
      message.success(t('documents.downloadStarted'));
    } catch (error) {
      message.error(t('documents.downloadFailed'));
    }
  };

  const handleCommentAdded = (comment: any) => {
    setComments(prev => [comment, ...prev]);
  };

  const handleCommentUpdated = (updatedComment: any) => {
    setComments(prev => prev.map(c => c.id === updatedComment.id ? updatedComment : c));
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      project: 'blue',
      meeting: 'green',
      policy: 'orange',
      template: 'purple',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'warning',
      published: 'success',
      archived: 'default',
    };
    return colors[status] || 'default';
  };

  if (!document) return null;

  const tabItems = [
    {
      key: 'details',
      label: (
        <span>
          <FileTextOutlined />
          {t('documents.details')}
        </span>
      ),
      children: (
        <Descriptions column={2} bordered>
          <Descriptions.Item label={t('documents.title')} span={2}>
            <Title level={5} style={{ margin: 0 }}>
              {document.title}
            </Title>
          </Descriptions.Item>

          {document.description && (
            <Descriptions.Item label={t('documents.description')} span={2}>
              <Paragraph style={{ margin: 0 }}>
                {document.description}
              </Paragraph>
            </Descriptions.Item>
          )}

          <Descriptions.Item label={t('documents.fileName')}>
            <Space>
              {getFileIcon(
                document.uploads && document.uploads.length > 0 
                  ? document.uploads[0].mime_type?.split('/')[1] || ''
                  : document.file_type || ''
              )}
              <Text>
                {document.uploads && document.uploads.length > 0 
                  ? document.uploads[0].original_name 
                  : document.file_name}
              </Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label={t('documents.fileType')}>
            {getFileTypeName(
              document.uploads && document.uploads.length > 0 
                ? document.uploads[0].mime_type?.split('/')[1] || ''
                : document.file_type
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t('documents.fileSize')}>
            {formatFileSize(
              document.uploads && document.uploads.length > 0 
                ? document.uploads[0].size 
                : document.file_size || 0
            )}
          </Descriptions.Item>

          <Descriptions.Item label={t('documents.category')}>
            <Tag color={getCategoryColor(document.category)}>
              {t(`documents.categories.${document.category}`)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label={t('documents.status')}>
            <Tag color={getStatusColor(document.status)}>
              {t(`documents.statuses.${document.status}`)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label={t('documents.uploadedBy')}>
            <Space>
              <Avatar icon={<UserOutlined />} size="small" />
              <Text>{document.creator?.name || document.user?.name || 'Unknown User'}</Text>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item label={t('documents.uploadedAt')}>
            {new Date(document.created_at).toLocaleString()}
          </Descriptions.Item>

          {document.project && (
            <Descriptions.Item label={t('documents.project')} span={2}>
              <Text>{document.project.name}</Text>
            </Descriptions.Item>
          )}

          {document.tags && document.tags.length > 0 && (
            <Descriptions.Item label={t('documents.tags')} span={2}>
              <Space wrap>
                {document.tags.map(tag => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      ),
    },
    {
      key: 'comments',
      label: (
        <span>
          <CommentOutlined />
          {t('documents.comments')} ({comments.length})
        </span>
      ),
      children: (
        <DocumentComments
          document={document}
          comments={comments}
          onCommentAdded={handleCommentAdded}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />
      ),
    },
  ];

  return (
    <>
      <Modal
        title={
          <Space>
            {getFileIcon(document.file_type || '')}
            <span>{document.title}</span>
          </Space>
        }
        open={visible}
        onCancel={onCancel}
        footer={
          <Space>
            <Button onClick={onCancel}>
              {t('common.close')}
            </Button>
            <Button 
              icon={<HistoryOutlined />}
              onClick={() => setVersionModalVisible(true)}
            >
              {t('documents.versions')}
            </Button>
            <Button 
              icon={<ShareAltOutlined />}
              onClick={() => setSharingModalVisible(true)}
            >
              {t('documents.share')}
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              {t('common.download')}
            </Button>
            <Button 
              icon={<EditOutlined />}
              onClick={() => onEdit(document)}
            >
              {t('common.edit')}
            </Button>
          </Space>
        }
        width={900}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
        />
      </Modal>

      {/* Version Control Modal */}
      <DocumentVersionControl
        visible={versionModalVisible}
        document={document}
        onCancel={() => setVersionModalVisible(false)}
      />

      {/* Sharing Modal */}
      <DocumentSharing
        visible={sharingModalVisible}
        document={document}
        onCancel={() => setSharingModalVisible(false)}
      />
    </>
  );
};

export default DocumentDetailModal; 