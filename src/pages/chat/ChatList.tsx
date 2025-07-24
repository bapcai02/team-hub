import React, { useState, useRef, useEffect } from 'react';
import { List, Avatar, Input, Button, Badge, Typography, Dropdown, Menu, Tooltip, Modal, Upload, Select, Form } from 'antd';
import { SendOutlined, UserOutlined, MoreOutlined, PhoneOutlined, VideoCameraOutlined, SearchOutlined, PlusOutlined, PaperClipOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import EmojiPicker from 'emoji-picker-react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import type PusherType from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof PusherType;
  }
}
window.Pusher = Pusher;

const { Text } = Typography;

const mockConversations = [
  {
    id: 1,
    name: 'Nguyen Van A',
    avatar: '',
    lastMessage: 'Bạn: Hẹn gặp lại nhé!',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: 'Team Marketing',
    avatar: '',
    lastMessage: 'Mai họp lúc 9h nha mọi người',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: 'Tran Thi B',
    avatar: '',
    lastMessage: 'Ok bạn nhé!',
    unread: 1,
    online: true,
  },
];

const mockUsers = [
  { value: 'Nguyen Van A', label: 'Nguyen Van A' },
  { value: 'Tran Thi B', label: 'Tran Thi B' },
  { value: 'Le Van C', label: 'Le Van C' },
  { value: 'Team Marketing', label: 'Team Marketing' },
];

const mockMessages = [
  { id: 1, fromMe: false, text: 'Chào bạn!', time: '09:00' },
  { id: 2, fromMe: true, text: 'Chào bạn, có việc gì không?', time: '09:01' },
  { id: 3, fromMe: false, text: 'Bạn rảnh không?', time: '09:02' },
  { id: 4, fromMe: true, text: 'Tối nay mình rảnh nhé!', time: '09:03' },
];

const emojiList = ['😀','😂','😍','😎','😭','👍','🎉','🔥','❤️','😡','😱','🤔'];

type ChatMessage =
  | { id: number; fromMe: boolean; text: string; time: string }
  | { id: number; fromMe: true; type: 'image' | 'file'; fileName: string; fileUrl: string; fileType: string; time: string };

export default function ChatList() {
  const [selected, setSelected] = useState(1);
  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Thêm state cho modal tạo nhóm, file, emoji
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [groupAvatar, setGroupAvatar] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  
  const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_REVERB_APP_KEY!,
    wsHost: process.env.REACT_APP_REVERB_HOST!,
    wsPort: Number(process.env.REACT_APP_REVERB_PORT),
    wssPort: Number(process.env.REACT_APP_REVERB_PORT),
    forceTLS: false,
    disableStats: true,
    cluster: 'mt1',
    enabledTransports: ['ws'],
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const channel = echo.channel('test-channel');

    channel.listen('.test-event', (data: any) => {
      console.log('Broadcast Received:', data.message);
      alert(`Broadcast Received: ${data.message}`);
    });
  }, []);

  const handleSend = () => {
    let newMessages: ChatMessage[] = [];
    if (input.trim()) {
      newMessages.push({
        id: Date.now(),
        fromMe: true,
        text: input,
        time: new Date().toLocaleTimeString().slice(0,5)
      });
    }
    pendingFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newMessages.push({
        id: Date.now() + Math.random(),
        fromMe: true,
        type: file.type.startsWith('image') ? 'image' : 'file',
        fileName: file.name,
        fileUrl: url,
        fileType: file.type,
        time: new Date().toLocaleTimeString().slice(0,5)
      });
    });
    if (newMessages.length > 0) {
      setMessages(msgs => [...msgs, ...newMessages]);
      setInput('');
      setPendingFiles([]);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInput(input + emoji);
    setShowEmoji(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPendingFiles([...pendingFiles, ...Array.from(e.target.files)]);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="call" icon={<PhoneOutlined />}>Gọi thoại</Menu.Item>
      <Menu.Item key="video" icon={<VideoCameraOutlined />}>Gọi video</Menu.Item>
      <Menu.Item key="search" icon={<SearchOutlined />}>Tìm kiếm trong chat</Menu.Item>
    </Menu>
  );

  const selectedConversation = mockConversations.find(c => c.id === selected);

  const filteredConversations = mockConversations.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', height: '100vh', minHeight: 0 }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <HeaderBar />
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Sidebar chat list */}
          <div style={{ width: 340, background: '#0a1437', borderRight: '1px solid #1e2746', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottom: '1px solid #1e2746' }}>
              <span style={{ fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: 1 }}>Chat</span>
              <Button shape="circle" icon={<PlusOutlined />} onClick={() => setShowCreateGroup(true)} />
            </div>
            <div style={{ padding: '12px 16px 0 16px' }}>
              <Input
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: '#b0b8d1' }} />}
                style={{ borderRadius: 20, background: '#19224a', color: '#fff', border: 'none' }}
                allowClear
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <List
              itemLayout="horizontal"
              dataSource={filteredConversations}
              style={{ flex: 1, overflowY: 'auto', background: 'transparent', marginTop: 8, minHeight: 0 }}
              renderItem={(item: typeof mockConversations[number]) => (
                <List.Item
                  style={{
                    background: selected === item.id ? 'rgba(0,198,251,0.13)' : 'transparent',
                    cursor: 'pointer',
                    padding: '14px 18px',
                    borderLeft: selected === item.id ? '4px solid #00c6fb' : '4px solid transparent',
                    transition: 'all 0.2s',
                    alignItems: 'center',
                  }}
                  onClick={() => setSelected(item.id)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge dot={item.online} offset={[-2, 32]} color="#00c6fb">
                        <Avatar src={item.avatar} icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={<span style={{ color: '#fff', fontWeight: 600 }}>{item.name}</span>}
                    description={
                      <span style={{ color: '#b0b8d1', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
                        {item.lastMessage}
                      </span>
                    }
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 32 }}>
                    {item.unread > 0 && <Badge count={item.unread} style={{ background: '#ff4d4f', boxShadow: 'none' }} />}
                    {item.online && <span style={{ color: '#00c6fb', fontSize: 10, marginTop: 4 }}>Online</span>}
                  </div>
                </List.Item>
              )}
            />
          </div>
          {/* Khung chat phải */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* Header chat */}
            <div style={{ height: 72, borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', padding: '0 32px', background: '#f8fafc', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar size={40} icon={<UserOutlined />} style={{ marginRight: 16 }} />
                <div>
                  <Text strong style={{ fontSize: 18 }}>{selectedConversation?.name}</Text>
                  <div style={{ fontSize: 13, color: selectedConversation?.online ? '#00c6fb' : '#aaa' }}>
                    {selectedConversation?.online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Tooltip title="Gọi thoại"><Button shape="circle" icon={<PhoneOutlined />} /></Tooltip>
                <Tooltip title="Gọi video"><Button shape="circle" icon={<VideoCameraOutlined />} /></Tooltip>
                <Dropdown overlay={menu} placement="bottomRight" trigger={['click']} arrow>
                  <Button shape="circle" icon={<MoreOutlined />} />
                </Dropdown>
              </div>
            </div>
            {/* Vùng chat scroll (chỉ div này scroll) */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 32, background: '#f5f6fa' }}>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.fromMe ? 'flex-end' : 'flex-start',
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      background: msg.fromMe ? 'linear-gradient(90deg, #00c6fb 0%, #005bea 100%)' : '#e6eaff',
                      color: msg.fromMe ? '#fff' : '#222',
                      borderRadius: 16,
                      padding: '10px 18px',
                      maxWidth: 340,
                      fontSize: 16,
                      boxShadow: '0 2px 8px #0001',
                      position: 'relative',
                    }}
                  >
                    {'type' in msg ? (
                      msg.type === 'image' ? (
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName}
                          style={{ maxWidth: 180, borderRadius: 8, cursor: 'pointer' }}
                          onClick={() => setPreviewImage(msg.fileUrl)}
                        />
                      ) : (
                        <a href={msg.fileUrl} download={msg.fileName} style={{ color: '#005bea', fontWeight: 600 }}>
                          <UploadOutlined /> {msg.fileName}
                        </a>
                      )
                    ) : (
                      <div>{msg.text}</div>
                    )}
                    <div style={{ fontSize: 11, color: msg.fromMe ? '#e0f7fa' : '#888', marginTop: 4, textAlign: 'right' }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input gửi tin nhắn (luôn cố định dưới) */}
            <div style={{ padding: 24, borderTop: '1px solid #f0f0f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Box icon bo tròn */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#e6eaff', borderRadius: 24, padding: '4px 10px', marginRight: 10, gap: 4 }}>
                <Button icon={<PaperClipOutlined />} style={{ border: 'none', background: 'transparent' }} onClick={handleFileClick} />
                <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleFileChange} />
                <Button icon={<SmileOutlined />} style={{ border: 'none', background: 'transparent' }} onClick={() => setShowEmoji(!showEmoji)} />
              </div>
              <Input
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onPressEnter={handleSend}
                style={{ borderRadius: 20, fontSize: 16, flex: 1 }}
                size="large"
              />
              <Button type="primary" icon={<SendOutlined />} size="large" onClick={handleSend} style={{ borderRadius: 20, fontWeight: 700, marginLeft: 8, boxShadow: '0 2px 8px #00c6fb30' }}>
                Gửi
              </Button>
              {/* Popup emoji */}
              {showEmoji && (
                <div style={{ position: 'absolute', bottom: 60, left: 70, zIndex: 10 }}>
                  <EmojiPicker
                    onEmojiClick={(emojiData: { emoji: string }) => handleEmojiClick(emojiData.emoji)}
                  />
                </div>
              )}
            </div>
            {/* Hiển thị file đã chọn (nếu có) */}
            {pendingFiles.length > 0 && (
              <div style={{ padding: '0 24px 12px 24px', display: 'flex', gap: 10 }}>
                {pendingFiles.map((file, idx) => (
                  <div key={idx} style={{ background: '#e6eaff', borderRadius: 8, padding: '4px 10px', fontSize: 13 }}>
                    <UploadOutlined /> {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modal tạo nhóm và modal preview ảnh giữ nguyên, đặt ngoài cùng div cha */}
      <Modal open={showCreateGroup} onCancel={() => setShowCreateGroup(false)} title="Tạo nhóm mới" footer={null}>
        <Form layout="vertical">
          <Form.Item label="Tên nhóm">
            <Input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Nhập tên nhóm" />
          </Form.Item>
          <Form.Item label="Thành viên">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Chọn thành viên"
              value={groupMembers}
              onChange={setGroupMembers}
              options={mockUsers}
            />
          </Form.Item>
          <Form.Item label="Ảnh nhóm">
            <Upload
              beforeUpload={(file: File) => { setGroupAvatar(file); return false; }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              {groupAvatar && <span style={{ marginLeft: 12 }}>{groupAvatar.name}</span>}
            </Upload>
          </Form.Item>
          <Button type="primary" block onClick={() => setShowCreateGroup(false)}>
            Tạo nhóm
          </Button>
        </Form>
      </Modal>
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
        bodyStyle={{ padding: 0, textAlign: 'center', background: '#222' }}
        closeIcon={<span style={{ color: '#fff', fontSize: 24 }}>×</span>}
      >
        <img src={previewImage!} alt="preview" style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain' }} />
      </Modal>
    </div>
  );
}
