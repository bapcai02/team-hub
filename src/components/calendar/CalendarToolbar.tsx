import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonGroup, Select, MenuItem } from '@mui/material';
import { ChevronLeft, ChevronRight, Today, ViewModule, ViewWeek, ViewDay, ViewAgenda } from '@mui/icons-material';
import moment from 'moment';
import './CalendarToolbar.scss';

interface CalendarToolbarProps {
  view: 'month' | 'week' | 'day' | 'agenda';
  date: Date;
  onViewChange: (view: 'month' | 'week' | 'day' | 'agenda') => void;
  onNavigate: (date: Date) => void;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  view,
  date,
  onViewChange,
  onNavigate,
}) => {
  const { t } = useTranslation();

  // Map view types to moment duration units
  const getMomentUnit = (viewType: 'month' | 'week' | 'day' | 'agenda') => {
    switch (viewType) {
      case 'month':
        return 'month';
      case 'week':
        return 'week';
      case 'day':
        return 'day';
      case 'agenda':
        return 'day'; // agenda view typically navigates by day
      default:
        return 'month';
    }
  };

  const handlePrevious = () => {
    const unit = getMomentUnit(view);
    const newDate = moment(date).subtract(1, unit).toDate();
    onNavigate(newDate);
  };

  const handleNext = () => {
    const unit = getMomentUnit(view);
    const newDate = moment(date).add(1, unit).toDate();
    onNavigate(newDate);
  };

  const handleToday = () => {
    onNavigate(new Date());
  };

  const getViewLabel = () => {
    const currentDate = moment(date);
    
    switch (view) {
      case 'month':
        return currentDate.format('MMMM YYYY');
      case 'week':
        const startOfWeek = currentDate.clone().startOf('week');
        const endOfWeek = currentDate.clone().endOf('week');
        return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`;
      case 'day':
        return currentDate.format('dddd, MMMM D, YYYY');
      case 'agenda':
        return currentDate.format('MMMM YYYY');
      default:
        return currentDate.format('MMMM YYYY');
    }
  };

  const viewOptions = [
    { value: 'month', label: t('calendar.month') },
    { value: 'week', label: t('calendar.week') },
    { value: 'day', label: t('calendar.day') },
    { value: 'agenda', label: t('calendar.agenda') },
  ];

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={handlePrevious}>
            <ChevronLeft />
          </Button>
          <Button onClick={handleToday}>
            <Today />
            {t('calendar.today')}
          </Button>
          <Button onClick={handleNext}>
            <ChevronRight />
          </Button>
        </ButtonGroup>
        <div className="current-date">
          <h2>{getViewLabel()}</h2>
        </div>
      </div>
      
      <div className="toolbar-right">
        <div className="view-selector">
          <Select
            value={view}
            onChange={(e) => onViewChange(e.target.value as 'month' | 'week' | 'day' | 'agenda')}
            size="small"
            variant="outlined"
          >
            {viewOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar; 