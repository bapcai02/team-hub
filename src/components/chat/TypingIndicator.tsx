import React, { useState, useEffect } from 'react';
import { Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TypingUser {
  id: number;
  name: string;
  avatar?: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  visible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  visible
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible || typingUsers.length === 0) {
    return null;
  }

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing${dots}`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing${dots}`;
    } else {
      return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing${dots}`;
    }
  };

  return (
    <div className="typing-indicator">
      <div className="typing-content">
        <Space size="small" align="center">
          {/* Typing Users Avatars */}
          <div className="typing-avatars">
            {typingUsers.slice(0, 3).map((user, index) => (
              <Avatar
                key={user.id}
                src={user.avatar}
                icon={<UserOutlined />}
                size="small"
                style={{
                  marginLeft: index > 0 ? '-8px' : '0',
                  border: '2px solid #fff',
                  zIndex: 3 - index
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
            ))}
          </div>

          {/* Typing Animation */}
          <div className="typing-bubble">
            <div className="typing-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>

          {/* Typing Text */}
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {getTypingText()}
          </Text>
        </Space>
      </div>

      <style>{`
        .typing-indicator {
          padding: 8px 16px;
          animation: fadeIn 0.3s ease-in-out;
        }

        .typing-content {
          display: flex;
          align-items: center;
        }

        .typing-avatars {
          display: flex;
          align-items: center;
        }

        .typing-bubble {
          background-color: #f0f0f0;
          border-radius: 18px;
          padding: 8px 12px;
          margin: 0 8px;
        }

        .typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #999;
          animation: typing 1.4s infinite ease-in-out;
        }

        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }

        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator; 