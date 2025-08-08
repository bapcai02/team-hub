import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Card,
  Tabs,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Alert,
  Spin,
} from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { RootState } from '../../app/store';
import {
  fetchContracts,
  fetchContractStats,
  fetchContractTemplates,
  clearError,
} from '../../features/contract/contractSlice';
import ContractList from '../../components/contract/ContractList';
import ContractForm from '../../components/contract/ContractForm';
import TemplateManagement from '../../components/contract/TemplateManagement';
import ContractStats from '../../components/contract/ContractStats';

const ContractManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contracts, templates, stats, loading, error } = useSelector(
    (state: RootState) => state.contract
  );
  const [activeTab, setActiveTab] = useState('contracts');
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchContracts());
    dispatch(fetchContractStats());
    dispatch(fetchContractTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleCreateContract = () => {
    setEditingContract(null);
    setShowForm(true);
  };

  const handleEditContract = (contract: any) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  const handleViewContract = (contract: any) => {
    // TODO: Implement contract detail view
    console.log('View contract:', contract);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContract(null);
  };

  const handleFormSuccess = () => {
    dispatch(fetchContracts());
    setShowForm(false);
    setEditingContract(null);
  };

  const items = [
    {
      key: 'contracts',
      label: (
        <span>
          <FileTextOutlined />
          {t('contract.tabs.contracts')}
        </span>
      ),
      children: (
        <ContractList
          onEdit={handleEditContract}
          onView={handleViewContract}
          onCreate={handleCreateContract}
        />
      ),
    },
    {
      key: 'templates',
      label: (
        <span>
          <FileProtectOutlined />
          {t('contract.tabs.templates')}
        </span>
      ),
      children: <TemplateManagement />,
    },
    {
      key: 'stats',
      label: (
        <span>
          <CheckCircleOutlined />
          {t('contract.tabs.stats')}
        </span>
      ),
      children: <ContractStats />,
    },
  ];

  if (loading && !contracts.length) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h1>{t('contract.management.title')}</h1>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleCreateContract}
                >
                  {t('contract.create')}
                </Button>
              </Space>
            </div>

            {error && (
              <Alert
                message={t('common.error')}
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: '16px' }}
              />
            )}

            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={items}
              size="large"
            />
          </Card>
        </Col>
      </Row>

      <ContractForm
        visible={showForm}
        contract={editingContract}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
};

export default ContractManagement; 