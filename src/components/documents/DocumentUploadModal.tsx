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
  Typography
} from 'antd';
import { 
  UploadOutlined, 
  InboxOutlined,
  DeleteOutlined
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

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
    try {
      const documentData: CreateDocumentRequest = {
        title: values.title,
        description: values.description,
        category: values.category,
        tags: tags,
        file: file,
        project_id: values.project_id,
      };

      await dispatch(createDocument(documentData)).unwrap();
      message.success(t('documents.uploadSuccess'));
      handleCancel();
      onSuccess();
    } catch (error: any) {
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
    onCancel();
  };

  const handleFileChange = (info: any) => {
    setFileList(info.fileList.slice(-1)); // Only allow one file
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
    accept: '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.rtf,.jpg,.jpeg,.png,.gif,.bmp',
  };

  return (
    <Modal
      title={t('documents.uploadDocument')}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleUpload}
        initialValues={{
          category: 'other',
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

        {fileList.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>{t('documents.selectedFile')}:</Text>
            <div style={{ marginTop: 8, padding: 12, background: '#f5f5f5', borderRadius: 6 }}>
              <Space>
                {getFileIcon(fileList[0]?.type || '')}
                <div>
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

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={uploading}
              disabled={fileList.length === 0}
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