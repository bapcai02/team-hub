import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Button, 
  Input, 
  Select, 
  Table, 
  Tag, 
  Space, 
  Typography, 
  Upload, 
  Modal,
  message,
  Tooltip,
  Badge
} from 'antd';
import {
  FileTextOutlined,
  UploadOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FileUnknownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { 
  fetchDocuments, 
  fetchDocumentStats, 
  searchDocuments, 
  deleteDocument,
  setSearchQuery,
  setFilters,
  clearFilters
} from '../../features/documents/documentsSlice';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import DocumentUploadModal from '../../components/documents/DocumentUploadModal';
import DocumentDetailModal from '../../components/documents/DocumentDetailModal';
import { Document } from '../../features/documents/types';
import { formatFileSize, getFileIcon } from '../../utils/documentUtils';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const DocumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { documents = [], stats, loading, searchQuery, filters } = useAppSelector(state => state.documents);
  
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(fetchDocuments(undefined));
    dispatch(fetchDocumentStats());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      dispatch(searchDocuments(value));
    } else {
      dispatch(fetchDocuments(undefined));
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(fetchDocuments({ ...filters, [key]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchValue('');
    dispatch(fetchDocuments(undefined));
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setDetailModalVisible(true);
  };

  const handleEditDocument = (document: Document) => {
    // Navigate to edit page or open edit modal
    navigate(`/documents/${document.id}/edit`);
  };

  const handleDeleteDocument = async (document: Document) => {
    Modal.confirm({
      title: t('documents.deleteConfirm'),
      content: t('documents.deleteConfirmText', { title: document.title }),
      okText: t('common.yes'),
      cancelText: t('common.no'),
      okType: 'danger',
      onOk: async () => {
        try {
          await dispatch(deleteDocument(document.id)).unwrap();
          message.success(t('documents.deleted'));
        } catch (error) {
          message.error(t('documents.deleteFailed'));
        }
      },
    });
  };

  const handleDownload = async (document: Document) => {
    try {
      // Implement download logic
      message.success(t('documents.downloadStarted'));
    } catch (error) {
      message.error(t('documents.downloadFailed'));
    }
  };

  const columns = [
    {
      title: t('documents.title'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Document) => (
        <Space>
          {getFileIcon(record.file_type || '')}
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.file_name}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: t('documents.category'),
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {t(`documents.categories.${category}`)}
        </Tag>
      ),
    },
    {
      title: t('documents.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={t(`documents.statuses.${status}`)} 
        />
      ),
    },
    {
      title: t('documents.size'),
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: t('documents.uploadedBy'),
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.name || '-',
    },
    {
      title: t('documents.uploadedAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: Document) => (
        <Space>
          <Tooltip title={t('common.view')}>
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDocument(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.download')}>
            <Button 
              type="text" 
              icon={<DownloadOutlined />} 
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.edit')}>
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditDocument(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              onClick={() => handleDeleteDocument(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      project: 'blue',
      meeting: 'green',
      policy: 'orange',
      template: 'purple',
      other: 'default',
    };
    return colors[category] || 'default';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'warning',
      published: 'success',
      archived: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px' }}>
            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                {t('documents.title')}
              </Title>
              <Text type="secondary">
                {t('documents.description')}
              </Text>
            </div>

            {/* Statistics */}
            <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('documents.totalDocuments')}
                    value={stats?.total || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('documents.totalSize')}
                    value={stats?.total_size ? formatFileSize(stats.total_size) : '0 B'}
                    prefix={<FolderOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('documents.recentUploads')}
                    value={stats?.recent_uploads || 0}
                    prefix={<UploadOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('documents.published')}
                    value={stats?.by_status?.published || 0}
                    prefix={<FileTextOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Search and Filters */}
            <Card style={{ marginBottom: 24 }}>
              <Row gutter={16} align="middle">
                <Col span={8}>
                  <Search
                    placeholder={t('documents.searchPlaceholder')}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onSearch={handleSearch}
                    enterButton={<SearchOutlined />}
                  />
                </Col>
                <Col span={4}>
                  <Select
                    placeholder={t('documents.filterByCategory')}
                    allowClear
                    value={filters.category}
                    onChange={(value) => handleFilterChange('category', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="project">{t('documents.categories.project')}</Option>
                    <Option value="meeting">{t('documents.categories.meeting')}</Option>
                    <Option value="policy">{t('documents.categories.policy')}</Option>
                    <Option value="template">{t('documents.categories.template')}</Option>
                    <Option value="other">{t('documents.categories.other')}</Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <Select
                    placeholder={t('documents.filterByStatus')}
                    allowClear
                    value={filters.status}
                    onChange={(value) => handleFilterChange('status', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="draft">{t('documents.statuses.draft')}</Option>
                    <Option value="published">{t('documents.statuses.published')}</Option>
                    <Option value="archived">{t('documents.statuses.archived')}</Option>
                  </Select>
                </Col>
                <Col span={4}>
                  <Button 
                    icon={<FilterOutlined />} 
                    onClick={handleClearFilters}
                  >
                    {t('common.clear')}
                  </Button>
                </Col>
                <Col span={4}>
                  <Button 
                    type="primary" 
                    icon={<UploadOutlined />}
                    onClick={() => setUploadModalVisible(true)}
                    style={{ width: '100%' }}
                  >
                    {t('documents.upload')}
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Documents Table */}
            <Card>
              <Table
                columns={columns}
                dataSource={documents || []}
                rowKey="id"
                loading={loading}
                pagination={{
                  total: (documents || []).length,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} documents`,
                }}
                locale={{
                  emptyText: t('documents.noDocuments'),
                }}
              />
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DocumentUploadModal
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onSuccess={() => {
          setUploadModalVisible(false);
          dispatch(fetchDocuments(undefined));
          dispatch(fetchDocumentStats());
        }}
      />

      <DocumentDetailModal
        visible={detailModalVisible}
        document={selectedDocument}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedDocument(null);
        }}
        onEdit={(document) => {
          setDetailModalVisible(false);
          handleEditDocument(document);
        }}
      />
    </div>
  );
};

export default DocumentsPage; 