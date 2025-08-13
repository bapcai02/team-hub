import React, { useState } from 'react';
import { Card, Button, Space, Upload, message, Alert, Typography, Divider, Row, Col } from 'antd';
import { DownloadOutlined, UploadOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import apiClient from '../../../lib/apiClient';

const { Title, Text } = Typography;

interface DataManagementProps {
  onExport: () => void;
  onImport: (data: any) => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ onExport, onImport }) => {
  const { t } = useTranslation();
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      await onExport();
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error(t('settings.exportError'));
    }
  };

  const handleImport = async (file: File) => {
    try {
      setImporting(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          await onImport(data);
          message.success(t('settings.importSuccess'));
        } catch (error) {
          message.error(t('settings.importError'));
        }
      };
      reader.readAsText(file);
    } catch (error) {
      message.error(t('settings.importError'));
    } finally {
      setImporting(false);
    }
  };

  const uploadProps = {
    name: 'file',
    accept: '.json',
    beforeUpload: (file: File) => {
      handleImport(file);
      return false; // Prevent default upload
    },
    showUploadList: false,
  };

  const handleDeleteAccount = () => {
    // This would typically open a confirmation modal
    message.warning(t('settings.deleteAccountWarning'));
  };

  return (
    <Card title={t('settings.dataManagement.title', 'Data Management')} style={{ marginBottom: 24 }}>
      <Alert
        message={t('settings.dataManagement.warning', 'Data Management Warning')}
        description={t('settings.dataManagement.warningDesc', 'Be careful with data management operations. Exporting and importing data can affect your account settings and preferences.')}
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Card 
            title={t('settings.dataManagement.export', 'Export Data')}
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              {t('settings.dataManagement.exportDesc', 'Download a copy of your data for backup or transfer to another account.')}
            </Text>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExport}
              block
            >
              {t('settings.dataManagement.exportButton', 'Export Data')}
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card 
            title={t('settings.dataManagement.import', 'Import Data')}
            size="small"
            style={{ marginBottom: 16 }}
          >
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              {t('settings.dataManagement.importDesc', 'Import data from a previously exported file. This will overwrite your current settings.')}
            </Text>
            <Upload {...uploadProps}>
              <Button 
                icon={<UploadOutlined />}
                loading={importing}
                block
              >
                {t('settings.dataManagement.importButton', 'Import Data')}
              </Button>
            </Upload>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Card 
        title={t('settings.dataManagement.dangerZone', 'Danger Zone')}
        size="small"
        style={{ borderColor: '#ff4d4f' }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text type="secondary">
            {t('settings.dataManagement.deleteAccountDesc', 'Permanently delete your account and all associated data. This action cannot be undone.')}
          </Text>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={handleDeleteAccount}
          >
            {t('settings.dataManagement.deleteAccount', 'Delete Account')}
          </Button>
        </Space>
      </Card>
    </Card>
  );
};

export default DataManagement; 