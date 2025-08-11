import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Typography, Spin, Alert, Space, Card, message } from 'antd';
import { EnvironmentOutlined, SendOutlined, CloseOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { shareLocation } from '../../features/chat/chatSlice';
import { AppDispatch } from '../../app/store';

const { Text, Title } = Typography;

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationShareProps {
  visible: boolean;
  onCancel: () => void;
  conversationId?: number;
}

const LocationShare: React.FC<LocationShareProps> = ({
  visible,
  onCancel,
  conversationId
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [customAddress, setCustomAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError(t('chat.location.notSupported', 'Geolocation is not supported by this browser'));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setCurrentLocation(location);
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError(t('chat.location.error', 'Unable to get your location'));
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSendLocation = async () => {
    if (!conversationId) {
      message.error('No conversation selected');
      return;
    }

    if (currentLocation) {
      setLoading(true);
      try {
        const locationData = {
          conversationId,
          ...currentLocation,
          address: customAddress || `${currentLocation.latitude}, ${currentLocation.longitude}`
        };
        
        await dispatch(shareLocation(locationData)).unwrap();
        message.success('Location shared successfully');
        onCancel();
      } catch (error) {
        console.error('Error sharing location:', error);
        message.error('Failed to share location');
      } finally {
        setLoading(false);
      }
    }
  };

  const getGoogleMapsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  const getStaticMapUrl = (lat: number, lng: number) => {
    // Using a free static map service - replace with your preferred service
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=400x300&markers=color:red%7C${lat},${lng}&key=YOUR_API_KEY`;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <EnvironmentOutlined style={{ color: '#52c41a' }} />
          <span>{t('chat.location.shareLocation', 'Share Location')}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        {error && (
          <Alert
            message={t('chat.location.error', 'Error')}
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text>{t('chat.location.gettingLocation', 'Getting your location...')}</Text>
            </div>
          </div>
        ) : currentLocation ? (
          <div>
            {/* Location Preview */}
            <Card style={{ marginBottom: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <EnvironmentOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                <Title level={4} style={{ marginBottom: '8px' }}>
                  {t('chat.location.currentLocation', 'Current Location')}
                </Title>
                <Text type="secondary">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </Text>
              </div>
            </Card>

            {/* Custom Address Input */}
            <div style={{ marginBottom: '16px' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                {t('chat.location.customAddress', 'Custom Address (Optional)')}
              </Text>
              <Input
                placeholder={t('chat.location.enterAddress', 'Enter a custom address...')}
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                allowClear
              />
            </div>

            {/* Action Buttons */}
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onCancel}>
                {t('common.cancel', 'Cancel')}
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendLocation}
                loading={loading}
              >
                {t('chat.location.sendLocation', 'Send Location')}
              </Button>
            </Space>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <EnvironmentOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} style={{ marginBottom: '8px' }}>
              {t('chat.location.noLocation', 'No Location Available')}
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
              {t('chat.location.enableLocation', 'Please enable location access to share your location.')}
            </Text>
            <Button
              type="primary"
              icon={<EnvironmentOutlined />}
              onClick={getCurrentLocation}
            >
              {t('chat.location.getLocation', 'Get My Location')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default LocationShare; 