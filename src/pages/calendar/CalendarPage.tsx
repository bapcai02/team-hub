import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import CalendarComponent from '../../components/calendar/Calendar';

const { Title, Text } = Typography;

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px' }}>
            <div style={{ marginBottom: 32 }}>
              <Title level={2} style={{ margin: 0, color: '#222' }}>
                {t('calendar.title')}
              </Title>
              <Text type="secondary">
                {t('calendar.description')}
              </Text>
            </div>
            
            <div className="calendar-page">
              <CalendarComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 