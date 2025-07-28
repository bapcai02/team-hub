import React, { useState, useEffect } from 'react';
import { Avatar, Tooltip, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import axios from '../services/axios';

interface UserAvatarProps {
  userId: number;
  size?: number;
  showName?: boolean;
  showPosition?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id?: number;
  employee?: {
    position?: string;
    department?: {
      name?: string;
    };
  };
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  userId, 
  size = 32, 
  showName = false, 
  showPosition = false 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/users/${userId}`);
      if (response.data.success) {
        setUser(response.data.data.user);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTooltipContent = () => {
    if (!user) return 'Loading...';
    
    let content = user.name;
    if (showPosition && user.employee?.position) {
      content += `\n${user.employee.position}`;
    }
    if (showPosition && user.employee?.department?.name) {
      content += `\n${user.employee.department.name}`;
    }
    return content;
  };

  if (loading) {
    return <Spin size="small" />;
  }

  if (!user) {
    return (
      <Avatar 
        size={size} 
        icon={<UserOutlined />} 
        style={{ background: '#e0e0e0', color: '#555' }}
      />
    );
  }

  const avatarContent = (
    <Avatar 
      size={size} 
      style={{ 
        background: '#4B48E5',
        color: '#fff',
        fontWeight: 600,
        fontSize: size * 0.4
      }}
    >
      {getInitials(user.name)}
    </Avatar>
  );

  return (
    <Tooltip title={getTooltipContent()} placement="top">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        {avatarContent}
        {showName && (
          <span style={{ fontWeight: 500, color: '#222' }}>
            {user.name}
          </span>
        )}
      </div>
    </Tooltip>
  );
};

export default UserAvatar; 