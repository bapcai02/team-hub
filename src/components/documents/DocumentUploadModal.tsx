import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  Upload, 
  Button, 
  message, 
  Tag,
  Space,
  Typography,
  Progress,
  Alert
} from 'antd';
import { 
  UploadOutlined, 
  InboxOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileUnknownOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import { createDocument } from '../../features/documents/documentsSlice';
import { CreateDocumentRequest } from '../../features/documents/types';
import { validateFile, formatFileSize, getFileIcon } from '../../utils/documentUtils';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface DocumentUploadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleUpload = async (values: any) => {
    if (fileList.length === 0) {
      message.error(t('documents.pleaseSelectFile'));
      return;
    }

    const file = fileList[0].originFileObj;
    const validation = validateFile(file);
    
    if (!validation.valid) {
      message.error(validation.error);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const documentData: CreateDocumentRequest = {
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
        tags: tags,
        file: file,
        project_id: values.project_id,
      };

      await dispatch(createDocument(documentData)).unwrap();
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        message.success(t('documents.uploadSuccess'));
        handleCancel();
        onSuccess();
      }, 500);
    } catch (error: any) {
      clearInterval(progressInterval);
      setUploadError(error || t('documents.uploadFailed'));
      message.error(error || t('documents.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setTags([]);
    setTagInput('');
    setUploadProgress(0);
    setUploadError(null);
    onCancel();
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList.slice(-1)); // Only allow one file
    setUploadError(null);
    
    if (info.fileList.length > 0) {
      const file = info.fileList[0];
      const validation = validateFile(file.originFileObj);
      
      if (!validation.valid) {
        setUploadError(validation.error);
        setFileList([]);
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const uploadProps = {
    beforeUpload: () => false, // Prevent auto upload
    fileList,
    onChange: handleFileChange,
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.rtf,.jpg,.jpeg,.png,.gif,.bmp,.zip,.rar',
    maxSize: 50 * 1024 * 1024, // 50MB
  };

  const getFileTypeIcon = (fileType: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'application/pdf': <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
      'application/msword': <FileWordOutlined style={{ color: '#1890ff' }} />,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <FileWordOutlined style={{ color: '#1890ff' }} />,
      'application/vnd.ms-excel': <FileExcelOutlined style={{ color: '#52c41a' }} />,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <FileExcelOutlined style={{ color: '#52c41a' }} />,
      'image/jpeg': <FileImageOutlined style={{ color: '#faad14' }} />,
      'image/png': <FileImageOutlined style={{ color: '#faad14' }} />,
      'image/gif': <FileImageOutlined style={{ color: '#faad14' }} />,
      'text/plain': <FileTextOutlined style={{ color: '#722ed1' }} />,
    };
    return iconMap[fileType] || <FileUnknownOutlined style={{ color: '#666' }} />;
  };

  return (
    <Modal
      title={t('documents.uploadDocument')}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpload}
        initialValues={{
          category: 'other',
          status: 'draft',
        }}
      >
        <Form.Item
          name="title"
          label={t('documents.title')}
          rules={[{ required: true, message: t('documents.titleRequired') }]}
        >
          <Input placeholder={t('documents.titlePlaceholder')} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t('documents.description')}
        >
          <TextArea 
            rows={3} 
            placeholder={t('documents.descriptionPlaceholder')} 
          />
        </Form.Item>

        <Form.Item
          name="category"
          label={t('documents.category')}
          rules={[{ required: true, message: t('documents.categoryRequired') }]}
        >
          <Select placeholder={t('documents.selectCategory')}>
            <Option value="project">{t('documents.categories.project')}</Option>
            <Option value="meeting">{t('documents.categories.meeting')}</Option>
            <Option value="policy">{t('documents.categories.policy')}</Option>
            <Option value="template">{t('documents.categories.template')}</Option>
            <Option value="other">{t('documents.categories.other')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label={t('documents.status')}
          rules={[{ required: true, message: t('documents.statusRequired') }]}
        >
          <Select placeholder={t('documents.selectStatus')}>
            <Option value="draft">{t('documents.statuses.draft')}</Option>
            <Option value="published">{t('documents.statuses.published')}</Option>
            <Option value="archived">{t('documents.statuses.archived')}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="project_id"
          label={t('documents.project')}
        >
          <Select 
            placeholder={t('documents.selectProject')}
            allowClear
          >
            {/* Project options will be loaded from API */}
            <Option value={1}>Project A</Option>
            <Option value={2}>Project B</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={t('documents.tags')}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t('documents.addTag')}
                onPressEnter={handleAddTag}
                style={{ width: 200 }}
              />
              <Button onClick={handleAddTag} disabled={!tagInput.trim()}>
                {t('common.add')}
              </Button>
            </Space>
            <div>
              {tags.map(tag => (
                <Tag
                  key={tag}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  style={{ marginBottom: 8 }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </Space>
        </Form.Item>

        <Form.Item
          label={t('documents.file')}
          required
        >
          <Upload.Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{t('documents.dragAndDrop')}</p>
            <p className="ant-upload-hint">{t('documents.uploadHint')}</p>
          </Upload.Dragger>
        </Form.Item>

        {uploadError && (
          <Alert
            message={uploadError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {fileList.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>{t('documents.selectedFile')}:</Text>
            <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <Space>
                {getFileTypeIcon(fileList[0]?.type || '')}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{fileList[0].name}</div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatFileSize(fileList[0].size)}
                  </Text>
                </div>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setFileList([])}
                />
              </Space>
            </div>
          </div>
        )}

        {uploading && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>{t('documents.uploading')}:</Text>
            <Progress 
              percent={uploadProgress} 
              status={uploadError ? 'exception' : 'active'}
              style={{ marginTop: 8 }}
            />
          </div>
        )}

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={uploading}
              disabled={fileList.length === 0 || !!uploadError}
            >
              {uploading ? t('documents.uploading') : t('documents.upload')}
            </Button>
            <Button onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentUploadModal; 