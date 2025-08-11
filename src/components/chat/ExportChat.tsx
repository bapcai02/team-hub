import React, { useState } from 'react';
import { Modal, Button, Space, Typography, Radio, DatePicker, Checkbox, Progress, Alert, Divider } from 'antd';
import { DownloadOutlined, FileTextOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface ExportChatProps {
  visible: boolean;
  onClose: () => void;
  conversation: {
    id: number;
    name: string;
    type: 'personal' | 'group';
    messageCount: number;
  };
  onExport: (options: ExportOptions) => Promise<void>;
}

interface ExportOptions {
  format: 'txt' | 'csv' | 'json' | 'pdf';
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  includeMedia: boolean;
  includeReactions: boolean;
  includeTimestamps: boolean;
  includeUserInfo: boolean;
  groupByDate: boolean;
}

const ExportChat: React.FC<ExportChatProps> = ({
  visible,
  onClose,
  conversation,
  onExport
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'txt',
    dateRange: null,
    includeMedia: true,
    includeReactions: true,
    includeTimestamps: true,
    includeUserInfo: true,
    groupByDate: false
  });

  const handleExport = async () => {
    setLoading(true);
    setProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await onExport(options);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        onClose();
        setProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Error exporting chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const formatOptions = [
    {
      value: 'txt',
      label: t('chat.export.txt', 'Plain Text (.txt)'),
      icon: <FileTextOutlined />,
      description: t('chat.export.txtDescription', 'Simple text format, easy to read')
    },
    {
      value: 'csv',
      label: t('chat.export.csv', 'CSV (.csv)'),
      icon: <FileExcelOutlined />,
      description: t('chat.export.csvDescription', 'Spreadsheet format, good for analysis')
    },
    {
      value: 'json',
      label: t('chat.export.json', 'JSON (.json)'),
      icon: <FileTextOutlined />,
      description: t('chat.export.jsonDescription', 'Structured data format')
    },
    {
      value: 'pdf',
      label: t('chat.export.pdf', 'PDF (.pdf)'),
      icon: <FilePdfOutlined />,
      description: t('chat.export.pdfDescription', 'Formatted document, good for sharing')
    }
  ];

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DownloadOutlined style={{ color: '#1890ff' }} />
          <span>{t('chat.export.exportChat', 'Export Chat')}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      <div style={{ padding: '16px 0' }}>
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
              {conversation.name || t('chat.export.unnamed', 'Unnamed Conversation')}
            </Text>
            <Text type="secondary">
              ({conversation.type === 'group' ? t('chat.export.group', 'Group') : t('chat.export.personal', 'Personal')})
            </Text>
          </div>
          
          <Text type="secondary">
            {t('chat.export.messageCount', '{{count}} messages available for export', { count: conversation.messageCount })}
          </Text>
        </div>

        {/* Export Format */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            {t('chat.export.format', 'Export Format')}
          </Title>
          
          <Radio.Group
            value={options.format}
            onChange={(e) => handleOptionChange('format', e.target.value)}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {formatOptions.map(format => (
                <Radio key={format.value} value={format.value}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px' }}>{format.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{format.label}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{format.description}</div>
                    </div>
                  </div>
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        {/* Date Range */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            {t('chat.export.dateRange', 'Date Range')}
          </Title>
          
          <div style={{ marginBottom: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {t('chat.export.dateRangeDescription', 'Select a date range to export (optional)')}
            </Text>
          </div>
          
          <RangePicker
            value={options.dateRange}
            onChange={(dates) => handleOptionChange('dateRange', dates)}
            style={{ width: '100%' }}
            placeholder={[
              t('chat.export.startDate', 'Start date'),
              t('chat.export.endDate', 'End date')
            ]}
          />
        </div>

        {/* Export Options */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={5} style={{ marginBottom: '16px' }}>
            {t('chat.export.options', 'Export Options')}
          </Title>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Checkbox
              checked={options.includeTimestamps}
              onChange={(e) => handleOptionChange('includeTimestamps', e.target.checked)}
            >
              <div>
                <Text strong>{t('chat.export.includeTimestamps', 'Include timestamps')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.export.includeTimestampsDescription', 'Add message timestamps to the export')}
                </Text>
              </div>
            </Checkbox>

            <Checkbox
              checked={options.includeUserInfo}
              onChange={(e) => handleOptionChange('includeUserInfo', e.target.checked)}
            >
              <div>
                <Text strong>{t('chat.export.includeUserInfo', 'Include user information')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.export.includeUserInfoDescription', 'Add sender names and details')}
                </Text>
              </div>
            </Checkbox>

            <Checkbox
              checked={options.includeReactions}
              onChange={(e) => handleOptionChange('includeReactions', e.target.checked)}
            >
              <div>
                <Text strong>{t('chat.export.includeReactions', 'Include reactions')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.export.includeReactionsDescription', 'Include message reactions and emojis')}
                </Text>
              </div>
            </Checkbox>

            <Checkbox
              checked={options.includeMedia}
              onChange={(e) => handleOptionChange('includeMedia', e.target.checked)}
            >
              <div>
                <Text strong>{t('chat.export.includeMedia', 'Include media information')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.export.includeMediaDescription', 'Include file names and media details')}
                </Text>
              </div>
            </Checkbox>

            <Checkbox
              checked={options.groupByDate}
              onChange={(e) => handleOptionChange('groupByDate', e.target.checked)}
            >
              <div>
                <Text strong>{t('chat.export.groupByDate', 'Group by date')}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {t('chat.export.groupByDateDescription', 'Organize messages by date sections')}
                </Text>
              </div>
            </Checkbox>
          </div>
        </div>

        {/* Progress */}
        {loading && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <Text>{t('chat.export.exporting', 'Exporting...')}</Text>
              <Text>{progress}%</Text>
            </div>
            <Progress percent={progress} status="active" />
          </div>
        )}

        {/* Info Alert */}
        <Alert
          message={t('chat.export.info', 'Export Information')}
          description={t('chat.export.infoDescription', 'The export process may take a few minutes depending on the number of messages. You will receive a download link when the export is complete.')}
          type="info"
          showIcon
          style={{ marginBottom: '24px' }}
        />

        <Divider />

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={onClose} disabled={loading}>
            {t('common.cancel', 'Cancel')}
          </Button>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={loading}
            disabled={loading}
          >
            {loading 
              ? t('chat.export.exporting', 'Exporting...') 
              : t('chat.export.startExport', 'Start Export')
            }
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportChat; 