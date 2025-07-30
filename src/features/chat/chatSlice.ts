import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as chatApi from './api';
import { UIConversation, UIMessage, CreateConversationDto, CreateMessageDto, Conversation, Message } from '../../types/chat';
import type { SerializedError } from '@reduxjs/toolkit';

// Helper function to transform API conversation to UI format
const transformConversationToUI = (conversation: Conversation): UIConversation => {
  // Generate conversation name based on type and participants
  let conversationName = conversation.name;
  if (!conversationName) {
    if (conversation.type === 'group') {
      conversationName = `Group ${conversation.id}`;
    } else {
      // For personal chats, try to get participant name
      const otherParticipant = (conversation.participants || []).find(p => p.id !== 1); // Assuming current user ID is 1
      conversationName = otherParticipant?.name || `User ${conversation.id}`;
    }
  }

  // Generate avatar content from conversation name
  const avatarContent = conversationName.charAt(0).toUpperCase();

  return {
    ...conversation,
    participants: conversation.participants || [],
    name: conversationName,
    avatar: avatarContent,
    time: 'now',
    isPinned: false,
    isSelected: false,
    memberCount: conversation.type === 'group' ? (conversation.participants ? conversation.participants.length : 0) : undefined,
    onlineCount: conversation.participants ? conversation.participants.filter(p => p.isOnline).length : 0,
    lastMessage: 'No messages yet',
    unreadCount: 0
  };
};

// Helper function to transform API message to UI format
const transformMessageToUI = (message: Message, currentUserId: number): UIMessage => {
  const isOwn = message.senderId === currentUserId;
  
  // Parse reactions from API with user info
  const reactions = message.reactions || [];
  const reactionCounts: Record<string, number> = {};
  const reactionUsers: Record<string, string[]> = {};
  
  // Count each emoji reaction and collect user names
  reactions.forEach(reaction => {
    const emoji = reaction.emoji;
    reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
    
    // Add user name to reaction
    if (reaction.user?.name) {
      if (!reactionUsers[emoji]) {
        reactionUsers[emoji] = [];
      }
      reactionUsers[emoji].push(reaction.user.name);
    }
  });
  
  return {
    ...message,
    time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sender: isOwn ? 'You' : `User ${message.senderId}`,
    avatar: `https://via.placeholder.com/40?text=${message.senderId}`,
    isOwn,
    isOnline: isOwn ? true : Math.random() > 0.3, // Mock online status for other users
    readBy: message.isRead ? [currentUserId] : [],
    uiReactions: {
      fire: reactionCounts['🔥'] || 0,
      likes: reactionCounts['👍'] || 0,
      views: reactionCounts['👁️'] || 0,
      // Add all other reactions with user info
      ...reactionCounts,
      // Add user info for tooltips
      users: reactionUsers
    }
  };
};

// Mock conversations for testing
const mockConversations: Conversation[] = [
  {
    id: 1,
    type: 'personal',
    name: 'John Doe',
    createdBy: 1,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    participants: [
      { id: 1, name: 'You', email: 'you@example.com', isOnline: true },
      { id: 2, name: 'John Doe', email: 'john@example.com', isOnline: true }
    ]
  },
  {
    id: 2,
    type: 'group',
    name: 'Development Team',
    createdBy: 1,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
    participants: [
      { id: 1, name: 'You', email: 'you@example.com', isOnline: true },
      { id: 2, name: 'John Doe', email: 'john@example.com', isOnline: true },
      { id: 3, name: 'Jane Smith', email: 'jane@example.com', isOnline: false },
      { id: 4, name: 'Mike Johnson', email: 'mike@example.com', isOnline: true }
    ]
  },
  {
    id: 3,
    type: 'personal',
    name: 'Sarah Wilson',
    createdBy: 1,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T08:00:00Z',
    participants: [
      { id: 1, name: 'You', email: 'you@example.com', isOnline: true },
      { id: 5, name: 'Sarah Wilson', email: 'sarah@example.com', isOnline: false }
    ]
  }
];

// Mock messages for testing
const mockMessages: Message[] = [
  {
    id: 1,
    conversationId: 1,
    senderId: 2,
    content: 'Hey! How are you doing?',
    type: 'text',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isRead: true,
    reactions: []
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    content: 'I\'m doing great! Thanks for asking.',
    type: 'text',
    createdAt: '2024-01-15T10:32:00Z',
    updatedAt: '2024-01-15T10:32:00Z',
    isRead: true,
    reactions: []
  },
  {
    id: 3,
    conversationId: 1,
    senderId: 2,
    content: 'That\'s awesome! 🔥',
    type: 'text',
    createdAt: '2024-01-15T10:33:00Z',
    updatedAt: '2024-01-15T10:33:00Z',
    isRead: false,
    reactions: [{ id: 1, messageId: 3, userId: 1, emoji: '🔥', createdAt: '2024-01-15T10:34:00Z' }]
  }
];

// Async thunks for API operations
export const getConversations = createAsyncThunk(
  'chat/getConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.fetchConversations();      
      return response.data.data.conversations;
    } catch (error) {
      console.log('Using mock conversations due to API error');
      return mockConversations;
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (data: CreateConversationDto, { rejectWithValue }) => {
    try {
      const response = await chatApi.createConversation(data);
      return response.data.conversation;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const response = await chatApi.fetchMessages(conversationId);      
      return { conversationId, messages: response.data.data.messages };
    } catch (error) {
      console.log('Using mock messages due to API error');
      return { conversationId, messages: mockMessages };
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: { conversationId: number; message: CreateMessageDto }, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(data.conversationId, data.message);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchConversations = createAsyncThunk(
  'chat/searchConversations',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await chatApi.searchConversations(query);
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (conversationId: number, { rejectWithValue }) => {
    try {
      await chatApi.markAsRead(conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Optimistic update for reactions
export const updateReactionOptimistically = createAsyncThunk(
  'chat/updateReactionOptimistically',
  async ({ messageId, emoji, action }: { messageId: number; emoji: string; action: 'add' | 'remove' }, { getState }) => {
    const state = getState() as any;
    const message = state.chat.messages.find((m: any) => m.id === messageId);
    if (message) {
      if (action === 'add') {
        if (!message.uiReactions) message.uiReactions = { fire: 0, likes: 0, views: 0 };
        const uiReactions = message.uiReactions!;
        if (typeof uiReactions[emoji] !== 'number') {
          (uiReactions as any)[emoji] = 0;
        }
        (uiReactions as any)[emoji]++;
        if (emoji === '🔥') uiReactions.fire = (uiReactions.fire || 0) + 1;
        if (emoji === '👍') uiReactions.likes = (uiReactions.likes || 0) + 1;
      } else if (action === 'remove') {
        if (!message.uiReactions) message.uiReactions = { fire: 0, likes: 0, views: 0 };
        const uiReactions = message.uiReactions!;
        if (typeof (uiReactions as any)[emoji] === 'number') {
          (uiReactions as any)[emoji] = Math.max(0, (uiReactions as any)[emoji] - 1);
        }
        if (emoji === '🔥') uiReactions.fire = Math.max(0, (uiReactions.fire || 0) - 1);
        if (emoji === '👍') uiReactions.likes = Math.max(0, (uiReactions.likes || 0) - 1);
      }
    }
    return { messageId, emoji, action };
  }
);

// Add reaction
export const addReaction = createAsyncThunk(
  'chat/addReaction',
  async ({ messageId, emoji }: { messageId: number; emoji: string }, { dispatch, getState }) => {
    try {
      // Update state immediately for instant feedback
      dispatch(updateReactionOptimistically({ messageId, emoji, action: 'add' }));
      
      // Call API
      const response = await chatApi.addReaction(messageId, emoji);
      return { messageId, emoji };
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateReactionOptimistically({ messageId, emoji, action: 'remove' }));
      throw error;
    }
  }
);

// Remove reaction
export const removeReaction = createAsyncThunk(
  'chat/removeReaction',
  async ({ messageId, emoji }: { messageId: number; emoji: string }, { dispatch, getState }) => {
    try {
      // Update state immediately for instant feedback
      dispatch(updateReactionOptimistically({ messageId, emoji, action: 'remove' }));
      
      // Call API
      const response = await chatApi.removeReaction(messageId, emoji);
      return { messageId, emoji };
    } catch (error) {
      // Revert optimistic update on error
      dispatch(updateReactionOptimistically({ messageId, emoji, action: 'add' }));
      throw error;
    }
  }
);

// Chat state interface
interface ChatState {
  conversations: UIConversation[];
  messages: UIMessage[];
  selectedConversation: UIConversation | null;
  loading: {
    conversations: boolean;
    messages: boolean;
    sending: boolean;
    creating: boolean;
    searching: boolean;
  };
  error: null | SerializedError;
  typingUsers: number[];
  isConnected: boolean;
}

// Initial state
const initialState: ChatState = {
  conversations: [],
  messages: [],
  selectedConversation: null,
  loading: {
    conversations: false,
    messages: false,
    sending: false,
    creating: false,
    searching: false,
  },
  error: null,
  typingUsers: [],
  isConnected: false,
};

// Chat slice
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Set selected conversation
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    
    // Add message locally (for real-time updates)
    addMessage: (state, action) => {
      const message = transformMessageToUI(action.payload, 1);
      state.messages.push(message);
    },
    
    // Update message locally
    updateMessage: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.messages.findIndex(m => m.id === id);
      if (index !== -1) {
        state.messages[index] = { ...state.messages[index], ...updates };
      }
    },
    
    // Remove message locally
    removeMessage: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.filter(m => m.id !== messageId);
    },
    
    // Add typing user
    addTypingUser: (state, action) => {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers = [...state.typingUsers, action.payload];
      }
    },
    
    // Remove typing user
    removeTypingUser: (state, action) => {
      state.typingUsers = state.typingUsers.filter(id => id !== action.payload);
    },
    
    // Set connection status
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get conversations
    builder
      .addCase(getConversations.pending, (state) => {
        state.loading.conversations = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading.conversations = false;
        state.conversations = (action.payload || []).map(transformConversationToUI);
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading.conversations = false;
        state.error = action.payload as SerializedError;
      });

    // Create conversation
    builder
      .addCase(createConversation.pending, (state) => {
        state.loading.creating = true;
        state.error = null;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        state.loading.creating = false;
        const newConversation = transformConversationToUI(action.payload);
        state.conversations.unshift(newConversation);
      })
      .addCase(createConversation.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.payload as SerializedError;
      });

    // Get messages
    builder
      .addCase(getMessages.pending, (state) => {
        state.loading.messages = true;
        state.error = null;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading.messages = false;
        const { conversationId, messages } = action.payload;
        state.messages = (messages || []).map((msg: Message) => transformMessageToUI(msg, 1));
        
        // Update selected conversation if it matches
        if (state.selectedConversation?.id === conversationId) {
          state.selectedConversation = {
            ...state.selectedConversation,
            lastMessage: (messages && messages.length > 0 ? messages[messages.length - 1]?.content : 'No messages yet')
          };
        }
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.error = action.payload as SerializedError;
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.sending = false;
        const newMessage = transformMessageToUI(action.payload, 1);
        state.messages.push(newMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sending = false;
        state.error = action.payload as SerializedError;
      });

    // Search conversations
    builder
      .addCase(searchConversations.pending, (state) => {
        state.loading.searching = true;
        state.error = null;
      })
      .addCase(searchConversations.fulfilled, (state, action) => {
        state.loading.searching = false;
        state.conversations = (action.payload || []).map(transformConversationToUI);
      })
      .addCase(searchConversations.rejected, (state, action) => {
        state.loading.searching = false;
        state.error = action.payload as SerializedError;
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const conversationId = action.payload;
        // Update messages to mark them as read
        state.messages.forEach(message => {
          if (message.conversationId === conversationId && !message.isOwn) {
            message.isRead = true;
          }
        });
      });

    // Add reaction
    builder
      .addCase(addReaction.fulfilled, (state, action) => {
        const { messageId, emoji } = action.payload;
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          // Update UI reactions
          if (!message.uiReactions) message.uiReactions = { fire: 0, likes: 0, views: 0 };
          const uiReactions = message.uiReactions!;
          
          // Update specific emoji count
          if (typeof uiReactions[emoji] !== 'number') {
            (uiReactions as any)[emoji] = 0;
          }
          (uiReactions as any)[emoji]++;
          
          // Also update legacy fields for backward compatibility
          if (emoji === '🔥') uiReactions.fire = (uiReactions.fire || 0) + 1;
          if (emoji === '👍') uiReactions.likes = (uiReactions.likes || 0) + 1;
        }
      });

    // Remove reaction
    builder
      .addCase(removeReaction.fulfilled, (state, action) => {
        const { messageId, emoji } = action.payload;
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          // Update UI reactions
          if (!message.uiReactions) message.uiReactions = { fire: 0, likes: 0, views: 0 };
          const uiReactions = message.uiReactions!;
          
          // Update specific emoji count
          if (typeof (uiReactions as any)[emoji] === 'number') {
            (uiReactions as any)[emoji] = Math.max(0, (uiReactions as any)[emoji] - 1);
          }
          
          // Also update legacy fields for backward compatibility
          if (emoji === '🔥') uiReactions.fire = Math.max(0, (uiReactions.fire || 0) - 1);
          if (emoji === '👍') uiReactions.likes = Math.max(0, (uiReactions.likes || 0) - 1);
        }
      });
  },
});

export const {
  setSelectedConversation,
  addMessage,
  updateMessage,
  removeMessage,
  addTypingUser,
  removeTypingUser,
  setConnectionStatus,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer; 