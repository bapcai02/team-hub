import { io, Socket } from 'socket.io-client';

interface SocketMessageData {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  type: 'text' | 'image' | 'audio';
  createdAt: string;
}

interface SocketTypingData {
  conversationId: number;
  userId: number;
  isTyping: boolean;
}

interface SocketUserData {
  userId: number;
  isOnline: boolean;
  lastSeen?: string;
}

interface SocketReadData {
  conversationId: number;
  userId: number;
  messageId: number;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Event handlers
  private messageHandlers: ((data: SocketMessageData) => void)[] = [];
  private messageDeletedHandlers: ((data: { messageId: number }) => void)[] = [];
  private conversationDeletedHandlers: ((data: { conversationId: number }) => void)[] = [];
  private typingHandlers: ((data: SocketTypingData) => void)[] = [];
  private userStatusHandlers: ((data: SocketUserData) => void)[] = [];
  private readReceiptHandlers: ((data: SocketReadData) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Chat service runs on port 3001
        const backendUrl = process.env.REACT_APP_CHAT_SOCKET_URL || 'http://localhost:3001';
        
        this.socket = io(backendUrl, {
          auth: {
            token
          },
          transports: ['websocket', 'polling'],
          timeout: 10000
        });

        this.socket.on('connect', () => {
          console.log('✅ Socket connected successfully');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          resolve();
        });

        this.socket.on('disconnect', (reason) => {
          console.log('❌ Socket disconnected:', reason);
          this.isConnected = false;
          this.notifyConnectionHandlers(false);
          this.attemptReconnect();
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Socket connection error:', error);
          this.isConnected = false;
          this.notifyConnectionHandlers(false);
          reject(error);
        });

        // Message events
        this.socket.on('new_message', (data: SocketMessageData) => {
          console.log('📨 Received new message:', data);
          this.notifyMessageHandlers(data);
        });

        this.socket.on('user_typing', (data: SocketTypingData) => {
          console.log('⌨️ User typing:', data);
          this.notifyTypingHandlers(data);
        });

        this.socket.on('user_status', (data: SocketUserData) => {
          console.log('👤 User status:', data);
          this.notifyUserStatusHandlers(data);
        });

        this.socket.on('messages_read', (data: SocketReadData) => {
          console.log('👁️ Messages read:', data);
          this.notifyReadReceiptHandlers(data);
        });

        this.socket.on('message_deleted', (data: { messageId: number }) => {
          console.log('🗑️ Message deleted:', data);
          this.notifyMessageDeletedHandlers(data);
        });

        this.socket.on('conversation_deleted', (data: { conversationId: number }) => {
          console.log('🗑️ Conversation deleted:', data);
          this.notifyConversationDeletedHandlers(data);
        });

        // Handle other events
        this.socket.on('user_joined', (data) => {
          console.log('👋 User joined:', data);
        });

        this.socket.on('user_left', (data) => {
          console.log('👋 User left:', data);
        });

        this.socket.on('error', (error) => {
          console.error('❌ Socket error:', error);
        });

      } catch (error) {
        console.error('❌ Failed to create socket connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Join conversation room
  joinConversation(conversationId: number): void {
    if (this.socket && this.isConnected) {
      console.log('🚪 Joining conversation:', conversationId);
      this.socket.emit('join_conversation', { conversationId });
    } else {
      console.warn('⚠️ Cannot join conversation: socket not connected');
    }
  }

  // Leave conversation room
  leaveConversation(conversationId: number): void {
    if (this.socket && this.isConnected) {
      console.log('🚪 Leaving conversation:', conversationId);
      this.socket.emit('leave_conversation', { conversationId });
    }
  }

  // Send message
  sendMessage(conversationId: number, content: string, type: 'text' | 'image' | 'audio' = 'text'): void {
    if (this.socket && this.isConnected) {
      console.log('📤 Sending message:', { conversationId, content, type });
      this.socket.emit('send_message', {
        conversationId,
        content,
        type
      });
    } else {
      console.warn('⚠️ Cannot send message: socket not connected');
    }
  }

  // Send typing indicator
  sendTyping(conversationId: number, isTyping: boolean): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
  }

  // Mark message as read
  markAsRead(conversationId: number, messageId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('read_messages', {
        conversationId,
        messageId
      });
    }
  }

  // Add reaction to message
  addReaction(messageId: number, emoji: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('add_reaction', {
        messageId,
        emoji
      });
    }
  }

  // Remove reaction from message
  removeReaction(messageId: number, emoji: string): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('remove_reaction', {
        messageId,
        emoji
      });
    }
  }

  // Delete message
  deleteMessage(messageId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete_message', {
        messageId
      });
    }
  }

  // Delete conversation
  deleteConversation(conversationId: number): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete_conversation', {
        conversationId
      });
    }
  }

  // Event handlers registration
  onMessage(handler: (data: SocketMessageData) => void): void {
    this.messageHandlers.push(handler);
  }

  onTyping(handler: (data: SocketTypingData) => void): void {
    this.typingHandlers.push(handler);
  }

  onUserStatus(handler: (data: SocketUserData) => void): void {
    this.userStatusHandlers.push(handler);
  }

  onReadReceipt(handler: (data: SocketReadData) => void): void {
    this.readReceiptHandlers.push(handler);
  }

  onConnection(handler: (connected: boolean) => void): void {
    this.connectionHandlers.push(handler);
  }

  onMessageDeleted(handler: (data: { messageId: number }) => void): void {
    this.messageDeletedHandlers.push(handler);
  }

  onConversationDeleted(handler: (data: { conversationId: number }) => void): void {
    this.conversationDeletedHandlers.push(handler);
  }

  // Remove event handlers
  offMessage(handler: (data: SocketMessageData) => void): void {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  offTyping(handler: (data: SocketTypingData) => void): void {
    this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
  }

  offUserStatus(handler: (data: SocketUserData) => void): void {
    this.userStatusHandlers = this.userStatusHandlers.filter(h => h !== handler);
  }

  offReadReceipt(handler: (data: SocketReadData) => void): void {
    this.readReceiptHandlers = this.readReceiptHandlers.filter(h => h !== handler);
  }

  offConnection(handler: (connected: boolean) => void): void {
    this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
  }

  offMessageDeleted(handler: (data: { messageId: number }) => void): void {
    this.messageDeletedHandlers = this.messageDeletedHandlers.filter(h => h !== handler);
  }

  offConversationDeleted(handler: (data: { conversationId: number }) => void): void {
    this.conversationDeletedHandlers = this.conversationDeletedHandlers.filter(h => h !== handler);
  }

  // Notify handlers
  private notifyMessageHandlers(data: SocketMessageData): void {
    this.messageHandlers.forEach(handler => handler(data));
  }

  private notifyTypingHandlers(data: SocketTypingData): void {
    this.typingHandlers.forEach(handler => handler(data));
  }

  private notifyUserStatusHandlers(data: SocketUserData): void {
    this.userStatusHandlers.forEach(handler => handler(data));
  }

  private notifyReadReceiptHandlers(data: SocketReadData): void {
    this.readReceiptHandlers.forEach(handler => handler(data));
  }

  private notifyMessageDeletedHandlers(data: { messageId: number }): void {
    this.messageDeletedHandlers.forEach(handler => handler(data));
  }

  private notifyConversationDeletedHandlers(data: { conversationId: number }): void {
    this.conversationDeletedHandlers.forEach(handler => handler(data));
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach(handler => handler(connected));
  }

  // Reconnection logic
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        const token = localStorage.getItem('token');
        if (token) {
          this.connect(token).catch(error => {
            console.error('❌ Reconnection failed:', error);
          });
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService; 