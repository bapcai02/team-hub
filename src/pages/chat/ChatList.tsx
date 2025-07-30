import React, { useState, useEffect } from 'react';
import { Layout, Spin, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useChat } from '../../hooks/useChat';
import ChatSidebar from '../../components/chat/ChatSidebar';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import CreateConversationModal from '../../components/chat/CreateConversationModal';
import MainLayout from '../../layouts/MainLayout';
import { setSelectedConversation } from '../../features/chat/chatSlice';

const { Content } = Layout;

const ChatList: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [messageText, setMessageText] = useState('');

  // Get chat state from Redux
  const {
    conversations,
    messages,
    selectedConversation,
    loading,
    error
  } = useSelector((state: RootState) => state.chat);

  // Get current user from Redux
  const currentUser = useSelector((state: RootState) => 
    state.user.list.find(user => user.id === 1)
  );

  const dispatch = useDispatch();

  // Use chat hook for API operations
  const {
    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markAsRead,
    addReaction,
    removeReaction
  } = useChat();

  // Load conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      const firstConversation = conversations[0];
      dispatch(setSelectedConversation(firstConversation));
      fetchMessages(firstConversation.id);
    }
  }, [conversations, selectedConversation, fetchMessages, dispatch]);

  // Handle conversation selection
  const handleConversationSelect = (conversation: any) => {
    dispatch(setSelectedConversation(conversation));
    fetchMessages(conversation.id);
    markAsRead(conversation.id);
  };

  // Handle sending message
  const handleSendMessage = async (text: string) => {
    if (!selectedConversation || !text.trim()) return;

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        message: {
          conversationId: selectedConversation.id,
          content: text,
          type: 'text'
        }
      });
      setMessageText('');
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  // Handle sending file
  const handleSendFile = async (file: File) => {
    if (!selectedConversation) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('content', `File: ${file.name}`);

      const response = await fetch(`http://localhost:3001/api/messages/conversations/${selectedConversation.id}/file`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'mock-token'}`
        }
      });

      if (response.ok) {
        // Refresh messages after file upload
        fetchMessages(selectedConversation.id);
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  const handleAddReaction = (messageId: number, emoji: string) => {
    addReaction(messageId, emoji);
  };

  const handleRemoveReaction = (messageId: number, emoji: string) => {
    removeReaction(messageId, emoji);
  };

  // Handle creating new conversation
  const handleCreateConversation = async (data: any) => {
    try {
      await createConversation(data);
      setShowCreateModal(false);
      message.success('Conversation created successfully');
    } catch (error) {
      message.error('Failed to create conversation');
    }
  };

  // Show loading spinner for initial load
  if (loading.conversations && conversations.length === 0) {
    return (
      <MainLayout>
        <Content style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spin size="large" />
        </Content>
      </MainLayout>
    );
  }

  // Log messages prop for debugging
  console.log('ChatList messages prop:', messages);

  return (
    <MainLayout>
      <Content style={{ padding: 0, height: '100vh' }}>
        <div style={{ display: 'flex', height: '100%' }}>
          {/* Chat sidebar */}
          <div style={{ width: '320px', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
            <ChatSidebar
              conversations={conversations}
              selectedConversation={selectedConversation}
              onConversationSelect={handleConversationSelect}
              onCreateConversation={() => setShowCreateModal(true)}
              loading={loading.conversations}
            />
          </div>

          {/* Main chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <ChatHeader
                  conversation={selectedConversation}
                />

                {/* Messages list - always render when a conversation is selected */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <MessageList
                    messages={messages || []}
                    onAddReaction={handleAddReaction}
                    onRemoveReaction={handleRemoveReaction}
                  />
                </div>

                {/* Message input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  onSendFile={handleSendFile}
                  loading={loading.sending}
                  messageText={messageText}
                  onMessageTextChange={setMessageText}
                  disabled={false}
                />
              </>
            ) : (
              /* Empty state when no conversation selected */
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: '#999'
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💬</div>
                <div style={{ fontSize: '16px' }}>Select a conversation to start chatting</div>
              </div>
            )}
          </div>
        </div>

        {/* Create conversation modal */}
        <CreateConversationModal
          visible={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          onSubmit={handleCreateConversation}
          loading={loading.creating}
        />
      </Content>
    </MainLayout>
  );
};

export default ChatList;

