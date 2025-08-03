import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Box, Typography, IconButton } from '@mui/material';
import { Close, Edit, Delete, VideoCall, Phone } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/store';
import { CalendarEvent } from '../../features/calendar/types';
import moment from 'moment';

interface CalendarEventItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource?: any;
  event?: CalendarEvent;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventItem;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title || '',
    description: event.event?.description || '',
    location: event.event?.location || '',
    event_type: event.event?.event_type || 'other' as 'meeting' | 'task' | 'reminder' | 'other',
    status: event.event?.status || 'scheduled' as 'scheduled' | 'ongoing' | 'completed' | 'cancelled',
  });

  const handleSave = async () => {
    try {
      if (event.event) {
        // Update existing event
        // await dispatch(updateCalendarEvent({ id: event.event.id, ...formData }));
      } else {
        // Create new event
        const newEvent = {
          ...formData,
          start_time: moment(event.start).format('YYYY-MM-DD HH:mm:ss'),
          end_time: moment(event.end).format('YYYY-MM-DD HH:mm:ss'),
        };
        // await dispatch(createCalendarEvent(newEvent));
      }
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async () => {
    if (event.event) {
      try {
        // await dispatch(deleteCalendarEvent(event.event.id));
        onClose();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'ongoing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <VideoCall />;
      case 'task':
        return <Phone />;
      default:
        return undefined;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? t('calendar.editEvent') : t('calendar.eventDetails')}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {isEditing ? (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('calendar.eventTitle')}
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('calendar.eventDescription')}
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label={t('calendar.location')}
              value={formData.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, location: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('calendar.type')}</InputLabel>
              <Select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value as 'meeting' | 'task' | 'reminder' | 'other' })}
                label={t('calendar.type')}
              >
                <MenuItem value="meeting">{t('calendar.meeting')}</MenuItem>
                <MenuItem value="task">{t('calendar.task')}</MenuItem>
                <MenuItem value="reminder">{t('calendar.reminder')}</MenuItem>
                <MenuItem value="other">{t('calendar.other')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('calendar.status')}</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'scheduled' | 'ongoing' | 'completed' | 'cancelled' })}
                label={t('calendar.status')}
              >
                <MenuItem value="scheduled">{t('calendar.scheduled')}</MenuItem>
                <MenuItem value="ongoing">{t('calendar.ongoing')}</MenuItem>
                <MenuItem value="completed">{t('calendar.completed')}</MenuItem>
                <MenuItem value="cancelled">{t('calendar.cancelled')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {event.title}
            </Typography>
            
            {event.event?.description && (
              <Typography variant="body2" color="text.secondary" paragraph>
                {event.event.description}
              </Typography>
            )}
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>{t('calendar.time')}:</strong> {moment(event.start).format('MMM D, YYYY HH:mm')} - {moment(event.end).format('HH:mm')}
              </Typography>
            </Box>
            
            {event.event?.location && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>{t('calendar.location')}:</strong> {event.event.location}
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={getEventTypeIcon(event.event?.event_type || 'other')}
                label={t(`calendar.${event.event?.event_type || 'other'}`)}
                size="small"
              />
              {event.event?.status && (
                <Chip
                  label={t(`calendar.${event.event.status}`)}
                  color={getStatusColor(event.event.status) as any}
                  size="small"
                />
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions>
        {event.event && (
          <Button onClick={handleDelete} color="error" startIcon={<Delete />}>
            {t('common.delete')}
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>
          {t('common.cancel')}
        </Button>
        {isEditing ? (
          <Button onClick={handleSave} variant="contained">
            {t('common.save')}
          </Button>
        ) : (
          <Button onClick={() => setIsEditing(true)} variant="contained" startIcon={<Edit />}>
            {t('common.edit')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventModal; 