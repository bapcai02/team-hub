import React, { useState, useEffect, useRef } from 'react';
import { Input, Dropdown, List, Typography, Space, Tag } from 'antd';
import { SearchOutlined, ProjectOutlined, UserOutlined, FileTextOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

interface SearchResult {
  id: string;
  type: 'project' | 'employee' | 'document' | 'task' | 'meeting';
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  tags?: string[];
}

const GlobalSearch: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results - in real app, this would call API
  const mockSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];
    
    const allItems: SearchResult[] = [
      {
        id: '1',
        type: 'project',
        title: 'Project Alpha',
        description: 'Web development project',
        path: '/projects/1',
        icon: <ProjectOutlined />,
        tags: ['active', 'development']
      },
      {
        id: '2',
        type: 'employee',
        title: 'John Doe',
        description: 'Senior Developer',
        path: '/employees/1',
        icon: <UserOutlined />,
        tags: ['engineering']
      },
      {
        id: '3',
        type: 'document',
        title: 'Project Requirements',
        description: 'Technical specifications',
        path: '/documents/1',
        icon: <FileTextOutlined />,
        tags: ['requirements']
      },
      {
        id: '4',
        type: 'task',
        title: 'Implement Login Feature',
        description: 'User authentication system',
        path: '/projects/1/tasks/1',
        icon: <ProjectOutlined />,
        tags: ['frontend', 'urgent']
      },
      {
        id: '5',
        type: 'meeting',
        title: 'Weekly Team Meeting',
        description: 'Project status update',
        path: '/meetings/1',
        icon: <CalendarOutlined />,
        tags: ['weekly']
      }
    ];

    const filtered = allItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    return filtered.slice(0, 5); // Limit to 5 results
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      setLoading(true);
      // Simulate API delay
      setTimeout(() => {
        const searchResults = mockSearch(value);
        setResults(searchResults);
        setLoading(false);
        setIsOpen(true);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setIsOpen(false);
    setSearchValue('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'blue';
      case 'employee': return 'green';
      case 'document': return 'orange';
      case 'task': return 'purple';
      case 'meeting': return 'cyan';
      default: return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'project': return t('search.type.project') || 'Project';
      case 'employee': return t('search.type.employee') || 'Employee';
      case 'document': return t('search.type.document') || 'Document';
      case 'task': return t('search.type.task') || 'Task';
      case 'meeting': return t('search.type.meeting') || 'Meeting';
      default: return type;
    }
  };

  const searchOverlay = (
    <div style={{ width: 400, maxHeight: 400, overflow: 'auto' }}>
      {loading ? (
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Typography.Text type="secondary">Searching...</Typography.Text>
        </div>
      ) : results.length > 0 ? (
        <List
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#f6f8ff'}
              onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
              onClick={() => handleResultClick(item)}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ color: '#4B48E5', fontSize: 16 }}>
                    {item.icon}
                  </div>
                }
                title={
                  <Space>
                    <Typography.Text strong>{item.title}</Typography.Text>
                    <Tag color={getTypeColor(item.type)}>
                      {getTypeLabel(item.type)}
                    </Tag>
                  </Space>
                }
                description={
                  <div>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      {item.description}
                    </Typography.Text>
                    {item.tags && item.tags.length > 0 && (
                      <div style={{ marginTop: 4 }}>
                        {item.tags.map(tag => (
                          <Tag key={tag} style={{ marginRight: 4 }}>
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : searchValue.trim() ? (
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Typography.Text type="secondary">No results found</Typography.Text>
        </div>
      ) : null}
    </div>
  );

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <Dropdown
        overlay={searchOverlay}
        open={isOpen}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Search
          placeholder={t('search.placeholder') || "Tìm kiếm dự án, nhân viên..."}
          value={searchValue}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          style={{ 
            width: 400,
            height: '44px',
            borderRadius: '22px',
            border: '1px solid #e5e7eb',
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease',
            fontSize: '14px'
          }}
          allowClear
        />
      </Dropdown>
    </div>
  );
};

export default GlobalSearch; 