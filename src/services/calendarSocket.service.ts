import { io, Socket } from 'socket.io-client';
import { CalendarEvent, CalendarEventReply } from '../features/calendar/types';

class CalendarSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(userData: string) {
    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io('http://localhost:3001', {
      auth: {
        userData: userData
      }
    });

    this.socket.on('connect', () => {
      console.log('Calendar socket connected');
      this.isConnected = true;
      this.joinCalendar();
    });

    this.socket.on('disconnect', () => {
      console.log('Calendar socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Calendar socket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Calendar Events
  joinCalendar() {
    if (this.socket) {
      this.socket.emit('join_calendar');
    }
  }

  leaveCalendar() {
    if (this.socket) {
      this.socket.emit('leave_calendar');
    }
  }

  createEvent(eventData: any) {
    if (this.socket) {
      this.socket.emit('create_event', eventData);
    }
  }

  updateEvent(id: number, eventData: any) {
    if (this.socket) {
      this.socket.emit('update_event', { id, event: eventData });
    }
  }

  deleteEvent(id: number) {
    if (this.socket) {
      this.socket.emit('delete_event', { id });
    }
  }

  getEvents(startDate?: string, endDate?: string) {
    if (this.socket) {
      this.socket.emit('get_events', { start_date: startDate, end_date: endDate });
    }
  }

  getUpcomingEvents(limit: number = 10) {
    if (this.socket) {
      this.socket.emit('get_upcoming_events', { limit });
    }
  }

  // Calendar Replies
  createReply(replyData: any) {
    if (this.socket) {
      this.socket.emit('create_reply', replyData);
    }
  }

  updateReply(id: number, replyData: any) {
    if (this.socket) {
      this.socket.emit('update_reply', { id, reply: replyData });
    }
  }

  deleteReply(id: number) {
    if (this.socket) {
      this.socket.emit('delete_reply', { id });
    }
  }

  getReplies(eventId: number) {
    if (this.socket) {
      this.socket.emit('get_replies', { event_id: eventId });
    }
  }

  getThreadedReplies(eventId: number) {
    if (this.socket) {
      this.socket.emit('get_threaded_replies', { event_id: eventId });
    }
  }

  // Event Listeners
  onEventCreated(callback: (event: CalendarEvent) => void) {
    if (this.socket) {
      this.socket.on('event_created', callback);
    }
  }

  onEventUpdated(callback: (event: CalendarEvent) => void) {
    if (this.socket) {
      this.socket.on('event_updated', callback);
    }
  }

  onEventDeleted(callback: (data: { id: number }) => void) {
    if (this.socket) {
      this.socket.on('event_deleted', callback);
    }
  }

  onEventsRetrieved(callback: (events: CalendarEvent[]) => void) {
    if (this.socket) {
      this.socket.on('events_retrieved', callback);
    }
  }

  onUpcomingEventsRetrieved(callback: (events: CalendarEvent[]) => void) {
    if (this.socket) {
      this.socket.on('upcoming_events_retrieved', callback);
    }
  }

  onReplyCreated(callback: (reply: CalendarEventReply) => void) {
    if (this.socket) {
      this.socket.on('reply_created', callback);
    }
  }

  onReplyUpdated(callback: (reply: CalendarEventReply) => void) {
    if (this.socket) {
      this.socket.on('reply_updated', callback);
    }
  }

  onReplyDeleted(callback: (data: { id: number }) => void) {
    if (this.socket) {
      this.socket.on('reply_deleted', callback);
    }
  }

  onRepliesRetrieved(callback: (replies: CalendarEventReply[]) => void) {
    if (this.socket) {
      this.socket.on('replies_retrieved', callback);
    }
  }

  onThreadedRepliesRetrieved(callback: (replies: CalendarEventReply[]) => void) {
    if (this.socket) {
      this.socket.on('threaded_replies_retrieved', callback);
    }
  }

  // Success callbacks
  onEventCreatedSuccess(callback: (event: CalendarEvent) => void) {
    if (this.socket) {
      this.socket.on('event_created_success', callback);
    }
  }

  onEventUpdatedSuccess(callback: (event: CalendarEvent) => void) {
    if (this.socket) {
      this.socket.on('event_updated_success', callback);
    }
  }

  onEventDeletedSuccess(callback: (data: { id: number }) => void) {
    if (this.socket) {
      this.socket.on('event_deleted_success', callback);
    }
  }

  onReplyCreatedSuccess(callback: (reply: CalendarEventReply) => void) {
    if (this.socket) {
      this.socket.on('reply_created_success', callback);
    }
  }

  onReplyUpdatedSuccess(callback: (reply: CalendarEventReply) => void) {
    if (this.socket) {
      this.socket.on('reply_updated_success', callback);
    }
  }

  onReplyDeletedSuccess(callback: (data: { id: number }) => void) {
    if (this.socket) {
      this.socket.on('reply_deleted_success', callback);
    }
  }

  // Error handling
  onError(callback: (error: any) => void) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove listeners
  off(event: string) {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  offAll() {
    if (this.socket) {
      // Remove all specific event listeners
      this.socket.off('event_created');
      this.socket.off('event_updated');
      this.socket.off('event_deleted');
      this.socket.off('reply_created');
      this.socket.off('reply_updated');
      this.socket.off('reply_deleted');
      this.socket.off('events_retrieved');
      this.socket.off('upcoming_events_retrieved');
      this.socket.off('replies_retrieved');
      this.socket.off('threaded_replies_retrieved');
      this.socket.off('event_created_success');
      this.socket.off('event_updated_success');
      this.socket.off('event_deleted_success');
      this.socket.off('reply_created_success');
      this.socket.off('reply_updated_success');
      this.socket.off('reply_deleted_success');
      this.socket.off('error');
    }
  }
}

export const calendarSocketService = new CalendarSocketService(); 