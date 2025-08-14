import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../features/calendar/calendarSlice';
import { CalendarEvent } from '../../features/calendar/types';
import CalendarToolbar from './CalendarToolbar';
import EventModal from './EventModal';
import './Calendar.css';

const localizer = momentLocalizer(moment);

interface CalendarEventItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
  event?: CalendarEvent;
}

const CalendarComponent: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.calendar);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day' | 'agenda'>('month');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchEvents({}));
  }, [dispatch]);

  const calendarEvents: CalendarEventItem[] = events.map((event) => ({
    id: event.id.toString(),
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    event,
  }));

  const handleSelectEvent = (event: CalendarEventItem) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: any) => {
    setSelectedEvent({
      id: '',
      title: '',
      start: slotInfo.start,
      end: slotInfo.end,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  const eventStyleGetter = (event: CalendarEventItem) => {
    let style: any = {
      backgroundColor: event.event?.color || '#4285f4',
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };

    if (event.event?.status === 'cancelled') {
      style.backgroundColor = '#ea4335';
      style.textDecoration = 'line-through';
    } else if (event.event?.status === 'completed') {
      style.backgroundColor = '#34a853';
    } else if (event.event?.status === 'ongoing') {
      style.backgroundColor = '#fbbc04';
    }

    return { style };
  };

  const messages = {
    allDay: t('calendar.allDay'),
    previous: t('calendar.previous'),
    next: t('calendar.next'),
    today: t('calendar.today'),
    month: t('calendar.month'),
    week: t('calendar.week'),
    day: t('calendar.day'),
    agenda: t('calendar.agenda'),
    date: t('calendar.date'),
    time: t('calendar.time'),
    event: t('calendar.event'),
    noEventsInRange: t('calendar.noEventsInRange'),
    showMore: (total: number) => t('calendar.showMore', { total }),
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="spinner"></div>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <CalendarToolbar
        view={view}
        date={date}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
      />
      
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 'calc(100vh - 200px)' }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          step={15}
          timeslots={4}
          view={view}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          date={date}
          messages={messages}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event) => event.title}
          dayPropGetter={(date) => ({
            className: moment(date).isSame(moment(), 'day') ? 'today' : '',
          })}
          slotPropGetter={(date) => ({
            className: moment(date).isBefore(moment(), 'hour') ? 'past-hour' : '',
          })}
        />
      </div>

      {selectedEvent && (
        <EventModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarComponent; 