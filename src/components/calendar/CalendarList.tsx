import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  fetchUpcomingEvents,
  setFilters,
  clearFilters
} from '../../features/calendar/calendarSlice';
import { CalendarEvent as CalendarEventType, CreateCalendarEventRequest } from '../../features/calendar/types';
import { calendarSocketService } from '../../services/calendarSocket.service';
import CalendarEvent from './CalendarEvent';
import CreateEventModal from './CreateEventModal';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Space, Card, Row, Col, Typography, Spin } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CalendarList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { events, upcomingEvents, loading, error, filters } = useAppSelector(state => state.calendar);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(fetchUpcomingEvents());
    
    // Socket event listeners
    calendarSocketService.onEventCreated((event: any) => {
      console.log('Event created via socket:', event);
      dispatch(fetchEvents());
    });
    
    calendarSocketService.onEventUpdated((event: any) => {
      console.log('Event updated via socket:', event);
      dispatch(fetchEvents());
    });
    
    calendarSocketService.onEventDeleted((data: { id: number }) => {
      console.log('Event deleted via socket:', data);
      dispatch(fetchEvents());
    });

    return () => {
      calendarSocketService.offAll();
    };
  }, [dispatch]);

  const handleCreateEvent = async (data: CreateCalendarEventRequest) => {
    try {
      await dispatch(createEvent(data)).unwrap();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleUpdateEvent = async (id: number, data: Partial<CreateCalendarEventRequest>) => {
    try {
      await dispatch(updateEvent({ id, data })).unwrap();
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      dispatch(setFilters({ ...filters, search: value }));
    } else {
      dispatch(setFilters({ ...filters, search: undefined }));
    }
  };

  const handleFilterChange = (key: string, value: string | undefined) => {
    const newFilters = { ...filters };
    if (value) {
      (newFilters as any)[key] = value;
    } else {
      delete newFilters[key as keyof typeof filters];
    }
    dispatch(setFilters(newFilters));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    dispatch(clearFilters());
  };

  if (loading && events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>{t('calendar.loading')}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>{t('calendar.title')}</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setShowCreateModal(true)}
          >
            {t('calendar.createEvent')}
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Input
              placeholder={t('calendar.search')}
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder={t('calendar.type')}
              allowClear
              value={filters.type}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: '100%' }}
            >
              <Option value="meeting">{t('calendar.eventType.meeting')}</Option>
              <Option value="task">{t('calendar.eventType.task')}</Option>
              <Option value="reminder">{t('calendar.eventType.reminder')}</Option>
              <Option value="other">{t('calendar.eventType.other')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder={t('calendar.status')}
              allowClear
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
            >
              <Option value="scheduled">{t('calendar.status.scheduled')}</Option>
              <Option value="ongoing">{t('calendar.status.ongoing')}</Option>
              <Option value="completed">{t('calendar.status.completed')}</Option>
              <Option value="cancelled">{t('calendar.status.cancelled')}</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Button 
              icon={<FilterOutlined />}
              onClick={clearAllFilters}
            >
              {t('calendar.clearFilters')}
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Events List */}
      <Row gutter={[16, 16]}>
        {events.map((event) => (
          <Col xs={24} sm={12} lg={8} xl={6} key={event.id}>
            <CalendarEvent
              event={event}
              onEdit={() => setEditingEvent(event)}
              onDelete={() => handleDeleteEvent(event.id)}
            />
          </Col>
        ))}
      </Row>

      {events.length === 0 && !loading && (
        <Card style={{ textAlign: 'center', padding: '50px' }}>
          <Title level={4}>{t('calendar.noEvents')}</Title>
        </Card>
      )}

      {/* Modals */}
      <CreateEventModal
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onSubmit={handleCreateEvent}
        event={null}
      />

      {editingEvent && (
        <CreateEventModal
          visible={!!editingEvent}
          onCancel={() => setEditingEvent(null)}
          onSubmit={(data) => handleUpdateEvent(editingEvent.id, data)}
          event={editingEvent}
        />
      )}
    </div>
  );
};

export default CalendarList; 