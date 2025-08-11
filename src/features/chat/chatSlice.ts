import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient, { chatApiClient } from '../../lib/apiClient';
import { Conversation, Message, CreateMessageDto, UIConversation, UIMessage } from '../../types/chat';
import type { SerializedError } from '@reduxjs/toolkit';

// Get current user ID from user state
const getCurrentUserId = (state: any): number => {
  // Try to get from user state first
  const currentUser = state.user?.list?.find((user: any) => user.id === 1);
  if (currentUser) {
    return currentUser.id;
  }
  
  // Fallback to hardcoded value if user state is not available
  return 1;
};

// Helper function to get current user ID from state
const getCurrentUserIdFromState = (state: any): number => {
  return getCurrentUserId(state);
};

// Polls
export const createPoll = createAsyncThunk(
  'chat/createPoll',
  async (pollData: { conversationId: number; question: string; options: string[]; allowMultiple?: boolean; anonymous?: boolean; expiresAt?: string }) => {
    const response = await chatApiClient.post('/polls', pollData);
    return response.data;
  }
);

export const getPollsByConversation = createAsyncThunk(
  'chat/getPollsByConversation',
  async (conversationId: number) => {
    const response = await chatApiClient.get(`/polls/conversations/${conversationId}`);
    return response.data;
  }
);

export const votePoll = createAsyncThunk(
  'chat/votePoll',
  async ({ pollId, optionIds }: { pollId: number; optionIds: number[] }) => {
    const response = await chatApiClient.post(`/polls/${pollId}/vote`, { optionIds });
    return response.data;
  }
);

export const getPollResults = createAsyncThunk(
  'chat/getPollResults',
  async (pollId: number) => {
    const response = await chatApiClient.get(`/polls/${pollId}/results`);
    return response.data;
  }
);

// Location
export const shareLocation = createAsyncThunk(
  'chat/shareLocation',
  async (locationData: { conversationId: number; latitude: number; longitude: number; address?: string }) => {
    const response = await chatApiClient.post('/locations/share', locationData);
    return response.data;
  }
);

// Conversation Settings
export const getConversationSettings = createAsyncThunk(
  'chat/getConversationSettings',
  async (conversationId: number) => {
    const response = await chatApiClient.get(`/conversations/${conversationId}/settings`);
    return response.data;
  }
);

export const updateConversationSettings = createAsyncThunk(
  'chat/updateConversationSettings',
  async ({ conversationId, settings }: { conversationId: number; settings: any }) => {
    const response = await chatApiClient.put(`/conversations/${conversationId}/settings`, settings);
    return response.data;
  }
);

export const addMemberToConversation = createAsyncThunk(
  'chat/addMemberToConversation',
  async ({ conversationId, userId }: { conversationId: number; userId: number }) => {
    const response = await chatApiClient.post(`/conversations/${conversationId}/settings/members`, { userId });
    return response.data;
  }
);

export const removeMemberFromConversation = createAsyncThunk(
  'chat/removeMemberFromConversation',
  async ({ conversationId, userId }: { conversationId: number; userId: number }) => {
    const response = await chatApiClient.delete(`/conversations/${conversationId}/settings/members/${userId}`);
    return response.data;
  }
);

export const leaveConversation = createAsyncThunk(
  'chat/leaveConversation',
  async (conversationId: number) => {
    const response = await chatApiClient.post(`/conversations/${conversationId}/settings/leave`);
    return response.data;
  }
);

export const deleteConversation = createAsyncThunk(
  'chat/deleteConversation',
  async (conversationId: number) => {
    const response = await chatApiClient.delete(`/conversations/${conversationId}/settings`);
    return response.data;
  }
);

// Helper function to transform API conversation to UI format
const transformConversationToUI = (conversation: Conversation): UIConversation => {
  // Generate conversation name based on type and participants
  let conversationName = conversation.name;
  if (!conversationName) {
    if (conversation.type === 'group') {
      conversationName = `Group ${conversation.id}`;
    } else {
      // For personal chats, try to get participant name
      const otherParticipant = (conversation.participants || []).find((p: any) => p.id !== 1); // Assuming current user ID is 1
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
    onlineCount: conversation.participants ? conversation.participants.filter((p: any) => p.isOnline).length : 0,
    lastMessage: 'No messages yet',
    unreadCount: 0
  };
};

// Helper function to transform API message to UI format
const transformMessageToUI = (message: Message, currentUserId: number): UIMessage => {
  console.log('Transforming message:', message, 'currentUserId:', currentUserId);
  const isOwn = message.senderId === currentUserId;
  
  // Parse reactions from API with user info
  const reactions = message.reactions || [];
  const reactionCounts: Record<string, number> = {};
  const reactionUsers: Record<string, string[]> = {};
  
  // Count each emoji reaction and collect user names
  reactions.forEach((reaction: any) => {
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
    time: message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Unknown',
    sender: isOwn ? 'You' : `User ${message.senderId || 'Unknown'}`,
    avatar: `https://via.placeholder.com/40?text=${message.senderId || 'U'}`,
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
      const response = await chatApiClient.get('/conversations');      
      return response.data.data.conversations;
    } catch (error) {
      console.log('API error fetching conversations, returning empty array');
      return [];
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (data: CreateMessageDto, { rejectWithValue }) => {
    try {
      const response = await chatApiClient.post('/conversations', data);
      console.log('Create conversation response:', response.data);
      return response.data.data?.conversation || response.data.conversation;
    } catch (error) {
      console.error('Create conversation error:', error);
      return rejectWithValue(error);
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId: number, { rejectWithValue }) => {
    try {
      const response = await chatApiClient.get(`/conversations/${conversationId}/messages`);      
      return { conversationId, messages: response.data.data.messages };
    } catch (error) {
      console.log('API error fetching messages, returning empty array');
      return { conversationId, messages: [] };
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (data: { conversationId: number; message: CreateMessageDto; currentUserId: number }, { rejectWithValue }) => {
    try {
      const response = await chatApiClient.post(`/conversations/${data.conversationId}/messages`, data.message);
      return { message: response.data.message, currentUserId: data.currentUserId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchConversations = createAsyncThunk(
  'chat/searchConversations',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await chatApiClient.get(`/conversations/search?q=${query}`);
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
      await chatApiClient.post(`/conversations/${conversationId}/mark-as-read`);
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
      const response = await chatApiClient.post(`/messages/${messageId}/reactions`, { emoji });
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
      const response = await chatApiClient.delete(`/messages/${messageId}/reactions/${emoji}`);
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
  selectedConversation: UIConversation | null;
  currentConversation: UIConversation | null;
  messages: UIMessage[];
  loading: {
    conversations: boolean;
    messages: boolean;
    sending: boolean;
    creating: boolean;
    searching: boolean;
  };
  error: string | null;
  polls: any[];
  pollResults: any;
  conversationSettings: any;
  settingsLoading: boolean;
  settingsError: string | null;
  typingUsers: number[];
  isConnected: boolean;
}

// Initial state
const initialState: ChatState = {
  conversations: [],
  selectedConversation: null,
  currentConversation: null,
  messages: [],
  loading: {
    conversations: false,
    messages: false,
    sending: false,
    creating: false,
    searching: false,
  },
  error: null,
  polls: [],
  pollResults: null,
  conversationSettings: null,
  settingsLoading: false,
  settingsError: null,
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
      state.currentConversation = action.payload;
    },
    
    // Add message locally (for real-time updates)
    addMessage: (state, action) => {
      const { message: messageData, currentUserId } = action.payload;
      const message = transformMessageToUI(messageData, currentUserId);
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
      state.typingUsers = state.typingUsers.filter((id: number) => id !== action.payload);
    },
    
    // Set connection status
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    clearPolls: (state) => {
      state.polls = [];
      state.pollResults = null;
    },
    clearConversationSettings: (state) => {
      state.conversationSettings = null;
      state.settingsError = null;
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
        state.error = action.error?.message || 'Failed to get conversations';
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
        state.error = action.error?.message || 'Failed to create conversation';
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
        const currentUserId = getCurrentUserIdFromState({ user: { list: [] } }); // We'll get this from the component
        state.messages = (messages || []).map((msg: Message) => transformMessageToUI(msg, currentUserId));
        
        // Update selected conversation if it matches
        if (state.currentConversation?.id === conversationId) {
          state.currentConversation = {
            ...state.currentConversation,
            lastMessage: (messages && messages.length > 0 ? messages[messages.length - 1]?.content : 'No messages yet')
          };
        }
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading.messages = false;
        state.error = action.error?.message || 'Failed to get messages';
      });

    // Send message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading.sending = false;
        const { message, currentUserId } = action.payload;
        const newMessage = transformMessageToUI(message, currentUserId);
        state.messages.push(newMessage);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading.sending = false;
        state.error = action.error?.message || 'Failed to send message';
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
        state.error = action.error?.message || 'Failed to search conversations';
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

    // Polls
    builder
      .addCase(createPoll.pending, (state) => {
        state.loading.creating = true;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.loading.creating = false;
        // Refresh polls for the conversation
        if (action.payload.success) {
          // Trigger getPollsByConversation
        }
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.error.message || 'Failed to create poll';
      })
      .addCase(getPollsByConversation.pending, (state) => {
        state.loading.messages = true;
      })
      .addCase(getPollsByConversation.fulfilled, (state, action) => {
        state.loading.messages = false;
        if (action.payload.success) {
          state.polls = action.payload.data.polls;
        }
      })
      .addCase(getPollsByConversation.rejected, (state, action) => {
        state.loading.messages = false;
        state.error = action.error.message || 'Failed to get polls';
      })
      .addCase(votePoll.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Refresh poll results
        }
      })
      .addCase(getPollResults.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.pollResults = action.payload.data.results;
        }
      });

    // Location
    builder
      .addCase(shareLocation.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Add location message to current conversation
          const locationMessage = action.payload.data.location;
          state.messages.push(locationMessage);
        }
      });

    // Conversation Settings
    builder
      .addCase(getConversationSettings.pending, (state) => {
        state.settingsLoading = true;
      })
      .addCase(getConversationSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        if (action.payload.success) {
          state.conversationSettings = action.payload.data.settings;
        }
      })
      .addCase(getConversationSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.error.message || 'Failed to get settings';
      })
      .addCase(updateConversationSettings.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.conversationSettings = action.payload.data.settings;
        }
      })
      .addCase(leaveConversation.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Remove conversation from list
          state.conversations = state.conversations.filter(
            conv => conv.id !== state.currentConversation?.id
          );
          state.currentConversation = null;
          state.messages = [];
        }
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        if (action.payload.success) {
          // Remove conversation from list
          state.conversations = state.conversations.filter(
            conv => conv.id !== state.currentConversation?.id
          );
          state.currentConversation = null;
          state.messages = [];
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
  clearPolls,
  clearConversationSettings,
} = chatSlice.actions;

export default chatSlice.reducer; 