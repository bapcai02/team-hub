import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Typography, Tooltip, message, Input } from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  BarChartOutlined, 
  EnvironmentOutlined, 
  SettingOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import MainLayout from '../../layouts/MainLayout';
import ChatListComponent from '../../components/chat/ChatList';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import CreateConversationModal from '../../components/chat/CreateConversationModal';
import PollCreator from '../../components/chat/PollCreator';
import LocationShare from '../../components/chat/LocationShare';
import GroupManagement from '../../components/chat/GroupManagement';
import ThreadedReplies from '../../components/chat/ThreadedReplies';
import { useChat } from '../../hooks/useChat';
import { chatApiClient } from '../../lib/apiClient';

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ChatList: React.FC = () => {
  const { t } = useTranslation();
  const {
    conversations,
    messages,
    loading,
    selectedConversation: chatSelectedConversation,
    fetchConversations,
    fetchMessages,
    sendMessage,
    addReaction,
    removeReaction,
    deleteMessage,

    createConversation
  } = useChat();
  // Get current user from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user:', e);
      }
    }
    return null;
  };
  
  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.id || 1;
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPollModal, setShowPollModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showThreadModal, setShowThreadModal] = useState(false);
  
  // Local state
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation?.id) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages]);

  const handleConversationSelect = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleSearchMessages = (value: string) => {
    setSearchQuery(value);
    // TODO: Implement message search functionality
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedConversation?.id || !text.trim()) return;

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        message: {
          content: text,
          type: 'text'
        }
      });
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
      message.error('Failed to send message');
    }
  };

  const handleSendFile = async (file: File) => {
    if (!selectedConversation?.id) return;

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Send file to chat API
      const response = await chatApiClient.post(
        `/conversations/${selectedConversation.id}/messages/file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      message.success('File sent successfully');
    } catch (error) {
      message.error('Failed to send file');
    }
  };

  const handleAddReaction = (messageId: number, emoji: string) => {
    addReaction(messageId, emoji);
  };

  const handleRemoveReaction = (messageId: number, emoji: string) => {
    removeReaction(messageId, emoji);
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error; // Re-throw to let MessageList handle the error display
    }
  };

  const handleCreateConversation = async (data: any) => {
    try {
      await createConversation(data);
      setShowCreateModal(false);
      message.success('Conversation created successfully');
      
      // Refresh conversations to get the updated data with participants
      await fetchConversations();
    } catch (error) {
      console.error('Error creating conversation:', error);
      message.error('Failed to create conversation');
    }
  };

  return (
    <MainLayout>
      <Content style={{ 
        padding: '16px', 
        height: '100vh', 
        display: 'flex',
        backgroundColor: '#f5f5f5'
      }}>
        {/* Sidebar */}
        <div style={{ 
          width: '300px', 
          borderRight: '1px solid #e8e8e8', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#fafafa',
          borderRadius: '8px',
          marginRight: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <ChatListComponent
            onConversationSelect={handleConversationSelect}
            onCreateConversation={handleOpenCreateModal}
            selectedConversationId={selectedConversation?.id}
          />
        </div>

        {/* Main chat area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          marginLeft: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {selectedConversation ? (
            <>
              {/* Chat header */}
              <div style={{ 
                padding: '16px 24px', 
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div>
                  <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                    {selectedConversation.name}
                  </Title>
                  {selectedConversation.type === 'group' && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {selectedConversation.participants?.length || 0} members
                    </div>
                  )}
                </div>

                <Space size="small">
                  <Search
                    placeholder={t('chat.search.placeholder', 'Search messages...')}
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    onChange={(e) => handleSearchMessages(e.target.value)}
                    value={searchQuery}
                  />
                  
                  <Tooltip title={t('chat.poll', 'Create Poll')}>
                    <Button 
                      type="text" 
                      icon={<BarChartOutlined />} 
                      onClick={() => setShowPollModal(true)}
                      size="small"
                      style={{ color: '#666' }}
                    />
                  </Tooltip>
                  
                  <Tooltip title={t('chat.location', 'Share Location')}>
                    <Button 
                      type="text" 
                      icon={<EnvironmentOutlined />} 
                      onClick={() => setShowLocationModal(true)}
                      size="small"
                      style={{ color: '#666' }}
                    />
                  </Tooltip>
                  
                  {selectedConversation.type === 'group' && (
                    <Tooltip title={t('chat.group.manage', 'Manage Group')}>
                      <Button 
                        type="text" 
                        icon={<SettingOutlined />} 
                        onClick={() => setShowGroupModal(true)}
                        size="small"
                        style={{ color: '#666' }}
                      />
                    </Tooltip>
                  )}
                </Space>
              </div>

              {/* Messages list - always render when a conversation is selected */}
              <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#f8f9fa' }}>
                <MessageList
                  messages={messages || []}
                  onAddReaction={handleAddReaction}
                  onRemoveReaction={handleRemoveReaction}
                  onDeleteMessage={handleDeleteMessage}
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
              color: '#999',
              padding: '24px',
              backgroundColor: '#f8f9fa'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.6 }}>💬</div>
              <div style={{ fontSize: '20px', marginBottom: '12px', color: '#666', fontWeight: 500 }}>Select a conversation</div>
              <div style={{ fontSize: '14px', color: '#999', textAlign: 'center', maxWidth: '300px' }}>
                Choose a conversation from the sidebar to start chatting
              </div>
            </div>
          )}
        </div>

        {/* Create conversation modal */}
        <CreateConversationModal
          visible={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          onSubmit={handleCreateConversation}
          loading={loading.creating}
        />

        {/* Poll creator modal */}
        <PollCreator
          visible={showPollModal}
          onCancel={() => setShowPollModal(false)}
          conversationId={selectedConversation?.id}
        />

        {/* Location share modal */}
        <LocationShare
          visible={showLocationModal}
          onCancel={() => setShowLocationModal(false)}
          conversationId={selectedConversation?.id}
        />

        {/* Group management modal */}
        <GroupManagement
          visible={showGroupModal}
          onCancel={() => setShowGroupModal(false)}
          conversationId={selectedConversation?.id}
        />

        {/* Threaded replies modal */}
        <ThreadedReplies
          visible={showThreadModal}
          onCancel={() => setShowThreadModal(false)}
          messageId={selectedMessage?.id}
          onSendReply={(content) => {
            // Handle sending reply
            console.log('Sending reply:', content);
          }}
        />
      </Content>
    </MainLayout>
  );
};

export default ChatList;

