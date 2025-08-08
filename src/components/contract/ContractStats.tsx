import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography,
  Divider
} from 'antd';
import { 
  FileTextOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../app/store';
import { fetchContractStats } from '../../features/contract/contractSlice';

const { Title } = Typography;

const ContractStats: React.FC = () => {
  const { t } = useTranslation();
  const { stats, loading } = useSelector((state: RootState) => state.contract);

  React.useEffect(() => {
    // Stats will be fetched by the parent component
  }, []);

  if (!stats) {
    return (
      <Card>
        <Title level={4}>{t('contract.stats.title')}</Title>
        <p>{t('common.loading')}</p>
      </Card>
    );
  }

  const totalContracts = stats.total || 0;
  const activeContracts = stats.active || 0;
  const pendingContracts = stats.pending || 0;
  const expiredContracts = stats.expired || 0;
  const expiringSoon = stats.expiring_soon || 0;
  const unsignedContracts = stats.unsigned || 0;

  const activePercentage = totalContracts > 0 ? (activeContracts / totalContracts) * 100 : 0;
  const pendingPercentage = totalContracts > 0 ? (pendingContracts / totalContracts) * 100 : 0;
  const expiredPercentage = totalContracts > 0 ? (expiredContracts / totalContracts) * 100 : 0;

  return (
    <Card>
      <Title level={4}>{t('contract.stats.title')}</Title>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.total')}
              value={totalContracts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.active')}
              value={activeContracts}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.pending')}
              value={pendingContracts}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.expired')}
              value={expiredContracts}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.expiringSoon')}
              value={expiringSoon}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.unsigned')}
              value={unsignedContracts}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.completionRate')}
              value={totalContracts > 0 ? ((activeContracts + expiredContracts) / totalContracts) * 100 : 0}
              suffix="%"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title={t('contract.stats.signatureRate')}
              value={totalContracts > 0 ? ((totalContracts - unsignedContracts) / totalContracts) * 100 : 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('contract.stats.distribution')}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <span>{t('contract.stats.active')}: {activeContracts}</span>
                </div>
                <Progress 
                  percent={activePercentage} 
                  strokeColor="#52c41a"
                  showInfo={false}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <span>{t('contract.stats.pending')}: {pendingContracts}</span>
                </div>
                <Progress 
                  percent={pendingPercentage} 
                  strokeColor="#faad14"
                  showInfo={false}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginBottom: 8 }}>
                  <span>{t('contract.stats.expired')}: {expiredContracts}</span>
                </div>
                <Progress 
                  percent={expiredPercentage} 
                  strokeColor="#ff4d4f"
                  showInfo={false}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={t('contract.stats.summary')}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 16 }}>
                  <h4>{t('contract.stats.overview')}</h4>
                  <ul>
                    <li>{t('contract.stats.totalContracts')}: {totalContracts}</li>
                    <li>{t('contract.stats.activeContracts')}: {activeContracts}</li>
                    <li>{t('contract.stats.pendingContracts')}: {pendingContracts}</li>
                    <li>{t('contract.stats.expiredContracts')}: {expiredContracts}</li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: 16 }}>
                  <h4>{t('contract.stats.alerts')}</h4>
                  <ul>
                    {expiringSoon > 0 && (
                      <li style={{ color: '#faad14' }}>
                        {t('contract.stats.expiringSoonAlert', { count: expiringSoon })}
                      </li>
                    )}
                    {unsignedContracts > 0 && (
                      <li style={{ color: '#ff4d4f' }}>
                        {t('contract.stats.unsignedAlert', { count: unsignedContracts })}
                      </li>
                    )}
                    {expiredContracts > 0 && (
                      <li style={{ color: '#ff4d4f' }}>
                        {t('contract.stats.expiredAlert', { count: expiredContracts })}
                      </li>
                    )}
                    {totalContracts === 0 && (
                      <li style={{ color: '#1890ff' }}>
                        {t('contract.stats.noContracts')}
                      </li>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default ContractStats; 