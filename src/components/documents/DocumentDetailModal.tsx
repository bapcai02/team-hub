import React from 'react';
import { 
  Modal, 
  Descriptions, 
  Tag, 
  Space, 
  Button, 
  Typography, 
  Divider,
  List,
  Avatar
} from 'antd';
import { 
  DownloadOutlined, 
  EditOutlined, 
  UserOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Document } from '../../features/documents/types';
import { formatFileSize, getFileIcon, getFileTypeName } from '../../utils/documentUtils';

const { Title, Text, Paragraph } = Typography;

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

  if (!document) return null;

  const handleDownload = async () => {
    try {
      // Implement download logic
      console.log('Downloading document:', document.id);
    } catch (error) {
      console.error('Download failed:', error);
    }
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

  return (
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
      width={800}
    >
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
            {getFileIcon(document.file_type || '')}
            <Text>{document.file_name}</Text>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label={t('documents.fileType')}>
          {getFileTypeName(document.file_type)}
        </Descriptions.Item>

        <Descriptions.Item label={t('documents.fileSize')}>
          {formatFileSize(document.file_size)}
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
            <Text>{document.user?.name || '-'}</Text>
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

      <Divider />

      {/* Comments Section */}
      <div>
        <Title level={5}>
          <FileTextOutlined /> {t('documents.comments')}
        </Title>
        
        {/* Mock comments - replace with real data */}
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={[
            {
              author: 'John Doe',
              avatar: 'https://joeschmoe.io/api/v1/random',
              content: 'This document looks good!',
              datetime: '2024-01-15 14:30',
            },
            {
              author: 'Jane Smith',
              avatar: 'https://joeschmoe.io/api/v1/random',
              content: 'Please review the changes in section 3.',
              datetime: '2024-01-14 16:45',
            },
          ]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.author}
                description={
                  <div>
                    <div>{item.content}</div>
                    <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {item.datetime}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    </Modal>
  );
};

export default DocumentDetailModal; 