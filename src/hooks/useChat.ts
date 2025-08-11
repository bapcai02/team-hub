import { useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { User } from '../features/user/userSlice';
import {
  getConversations as getConversationsAction,
  createConversation as createConversationAction,
  getMessages as getMessagesAction,
  sendMessage as sendMessageAction,
  searchConversations as searchConversationsAction,
  markAsRead as markAsReadAction,
  addReaction as addReactionAction,
  removeReaction as removeReactionAction,
  setSelectedConversation,
  addMessage,
  updateMessage,
  removeMessage,
  addTypingUser,
  removeTypingUser,
  setConnectionStatus,
  clearError,
} from '../features/chat/chatSlice';
import socketService from '../services/socketService';
import { CreateConversationDto, CreateMessageDto } from '../types/chat';

interface UseChatReturn {
  // State
  conversations: any[];
  messages: any[];
  selectedConversation: any;
  loading: any;
  typingUsers: number[];
  isConnected: boolean;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: number) => Promise<void>;
  sendMessage: (data: { conversationId: number; message: CreateMessageDto }) => Promise<void>;
  searchConversations: (query: string) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  addReaction: (messageId: number, emoji: string) => Promise<void>;
  removeReaction: (messageId: number, emoji: string) => Promise<void>;
  createConversation: (data: CreateConversationDto) => Promise<void>;
  
  // Socket events
  onTyping: (isTyping: boolean) => void;
}

export const useChat = (): UseChatReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, messages, selectedConversation, loading, typingUsers, isConnected } = useSelector((state: RootState) => state.chat);
  const currentUser = useSelector((state: RootState) => state.user.list.find(user => user.id === 1) || null);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize chat functionality
  useEffect(() => {
    const initChat = async () => {
      try {
        // Connect to socket service
        const token = localStorage.getItem('token');
        if (token) {
          await socketService.connect(token);
          
          // Set up socket event handlers
          socketService.onConnection((connected) => {
            dispatch(setConnectionStatus(connected));
          });

          socketService.onMessage((data) => {
            handleNewMessage(data);
          });

          socketService.onTyping((data) => {
            handleTyping(data);
          });

          socketService.onUserStatus((data) => {
            handleUserStatus(data);
          });

          socketService.onReadReceipt((data) => {
            handleReadReceipt(data);
          });
        }

        // Load initial conversations
        await dispatch(getConversationsAction()).unwrap();
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        message.error('Failed to connect to chat service');
      }
    };

    initChat();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [dispatch]);

  // Handle new message from socket
  const handleNewMessage = useCallback((data: any) => {
    console.log('📨 New message received:', data);
    if (data.conversationId === selectedConversation?.id) {
      dispatch(addMessage({
        message: data,
        currentUserId: currentUser?.id || 1
      }));
    }
  }, [selectedConversation, dispatch, currentUser]);

  // Handle typing indicator from socket
  const handleTyping = useCallback((data: any) => {
    console.log('⌨️ User typing:', data);
    if (data.conversationId === selectedConversation?.id) {
      if (data.isTyping) {
        dispatch(addTypingUser(data.userId));
      } else {
        dispatch(removeTypingUser(data.userId));
      }
    }
  }, [selectedConversation, dispatch]);

  // Handle user status change from socket
  const handleUserStatus = useCallback((data: any) => {
    console.log('👤 User status changed:', data);
    // Update user online status in conversations
  }, []);

  // Handle read receipt from socket
  const handleReadReceipt = useCallback((data: any) => {
    console.log('👁️ Read receipt:', data);
    // Update message read status
  }, []);

  // Send typing indicator
  const onTyping = useCallback((isTyping: boolean) => {
    if (selectedConversation && currentUser) {
      socketService.sendTyping(selectedConversation.id, isTyping);
      
      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing indicator
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          socketService.sendTyping(selectedConversation.id, false);
        }, 3000);
      }
    }
  }, [selectedConversation, currentUser]);

  // API wrapper functions
  const fetchConversations = useCallback(async () => {
    try {
      await dispatch(getConversationsAction()).unwrap();            
    } catch (error) {
      console.error('Failed to get conversations:', error);
    }
  }, [dispatch]);

  const fetchMessages = useCallback(async (conversationId: number) => {
    try {
      await dispatch(getMessagesAction(conversationId)).unwrap();
    } catch (error) {
      console.error('Failed to get messages:', error);
    }
  }, [dispatch]);

  const sendMessage = useCallback(async (data: { conversationId: number; message: CreateMessageDto }) => {
    try {
      await dispatch(sendMessageAction({
        ...data,
        currentUserId: currentUser?.id || 1
      })).unwrap();
      
      // Send via socket for real-time delivery
      if (selectedConversation?.id === data.conversationId) {
        socketService.sendMessage(data.conversationId, data.message.content);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, [dispatch, selectedConversation, currentUser]);

  const searchConversations = useCallback(async (query: string) => {
    try {
      await dispatch(searchConversationsAction(query)).unwrap();
    } catch (error) {
      console.error('Failed to search conversations:', error);
    }
  }, [dispatch]);

  const markAsRead = useCallback(async (conversationId: number) => {
    try {
      await dispatch(markAsReadAction(conversationId)).unwrap();
      // Send read receipt via socket
      const lastMessage = messages.filter(m => m.conversationId === conversationId).slice(-1)[0];
      socketService.markAsRead(conversationId, lastMessage?.id || 0);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, [dispatch, messages]);

  const addReaction = useCallback(async (messageId: number, emoji: string) => {
    try {
      await dispatch(addReactionAction({ messageId, emoji })).unwrap();
      
      // Send reaction via socket
      socketService.addReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }, [dispatch]);

  const removeReaction = useCallback(async (messageId: number, emoji: string) => {
    try {
      await dispatch(removeReactionAction({ messageId, emoji })).unwrap();
      
      // Send reaction removal via socket
      socketService.removeReaction(messageId, emoji);
    } catch (error) {
      console.error('Failed to remove reaction:', error);
    }
  }, [dispatch]);

  const createConversation = useCallback(async (data: any) => {
    try {
      await dispatch(createConversationAction(data)).unwrap();
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }, [dispatch]);

  return {
    // State
    conversations,
    messages,
    selectedConversation,
    loading,
    typingUsers,
    isConnected,
    
    // Actions
    fetchConversations,
    fetchMessages,
    sendMessage,
    searchConversations,
    markAsRead,
    addReaction,
    removeReaction,
    createConversation,
    
    // Socket events
    onTyping,
  };
}; 