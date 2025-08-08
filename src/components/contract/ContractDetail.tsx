import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Descriptions,
  Card,
  Row,
  Col,
  Tag,
  Divider,
  Typography,
  Space,
  Button,
} from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { BusinessContract, ContractParty, ContractSignature } from '../../features/contract/types';
import dayjs from 'dayjs';

interface ContractDetailProps {
  contract: BusinessContract;
  visible: boolean;
  onClose: () => void;
}

const ContractDetail: React.FC<ContractDetailProps> = ({
  contract,
  visible,
  onClose,
}) => {
  const { t } = useTranslation();

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'employment':
        return 'blue';
      case 'service':
        return 'green';
      case 'partnership':
        return 'purple';
      case 'vendor':
        return 'orange';
      case 'client':
        return 'cyan';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title={t('contract.detail.title')}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          {t('common.close')}
        </Button>,
      ]}
      width={1000}
      destroyOnClose
    >
      <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Descriptions title={t('contract.detail.basicInfo')} column={2}>
                <Descriptions.Item label={t('contract.number')}>
                  <strong>{contract.contract_number}</strong>
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.title')}>
                  {contract.title}
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.type')}>
                  <Tag color={getTypeColor(contract.type)}>
                    {t(`contract.types.${contract.type}`)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.status')}>
                  <Tag color={getStatusColor(contract.status)}>
                    {t(`contract.statuses.${contract.status}`)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.signatureStatus')}>
                  <Tag color={getSignatureStatusColor(contract.signature_status)}>
                    {t(`contract.signatureStatuses.${contract.signature_status}`)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.value')}>
                  {contract.value && contract.currency ? (
                    <span>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: contract.currency,
                      }).format(contract.value)}
                    </span>
                  ) : (
                    t('common.notSpecified')
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.startDate')}>
                  {contract.start_date ? dayjs(contract.start_date).format('YYYY-MM-DD') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.endDate')}>
                  {contract.end_date ? dayjs(contract.end_date).format('YYYY-MM-DD') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={t('contract.createdAt')}>
                  {dayjs(contract.created_at).format('YYYY-MM-DD HH:mm')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {contract.description && (
            <Col span={24}>
              <Card title={t('contract.description')}>
                <Typography.Paragraph>{contract.description}</Typography.Paragraph>
              </Card>
            </Col>
          )}

          {contract.terms && Object.keys(contract.terms).length > 0 && (
            <Col span={24}>
              <Card title={t('contract.terms')}>
                <Descriptions column={1}>
                  {Object.entries(contract.terms).map(([key, value]) => (
                    <Descriptions.Item key={key} label={t(`contract.terms.${key}`)}>
                      {typeof value === 'string' ? value : JSON.stringify(value)}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Card>
            </Col>
          )}

          {contract.template && (
            <Col span={24}>
              <Card title={t('contract.template')}>
                <Descriptions column={2}>
                  <Descriptions.Item label={t('contract.template.name')}>
                    {contract.template.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('contract.template.type')}>
                    <Tag color={getTypeColor(contract.template.type)}>
                      {t(`contract.types.${contract.template.type}`)}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={t('contract.template.description')} span={2}>
                    {contract.template.description}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          )}

          {contract.parties && contract.parties.length > 0 && (
            <Col span={24}>
              <Card title={t('contract.detail.parties')}>
                {contract.parties.map((party: ContractParty, index: number) => (
                  <div key={party.id} style={{ marginBottom: 16 }}>
                    <Divider orientation="left">
                      {party.is_primary ? t('contract.party.primary') : t('contract.party.secondary')}
                    </Divider>
                    <Descriptions column={2}>
                      <Descriptions.Item label={t('contract.party.name')}>
                        {party.name}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.party.type')}>
                        <Tag color="blue">{t(`contract.party.types.${party.party_type}`)}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.party.email')}>
                        {party.email}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.party.phone')}>
                        {party.phone || '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.party.company')}>
                        {party.company_name || '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.party.representative')}>
                        {party.representative_name || '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.party.address')} span={2}>
                        {party.address || '-'}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ))}
              </Card>
            </Col>
          )}

          {contract.signatures_list && contract.signatures_list.length > 0 && (
            <Col span={24}>
              <Card title={t('contract.detail.signatures')}>
                {contract.signatures_list.map((signature: ContractSignature, index: number) => (
                  <div key={signature.id} style={{ marginBottom: 16 }}>
                    <Descriptions column={2}>
                      <Descriptions.Item label={t('contract.fields.signer_name')}>
                        {signature.signer_name}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.fields.signer_email')}>
                        {signature.signer_email}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.fields.signature_type')}>
                        <Tag color="green">{t(`contract.signatureTypes.${signature.signature_type}`)}</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.fields.signed_at')}>
                        {dayjs(signature.signed_at).format('YYYY-MM-DD HH:mm')}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.fields.ip_address')}>
                        {signature.ip_address || '-'}
                      </Descriptions.Item>
                      <Descriptions.Item label={t('contract.fields.user_agent')}>
                        {signature.user_agent || '-'}
                      </Descriptions.Item>
                    </Descriptions>
                  </div>
                ))}
              </Card>
            </Col>
          )}

          {contract.creator && (
            <Col span={24}>
              <Card title={t('contract.detail.creator')}>
                <Descriptions column={2}>
                  <Descriptions.Item label={t('contract.creator.name')}>
                    {contract.creator.name}
                  </Descriptions.Item>
                  <Descriptions.Item label={t('contract.creator.email')}>
                    {contract.creator.email}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </Modal>
  );
};

export default ContractDetail; 