import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  Card, 
  Typography,
  Tooltip,
  Popconfirm,
  message
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  SearchOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch } from '../../app/store';
import { 
  fetchContracts, 
  deleteContract, 
  setSelectedContract 
} from '../../features/contract/contractSlice';
import { Contract } from '../../features/contract/types';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ContractListProps {
  onEdit: (contract: Contract) => void;
  onView: (contract: Contract) => void;
  onCreate: () => void;
}

const ContractList: React.FC<ContractListProps> = ({ onEdit, onView, onCreate }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { contracts, loading } = useSelector((state: RootState) => state.contract);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  React.useEffect(() => {
    dispatch(fetchContracts());
  }, [dispatch]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    dispatch(fetchContracts({ search: value, status: statusFilter }));
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    dispatch(fetchContracts({ search: searchText, status: value }));
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteContract(id)).unwrap();
      message.success(t('contract.deleteSuccess'));
    } catch (error) {
      message.error(t('contract.deleteError'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'orange';
      case 'expired':
        return 'red';
      case 'draft':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getSignatureStatusColor = (status: string) => {
    switch (status) {
      case 'fully_signed':
        return 'green';
      case 'partially_signed':
        return 'orange';
      case 'unsigned':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: t('contract.number'),
      dataIndex: 'contract_number',
      key: 'contract_number',
      render: (text: string) => (
        <span style={{ fontWeight: 'bold' }}>{text}</span>
      ),
    },
    {
      title: t('contract.title'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: t('contract.type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{t(`contract.types.${type}`)}</Tag>
      ),
    },
    {
      title: t('contract.value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: string, record: Contract) => (
        <span>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: record.currency || 'USD',
          }).format(parseFloat(value))}
        </span>
      ),
    },
    {
      title: t('contract.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {t(`contract.statuses.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('contract.signatureStatus'),
      dataIndex: 'signature_status',
      key: 'signature_status',
      render: (status: string) => (
        <Tag color={getSignatureStatusColor(status)}>
          {t(`contract.signatureStatuses.${status}`)}
        </Tag>
      ),
    },
    {
      title: t('contract.startDate'),
      dataIndex: 'start_date',
      key: 'start_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('contract.endDate'),
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_, record: Contract) => (
        <Space size="small">
          <Tooltip title={t('common.view')}>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title={t('contract.generatePDF')}>
            <Button
              type="text"
              icon={<FileTextOutlined />}
              onClick={() => {
                // TODO: Implement PDF generation
                message.info(t('contract.pdfGenerationComingSoon'));
              }}
            />
          </Tooltip>
          <Popconfirm
            title={t('contract.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Tooltip title={t('common.delete')}>
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchText.toLowerCase()) ||
                         contract.contract_number.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !statusFilter || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>{t('contract.list')}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreate}
        >
          {t('contract.create')}
        </Button>
      </div>

      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Search
          placeholder={t('contract.searchPlaceholder')}
          allowClear
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          placeholder={t('contract.filterByStatus')}
          allowClear
          style={{ width: 200 }}
          onChange={handleStatusFilter}
        >
          <Option value="active">{t('contract.statuses.active')}</Option>
          <Option value="pending">{t('contract.statuses.pending')}</Option>
          <Option value="expired">{t('contract.statuses.expired')}</Option>
          <Option value="draft">{t('contract.statuses.draft')}</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={filteredContracts}
        rowKey="id"
        loading={loading}
        pagination={{
          total: filteredContracts.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${t('common.showing')} ${range[0]}-${range[1]} ${t('common.of')} ${total} ${t('common.items')}`,
        }}
      />
    </Card>
  );
};

export default ContractList; 