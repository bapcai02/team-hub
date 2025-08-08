import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Card, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { RootState, useAppDispatch } from '../../app/store';
import { 
  fetchContracts, 
  fetchContractStats, 
  fetchContractTemplates,
  setSelectedContract 
} from '../../features/contract/contractSlice';
import ContractList from '../../components/contract/ContractList';
import ContractForm from '../../components/contract/ContractForm';
import TemplateManagement from '../../components/contract/TemplateManagement';
import ContractStats from '../../components/contract/ContractStats';
import ContractDetail from '../../components/contract/ContractDetail';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { Contract } from '../../features/contract/types';

const { Title } = Typography;

const ContractManagement: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { selectedContract } = useSelector((state: RootState) => state.contract);
  const [activeTab, setActiveTab] = useState('contracts');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);

  useEffect(() => {
    dispatch(fetchContracts());
    dispatch(fetchContractStats());
    dispatch(fetchContractTemplates());
  }, [dispatch]);

  useEffect(() => {
    if (selectedContract) {
      setShowDetail(true);
    }
  }, [selectedContract]);

  const handleCreate = () => {
    setEditingContract(null);
    setShowForm(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setShowForm(true);
  };

  const handleView = (contract: Contract) => {
    dispatch(setSelectedContract(contract));
  };

  const handleFormSuccess = () => {
    dispatch(fetchContracts());
    setShowForm(false);
    setEditingContract(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContract(null);
  };

  const handleDetailClose = () => {
    setShowDetail(false);
    dispatch(setSelectedContract(null));
  };

  const tabItems = [
    {
      key: 'contracts',
      label: t('contract.tabs.contracts'),
      children: (
        <ContractList
          onEdit={handleEdit}
          onView={handleView}
          onCreate={handleCreate}
        />
      ),
    },
    {
      key: 'templates',
      label: t('contract.tabs.templates'),
      children: <TemplateManagement />,
    },
    {
      key: 'stats',
      label: t('contract.tabs.stats'),
      children: <ContractStats />,
    },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', flex: 1 }}>
          <Title level={2} style={{ marginBottom: '24px' }}>
            {t('contract.management.title')}
          </Title>

          <Card>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              type="card"
            />
          </Card>

          <ContractForm
            visible={showForm}
            contract={editingContract}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />

          {selectedContract && (
            <ContractDetail
              contract={selectedContract}
              visible={showDetail}
              onClose={handleDetailClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractManagement; 