// Import User type from userSlice
import { User } from '../features/user/userSlice';

export interface Conversation {
  id: number;
  type: 'personal' | 'group';
  name?: string;
  createdBy: number;
  lastMessageId?: number;
  createdAt: string;
  updatedAt: string;
  participants: User[];
}

export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  updated_at: string;
  created_at: string;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  isRead?: boolean;
}

export interface MessageAttachment {
  id: number;
  messageId: number;
  fileName: string;
  fileSize: number;
  filePath: string;
  fileType: string;
  createdAt: string;
}

export interface MessageReaction {
  id: number;
  messageId: number;
  userId: number;
  emoji: string;
  createdAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateConversationDto {
  type: 'personal' | 'group';
  name?: string;
  memberIds: number[];
}

export interface CreateMessageDto {
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
}

export interface UpdateMessageDto {
  content?: string;
  type?: 'text' | 'image' | 'file' | 'audio' | 'video';
}

export interface ChatState {
  conversations: Conversation[];
  messages: Message[];
  selectedConversation: Conversation | null;
  loading: boolean;
  error: string | null;
}

export interface SocketMessageData {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  type: string;
  createdAt: string;
}

export interface SocketTypingData {
  conversationId: number;
  userId: number;
  isTyping: boolean;
}

export interface SocketUserData {
  userId: number;
  isOnline: boolean;
  lastSeen: string;
}

export interface SocketReadData {
  conversationId: number;
  messageId: number;
  userId: number;
}

// UI-specific types for components
export interface UIConversation {
  id: number;
  type: 'personal' | 'group';
  name?: string;
  createdBy: number;
  lastMessageId?: number;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  // UI-specific fields
  avatar: string;
  time: string;
  isPinned: boolean;
  isSelected: boolean;
  onlineCount?: number;
  lastMessage?: string; // String instead of Message
  unreadCount?: number;
}

export interface UIMessage extends Omit<Message, 'sender' | 'lastMessage'> {
  sender: string;
  avatar: string;
  time: string;
  isOwn: boolean;
  isOnline: boolean;
  readBy: number[];
  uiReactions: {
    fire?: number;
    likes?: number;
    views?: number;
    users?: Record<string, string[]>;
    [key: string]: number | Record<string, string[]> | undefined;
  };
} 