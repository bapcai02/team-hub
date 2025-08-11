import React, { useState } from 'react';
import { Modal, Button, Space, Typography, Checkbox, Alert, Divider } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

interface DeleteConversationProps {
  visible: boolean;
  onClose: () => void;
  conversation: {
    id: number;
    name: string;
    type: 'personal' | 'group';
    messageCount: number;
    memberCount?: number;
  };
  onDelete: (options: DeleteOptions) => void;
}

interface DeleteOptions {
  deleteForEveryone: boolean;
  deleteMedia: boolean;
  archiveInstead: boolean;
}

const DeleteConversation: React.FC<DeleteConversationProps> = ({
  visible,
  onClose,
  conversation,
  onDelete
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<DeleteOptions>({
    deleteForEveryone: false,
    deleteMedia: true,
    archiveInstead: false
  });

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(options);
      onClose();
    } catch (error) {
      console.error('Error deleting conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (key: keyof DeleteOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const isGroup = conversation.type === 'group';
  const canDeleteForEveryone = isGroup; // Only groups can delete for everyone

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DeleteOutlined style={{ color: '#ff4d4f' }} />
          <span>{t('chat.delete.deleteConversation', 'Delete Conversation')}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
    >
      <div style={{ padding: '16px 0' }}>
        {/* Warning Alert */}
        <Alert
          message={t('chat.delete.warning', 'Warning')}
          description={t('chat.delete.warningDescription', 'This action cannot be undone. Please make sure you want to delete this conversation.')}
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: '24px' }}
        />

        {/* Conversation Info */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          border: '1px solid #e8e8e8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Text strong style={{ fontSize: '16px' }}>
              {conversation.name || t('chat.delete.unnamed', 'Unnamed Conversation')}
            </Text>
            <Text type="secondary">
              ({isGroup ? t('chat.delete.group', 'Group') : t('chat.delete.personal', 'Personal')})
            </Text>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#666' }}>
            <div>
              {t('chat.delete.messageCount', '{{count}} messages', { count: conversation.messageCount })}
            </div>
            {isGroup && conversation.memberCount && (
              <div>
                {t('chat.delete.memberCount', '{{count}} members', { count: conversation.memberCount })}
              </div>
            )}
          </div>
        </div>

        {/* Delete Options */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            {t('chat.delete.options', 'Delete Options')}
          </Title>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Archive Instead */}
            <div>
              <Checkbox
                checked={options.archiveInstead}
                onChange={(e) => handleOptionChange('archiveInstead', e.target.checked)}
              >
                <div>
                  <Text strong>{t('chat.delete.archiveInstead', 'Archive instead of delete')}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('chat.delete.archiveDescription', 'Conversation will be hidden but can be restored later')}
                  </Text>
                </div>
              </Checkbox>
            </div>

            {/* Delete Media */}
            <div>
              <Checkbox
                checked={options.deleteMedia}
                onChange={(e) => handleOptionChange('deleteMedia', e.target.checked)}
                disabled={options.archiveInstead}
              >
                <div>
                  <Text strong>{t('chat.delete.deleteMedia', 'Delete media files')}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {t('chat.delete.deleteMediaDescription', 'Remove all images, videos, and files from this conversation')}
                  </Text>
                </div>
              </Checkbox>
            </div>

            {/* Delete for Everyone (Group only) */}
            {canDeleteForEveryone && (
              <div>
                <Checkbox
                  checked={options.deleteForEveryone}
                  onChange={(e) => handleOptionChange('deleteForEveryone', e.target.checked)}
                  disabled={options.archiveInstead}
                >
                  <div>
                    <Text strong>{t('chat.delete.deleteForEveryone', 'Delete for everyone')}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {t('chat.delete.deleteForEveryoneDescription', 'Remove this conversation for all group members')}
                    </Text>
                  </div>
                </Checkbox>
              </div>
            )}
          </div>
        </div>

        {/* Final Warning */}
        {!options.archiveInstead && (
          <Alert
            message={t('chat.delete.finalWarning', 'Final Warning')}
            description={t('chat.delete.finalWarningDescription', 'This will permanently delete the conversation and all its messages. This action cannot be undone.')}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            style={{ marginBottom: '24px' }}
          />
        )}

        <Divider />

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={onClose}>
            {t('common.cancel', 'Cancel')}
          </Button>

          <Space>
            {options.archiveInstead ? (
              <Button
                type="primary"
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={loading}
                style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
              >
                {t('chat.delete.archive', 'Archive Conversation')}
              </Button>
            ) : (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={loading}
              >
                {t('chat.delete.confirmDelete', 'Delete Conversation')}
              </Button>
            )}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConversation; 