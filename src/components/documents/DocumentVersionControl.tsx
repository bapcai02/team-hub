import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  List, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Tooltip,
  message,
  Upload,
  Form,
  Input
} from 'antd';
import { 
  HistoryOutlined,
  UploadOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  FileTextOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import { Document } from '../../features/documents/types';
import { formatFileSize } from '../../utils/documentUtils';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface DocumentVersion {
  id: number;
  version: string;
  file_name: string;
  file_size: number;
  file_type: string;
  created_at: string;
  created_by: {
    id: number;
    name: string;
  };
  change_log: string;
  is_current: boolean;
}

interface DocumentVersionControlProps {
  visible: boolean;
  document: Document | null;
  onCancel: () => void;
  onVersionChange?: (version: DocumentVersion) => void;
}

const DocumentVersionControl: React.FC<DocumentVersionControlProps> = ({
  visible,
  document,
  onCancel,
  onVersionChange
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && document) {
      fetchVersions();
    }
  }, [visible, document]);

  const fetchVersions = async () => {
    if (!document) return;
    
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockVersions: DocumentVersion[] = [
        {
          id: 1,
          version: '1.0',
          file_name: 'document_v1.0.pdf',
          file_size: 1024000,
          file_type: 'application/pdf',
          created_at: '2024-01-15T10:30:00Z',
          created_by: { id: 1, name: 'John Doe' },
          change_log: 'Initial version',
          is_current: true,
        },
        {
          id: 2,
          version: '1.1',
          file_name: 'document_v1.1.pdf',
          file_size: 1056000,
          file_type: 'application/pdf',
          created_at: '2024-01-20T14:45:00Z',
          created_by: { id: 2, name: 'Jane Smith' },
          change_log: 'Updated section 3 with new requirements',
          is_current: false,
        },
        {
          id: 3,
          version: '1.2',
          file_name: 'document_v1.2.pdf',
          file_size: 1088000,
          file_type: 'application/pdf',
          created_at: '2024-01-25T09:15:00Z',
          created_by: { id: 1, name: 'John Doe' },
          change_log: 'Fixed typos and updated formatting',
          is_current: false,
        },
      ];
      setVersions(mockVersions);
    } catch (error) {
      message.error(t('documents.failedToLoadVersions'));
    } finally {
      setLoading(false);
    }
  };

  const handleUploadNewVersion = async (values: any) => {
    try {
      // TODO: Implement API call to upload new version
      message.success(t('documents.versionUploaded'));
      setUploadModalVisible(false);
      form.resetFields();
      fetchVersions();
    } catch (error) {
      message.error(t('documents.failedToUploadVersion'));
    }
  };

  const handleDownloadVersion = async (version: DocumentVersion) => {
    try {
      // TODO: Implement download logic
      message.success(t('documents.downloadStarted'));
    } catch (error) {
      message.error(t('documents.downloadFailed'));
    }
  };

  const handleViewVersion = (version: DocumentVersion) => {
    setSelectedVersion(version);
  };

  const handleDeleteVersion = async (version: DocumentVersion) => {
    try {
      // TODO: Implement delete logic
      message.success(t('documents.versionDeleted'));
      fetchVersions();
    } catch (error) {
      message.error(t('documents.failedToDeleteVersion'));
    }
  };

  const handleRestoreVersion = async (version: DocumentVersion) => {
    try {
      // TODO: Implement restore logic
      message.success(t('documents.versionRestored'));
      fetchVersions();
      onVersionChange?.(version);
    } catch (error) {
      message.error(t('documents.failedToRestoreVersion'));
    }
  };

  const getVersionColor = (version: DocumentVersion) => {
    if (version.is_current) return 'green';
    return 'default';
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <HistoryOutlined />
            <span>{t('documents.versionHistory')}</span>
            {document && (
              <Text type="secondary">
                - {document.title}
              </Text>
            )}
          </Space>
        }
        open={visible}
        onCancel={onCancel}
        footer={null}
        width={800}
      >
        <div style={{ marginBottom: 16 }}>
          <Button 
            type="primary" 
            icon={<UploadOutlined />}
            onClick={() => setUploadModalVisible(true)}
          >
            {t('documents.uploadNewVersion')}
          </Button>
        </div>

        <List
          loading={loading}
          dataSource={versions}
          renderItem={(version) => (
            <List.Item
              actions={[
                <Tooltip title={t('common.view')}>
                  <Button 
                    type="text" 
                    icon={<EyeOutlined />}
                    onClick={() => handleViewVersion(version)}
                  />
                </Tooltip>,
                <Tooltip title={t('common.download')}>
                  <Button 
                    type="text" 
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadVersion(version)}
                  />
                </Tooltip>,
                !version.is_current && (
                  <Tooltip title={t('documents.restoreVersion')}>
                    <Button 
                      type="text" 
                      icon={<HistoryOutlined />}
                      onClick={() => handleRestoreVersion(version)}
                    />
                  </Tooltip>
                ),
                !version.is_current && (
                  <Tooltip title={t('common.delete')}>
                    <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteVersion(version)}
                    />
                  </Tooltip>
                ),
              ]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24 }} />}
                title={
                  <Space>
                    <Text strong>v{version.version}</Text>
                    {version.is_current && (
                      <Tag color="green">{t('documents.currentVersion')}</Tag>
                    )}
                  </Space>
                }
                description={
                  <div>
                    <div>
                      <Text type="secondary">
                        {t('documents.uploadedBy')}: {version.created_by.name}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        {t('documents.uploadedAt')}: {new Date(version.created_at).toLocaleString()}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">
                        {t('documents.fileSize')}: {formatFileSize(version.file_size)}
                      </Text>
                    </div>
                    {version.change_log && (
                      <div style={{ marginTop: 8 }}>
                        <Text>{version.change_log}</Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Upload New Version Modal */}
      <Modal
        title={t('documents.uploadNewVersion')}
        open={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUploadNewVersion}
        >
          <Form.Item
            name="version"
            label={t('documents.version')}
            rules={[{ required: true, message: t('documents.versionRequired') }]}
          >
            <Input placeholder="e.g., 1.3" />
          </Form.Item>

          <Form.Item
            name="change_log"
            label={t('documents.changeLog')}
            rules={[{ required: true, message: t('documents.changeLogRequired') }]}
          >
            <TextArea 
              rows={4} 
              placeholder={t('documents.changeLogPlaceholder')} 
            />
          </Form.Item>

          <Form.Item
            name="file"
            label={t('documents.file')}
            rules={[{ required: true, message: t('documents.fileRequired') }]}
          >
            <Upload.Dragger
              beforeUpload={() => false}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">{t('documents.dragAndDrop')}</p>
              <p className="ant-upload-hint">{t('documents.uploadHint')}</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {t('documents.upload')}
              </Button>
              <Button onClick={() => setUploadModalVisible(false)}>
                {t('common.cancel')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Version Detail Modal */}
      <Modal
        title={`${t('documents.version')} ${selectedVersion?.version}`}
        open={!!selectedVersion}
        onCancel={() => setSelectedVersion(null)}
        footer={
          <Space>
            <Button onClick={() => setSelectedVersion(null)}>
              {t('common.close')}
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => selectedVersion && handleDownloadVersion(selectedVersion)}
            >
              {t('common.download')}
            </Button>
          </Space>
        }
        width={600}
      >
        {selectedVersion && (
          <div>
            <Title level={5}>{t('documents.versionDetails')}</Title>
            <div>
              <Text strong>{t('documents.version')}:</Text> {selectedVersion.version}
            </div>
            <div>
              <Text strong>{t('documents.fileName')}:</Text> {selectedVersion.file_name}
            </div>
            <div>
              <Text strong>{t('documents.fileSize')}:</Text> {formatFileSize(selectedVersion.file_size)}
            </div>
            <div>
              <Text strong>{t('documents.uploadedBy')}:</Text> {selectedVersion.created_by.name}
            </div>
            <div>
              <Text strong>{t('documents.uploadedAt')}:</Text> {new Date(selectedVersion.created_at).toLocaleString()}
            </div>
            {selectedVersion.change_log && (
              <div style={{ marginTop: 16 }}>
                <Text strong>{t('documents.changeLog')}:</Text>
                <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
                  {selectedVersion.change_log}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default DocumentVersionControl; 