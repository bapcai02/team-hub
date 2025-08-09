import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Tag,
  Space,
} from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import { updateDocument } from '../../features/documents/documentsSlice';
import { Document, UpdateDocumentRequest } from '../../features/documents/types';

const { TextArea } = Input;
const { Option } = Select;

interface DocumentEditModalProps {
  visible: boolean;
  document: Document | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const DocumentEditModal: React.FC<DocumentEditModalProps> = ({
  visible,
  document,
  onCancel,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (document && visible) {
      form.setFieldsValue({
        title: document.title,
        description: document.description,
        category: document.category,
        status: document.status,
        project_id: document.project_id,
      });
      setTags(document.tags || []);
    }
  }, [document, visible, form]);

  const handleSubmit = async (values: any) => {
    if (!document) return;

    setLoading(true);
    try {
      const updateData: UpdateDocumentRequest = {
        title: values.title,
        description: values.description,
        category: values.category,
        status: values.status,
        tags: tags,
        project_id: values.project_id,
      };

      await dispatch(updateDocument({ id: document.id, ...updateData })).unwrap();
      
      message.success(t('documents.updateSuccess'));
      handleCancel();
      onSuccess();
    } catch (error: any) {
      message.error(error || t('documents.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setTags([]);
    setTagInput('');
    onCancel();
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

  return (
    <Modal
      title={t('documents.editDocument')}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 80px)' }}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={t('documents.addTag')}
                onPressEnter={handleAddTag}
              />
              <Button 
                type="primary" 
                onClick={handleAddTag}
                style={{ width: '80px' }}
              >
                {t('documents.addTag')}
              </Button>
            </Input.Group>
            
            <div>
              {tags.map((tag, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveTag(tag)}
                  style={{ marginBottom: 4 }}
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </Space>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={handleCancel}>
              {t('common.cancel')}
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
            >
              {t('documents.updateDocument')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DocumentEditModal;