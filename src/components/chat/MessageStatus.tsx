import React from 'react';
import { Tooltip, Space } from 'antd';
import { CheckOutlined, CheckCircleOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

interface MessageStatusProps {
  status: MessageStatus;
  timestamp?: string;
  readBy?: string[];
  showTooltip?: boolean;
  size?: 'small' | 'default' | 'large';
}

const MessageStatus: React.FC<MessageStatusProps> = ({
  status,
  timestamp,
  readBy = [],
  showTooltip = true,
  size = 'default'
}) => {
  const { t } = useTranslation();

  const getStatusIcon = () => {
    const iconSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;
    const iconStyle = { fontSize: iconSize };

    switch (status) {
      case 'sending':
        return (
          <ClockCircleOutlined
            style={{ ...iconStyle, color: '#bfbfbf' }}
            className="message-status-sending"
          />
        );
      
      case 'sent':
        return (
          <CheckOutlined
            style={{ ...iconStyle, color: '#bfbfbf' }}
            className="message-status-sent"
          />
        );
      
      case 'delivered':
        return (
          <CheckCircleOutlined
            style={{ ...iconStyle, color: '#1890ff' }}
            className="message-status-delivered"
          />
        );
      
      case 'read':
        return (
          <EyeOutlined
            style={{ ...iconStyle, color: '#52c41a' }}
            className="message-status-read"
          />
        );
      
      case 'failed':
        return (
          <CheckOutlined
            style={{ ...iconStyle, color: '#ff4d4f' }}
            className="message-status-failed"
          />
        );
      
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'sending':
        return t('chat.status.sending', 'Sending...');
      case 'sent':
        return t('chat.status.sent', 'Sent');
      case 'delivered':
        return t('chat.status.delivered', 'Delivered');
      case 'read':
        return readBy.length > 0 
          ? t('chat.status.readBy', 'Read by {{count}} people', { count: readBy.length })
          : t('chat.status.read', 'Read');
      case 'failed':
        return t('chat.status.failed', 'Failed to send');
      default:
        return '';
    }
  };

  const getReadByText = () => {
    if (readBy.length === 0) return '';
    
    if (readBy.length === 1) {
      return t('chat.status.readByOne', 'Read by {{name}}', { name: readBy[0] });
    }
    
    if (readBy.length <= 3) {
      return t('chat.status.readByMultiple', 'Read by {{names}}', { 
        names: readBy.join(', ') 
      });
    }
    
    return t('chat.status.readByMany', 'Read by {{count}} people', { count: readBy.length });
  };

  const statusElement = (
    <Space size={4} style={{ alignItems: 'center' }}>
      {getStatusIcon()}
      {timestamp && (
        <span style={{ 
          fontSize: size === 'small' ? '10px' : size === 'large' ? '12px' : '11px',
          color: '#bfbfbf'
        }}>
          {timestamp}
        </span>
      )}
    </Space>
  );

  if (!showTooltip) {
    return statusElement;
  }

  const tooltipContent = (
    <div>
      <div>{getStatusText()}</div>
      {readBy.length > 0 && (
        <div style={{ fontSize: '11px', marginTop: '4px' }}>
          {getReadByText()}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      placement="top"
      mouseEnterDelay={0.5}
    >
      {statusElement}
    </Tooltip>
  );
};

export default MessageStatus; 