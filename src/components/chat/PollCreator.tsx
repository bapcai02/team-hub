import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, Typography, Card, Progress, Tag, Divider, Checkbox, message } from 'antd';
import { PlusOutlined, DeleteOutlined, BarChartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { createPoll } from '../../features/chat/chatSlice';
import { AppDispatch } from '../../app/store';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface PollCreatorProps {
  visible: boolean;
  onCancel: () => void;
  conversationId?: number;
}

const PollCreator: React.FC<PollCreatorProps> = ({
  visible,
  onCancel,
  conversationId
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [allowMultiple, setAllowMultiple] = useState(false);
  const [anonymous, setAnonymous] = useState(false);

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (values: any) => {
    if (!conversationId) {
      message.error('No conversation selected');
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      message.error('Please add at least 2 options');
      return;
    }

    setLoading(true);
    try {
      const pollData = {
        conversationId,
        question: values.question,
        options: validOptions,
        allowMultiple,
        anonymous,
        expiresAt: values.expiresAt
      };
      
      await dispatch(createPoll(pollData)).unwrap();
      message.success('Poll created successfully');
      form.resetFields();
      setOptions(['', '']);
      setAllowMultiple(false);
      setAnonymous(false);
      onCancel();
    } catch (error) {
      console.error('Error creating poll:', error);
      message.error('Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChartOutlined style={{ color: '#1890ff' }} />
          <span>{t('chat.poll.createPoll', 'Create Poll')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          question: '',
          expiresAt: undefined
        }}
      >
        {/* Question */}
        <Form.Item
          name="question"
          label={t('chat.poll.question', 'Question')}
          rules={[
            { required: true, message: t('chat.poll.questionRequired', 'Please enter a question') },
            { max: 200, message: t('chat.poll.questionTooLong', 'Question is too long') }
          ]}
        >
          <TextArea
            placeholder={t('chat.poll.questionPlaceholder', 'What would you like to ask?')}
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        {/* Options */}
        <Form.Item
          label={t('chat.poll.options', 'Options')}
          required
        >
          {options.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Input
                placeholder={t('chat.poll.optionPlaceholder', 'Option {{number}}', { number: index + 1 })}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                style={{ flex: 1, marginRight: '8px' }}
                maxLength={100}
              />
              {options.length > 2 && (
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveOption(index)}
                  danger
                />
              )}
            </div>
          ))}
          
          {options.length < 10 && (
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddOption}
              style={{ width: '100%' }}
            >
              {t('chat.poll.addOption', 'Add Option')}
            </Button>
          )}
        </Form.Item>

        {/* Poll Settings */}
        <Card size="small" style={{ marginBottom: '16px' }}>
          <Title level={5} style={{ marginBottom: '12px' }}>
            {t('chat.poll.settings', 'Poll Settings')}
          </Title>
          
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>{t('chat.poll.allowMultiple', 'Allow Multiple Votes')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.poll.allowMultipleDesc', 'Users can select multiple options')}
                </Text>
              </div>
              <Checkbox
                checked={allowMultiple}
                onChange={(e) => setAllowMultiple(e.target.checked)}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>{t('chat.poll.anonymous', 'Anonymous Poll')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.poll.anonymousDesc', 'Hide who voted for what')}
                </Text>
              </div>
              <Checkbox
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
            </div>
          </Space>
        </Card>

        {/* Action Buttons */}
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              htmlType="submit"
              loading={loading}
            >
              {t('chat.poll.create', 'Create Poll')}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default PollCreator; 