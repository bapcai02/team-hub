import React, { useState, useEffect } from 'react';
import { Input, List, Avatar, Typography, Space, Tag, Button, Empty, Spin, Divider } from 'antd';
import { SearchOutlined, UserOutlined, FileTextOutlined, PictureOutlined, VideoCameraOutlined, AudioOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

const { Search } = Input;
const { Text, Title } = Typography;

interface SearchResult {
  id: number;
  conversationId: number;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  createdAt: string;
  conversationName: string;
}

interface MessageSearchProps {
  visible: boolean;
  onCancel: () => void;
  onMessageSelect: (messageId: number, conversationId: number) => void;
}

const MessageSearch: React.FC<MessageSearchProps> = ({
  visible,
  onCancel,
  onMessageSelect
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'text' | 'media'>('all');

  const { messages, conversations } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    if (visible && searchQuery.trim()) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [visible, searchQuery, activeFilter]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Simulate API search - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search results
      const mockResults: SearchResult[] = [
        {
          id: 1,
          conversationId: 1,
          sender: { id: 1, name: 'You' },
          content: 'This is a sample message containing the search term.',
          type: 'text',
          createdAt: '2024-01-15T10:30:00Z',
          conversationName: 'John Doe'
        },
        {
          id: 2,
          conversationId: 2,
          sender: { id: 2, name: 'John Doe' },
          content: 'Another message with the search term in it.',
          type: 'text',
          createdAt: '2024-01-15T09:15:00Z',
          conversationName: 'Development Team'
        },
        {
          id: 3,
          conversationId: 1,
          sender: { id: 1, name: 'You' },
          content: 'document.pdf',
          type: 'file',
          createdAt: '2024-01-15T08:45:00Z',
          conversationName: 'John Doe'
        }
      ];

      // Filter by search query
      const filtered = mockResults.filter(result =>
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.conversationName.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Apply type filter
      const typeFiltered = activeFilter === 'all' 
        ? filtered 
        : activeFilter === 'text' 
          ? filtered.filter(r => r.type === 'text')
          : filtered.filter(r => r.type !== 'text');

      setSearchResults(typeFiltered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <PictureOutlined />;
      case 'file':
        return <FileTextOutlined />;
      case 'video':
        return <VideoCameraOutlined />;
      case 'audio':
        return <AudioOutlined />;
      default:
        return <FileTextOutlined />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} style={{ backgroundColor: '#ffd54f', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('chat.search.messages', 'Search Messages')}
          </Title>
          <Button onClick={onCancel}>
            {t('common.close', 'Close')}
          </Button>
        </div>
        
        <Search
          placeholder={t('chat.search.placeholder', 'Search messages, files, or people...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={performSearch}
          allowClear
          enterButton
        />

        {/* Filter Tabs */}
        <div style={{ marginTop: '12px' }}>
          <Space>
            <Button
              type={activeFilter === 'all' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveFilter('all')}
            >
              {t('chat.search.all', 'All')}
            </Button>
            <Button
              type={activeFilter === 'text' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveFilter('text')}
            >
              {t('chat.search.text', 'Text')}
            </Button>
            <Button
              type={activeFilter === 'media' ? 'primary' : 'default'}
              size="small"
              onClick={() => setActiveFilter('media')}
            >
              {t('chat.search.media', 'Media')}
            </Button>
          </Space>
        </div>
      </div>

      {/* Search Results */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Spin size="large" />
          </div>
        ) : searchQuery.trim() && searchResults.length === 0 ? (
          <Empty
            description={t('chat.search.noResults', 'No messages found')}
            style={{ marginTop: '50px' }}
          />
        ) : searchResults.length > 0 ? (
          <List
            dataSource={searchResults}
            renderItem={(result) => (
              <List.Item
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #f0f0f0'
                }}
                onClick={() => onMessageSelect(result.id, result.conversationId)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={result.sender.avatar} icon={<UserOutlined />}>
                      {result.sender.name.charAt(0)}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text strong>{result.sender.name}</Text>
                      <Tag color="blue">
                        {getMessageTypeIcon(result.type)} {result.type}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <div style={{ marginBottom: '4px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {result.conversationName} • {formatDate(result.createdAt)}
                        </Text>
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        {highlightSearchTerm(result.content)}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
            <SearchOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
            <div>{t('chat.search.startTyping', 'Start typing to search messages')}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSearch; 