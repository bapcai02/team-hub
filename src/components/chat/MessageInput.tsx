import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Upload, message as antMessage } from 'antd';
import { PaperClipOutlined, AudioOutlined, SendOutlined, SmileOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';

const { TextArea } = Input;

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onSendFile: (file: File) => void;
  messageText: string;
  onMessageTextChange: (text: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendFile,
  messageText,
  onMessageTextChange,
  disabled = false,
  loading = false
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle clicking outside emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showEmojiPicker && !target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Handle emoji selection
  const handleEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject.emoji;
    onMessageTextChange(messageText + emoji);
    setShowEmojiPicker(false);
  };

  // Handle file selection
  const handleFileSelect = (file: File) => {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      antMessage.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      antMessage.error('File type not supported');
      return;
    }

    setSelectedFile(file);
  };

  // Handle file input change
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle send button click
  const handleSend = () => {
    if (selectedFile) {
      onSendFile(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else if (messageText.trim()) {
      onSendMessage(messageText.trim());
    }
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get file preview content
  const getFilePreview = () => {
    if (!selectedFile) return null;

    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '8px'
      }}>
        {/* File icon or preview */}
        <div style={{ fontSize: '20px' }}>
          {isImage ? '📷' : isVideo ? '🎥' : '📎'}
        </div>
        
        {/* File info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontSize: '12px', 
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {selectedFile.name}
          </div>
          <div style={{ fontSize: '10px', color: '#666' }}>
            {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
          </div>
        </div>
        
        {/* Remove button */}
        <Button
          type="text"
          size="small"
          onClick={handleRemoveFile}
          style={{ color: '#999' }}
        >
          ✕
        </Button>
      </div>
    );
  };

  return (
    <div style={{
      position: 'relative',
      padding: '16px 24px',
      backgroundColor: '#fff',
      borderTop: '1px solid #f0f0f0'
    }}>
      {/* File preview */}
      {selectedFile && getFilePreview()}
      
      {/* Input area */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        backgroundColor: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: '8px',
        padding: '8px 12px'
      }}>
        {/* File attachment button */}
        <Button
          type="text"
          icon={<PaperClipOutlined />}
          size="small"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || loading}
          style={{ color: '#666' }}
        />
        
        {/* Emoji picker button */}
        <Button
          type="text"
          icon={<SmileOutlined />}
          size="small"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={disabled || loading}
          style={{ color: '#666' }}
        />
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        
        {/* Message input */}
        <TextArea
          value={messageText}
          onChange={(e) => onMessageTextChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={disabled || loading}
          style={{
            border: 'none',
            resize: 'none',
            boxShadow: 'none',
            flex: 1
          }}
        />
        
        {/* Voice message button */}
        <Button
          type="text"
          icon={<AudioOutlined />}
          size="small"
          disabled={disabled || loading}
          style={{ color: '#666' }}
        />
        
        {/* Send button */}
        <Button
          type="primary"
          icon={<SendOutlined />}
          size="small"
          onClick={handleSend}
          disabled={disabled || loading || (!messageText.trim() && !selectedFile)}
          loading={loading}
          style={{
            backgroundColor: '#1890ff',
            borderColor: '#1890ff'
          }}
        />
      </div>
      
      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-container" style={{
          position: 'absolute',
          bottom: '100%',
          left: '24px',
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '1px solid #d9d9d9',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginBottom: '8px'
        }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default MessageInput; 