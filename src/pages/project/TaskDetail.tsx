import { useState, useEffect } from 'react';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { Card, Button, Breadcrumb, Input, DatePicker, Select, List, Upload, message, Divider, Row, Col, Tag, Spin } from 'antd';
import type { RcFile } from 'antd/es/upload';
import { ArrowLeftOutlined, EditOutlined, PaperClipOutlined, CommentOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { getProjectDetail } from '../../features/project/projectSlice';
import axios from '../../services/axios';
import UserAvatar from '../../components/UserAvatar';

const users = [
  { label: 'Nguyễn Văn A', value: 'Nguyễn Văn A' },
  { label: 'Trần Thị B', value: 'Trần Thị B' },
  { label: 'Lê Văn C', value: 'Lê Văn C' },
];

type TaskStatus = 'todo' | 'in_progress' | 'done';

const statusMap: Record<TaskStatus, { color: string; icon: React.ReactNode }> = {
  'todo': { color: 'orange', icon: <ClockCircleOutlined /> },
  'in_progress': { color: 'blue', icon: <SyncOutlined spin /> },
  'done': { color: 'green', icon: <CheckCircleOutlined /> },
};

// Helper functions
const getStatusText = (status: string) => {
  switch (status) {
    case 'done': return 'Hoàn thành';
    case 'in_progress': return 'Đang làm';
    case 'todo': return 'Chưa bắt đầu';
    default: return status;
  }
};

const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return priority;
  }
};

type CommentFile = { name: string; url: string; type: string };
type CommentType = {
  user: string;
  content: string;
  time: string;
  files?: CommentFile[];
};

export default function TaskDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get project info from Redux store
  const project = useSelector((state: RootState) => state.project.detail);
  
  // State cho task data
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State cho các trường chỉnh sửa trực tiếp
  const [name, setName] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [due, setDue] = useState('');
  const [description, setDescription] = useState('');
  const [logtimes, setLogtimes] = useState<any[]>([]);
  const [logtimeUser, setLogtimeUser] = useState(users[0].value);
  const [logtime, setLogtime] = useState('');
  const [logtimeDesc, setLogtimeDesc] = useState('');
  const [attachments, setAttachments] = useState<any[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentInput, setCommentInput] = useState('');

  // Fetch task data
  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  // Fetch project info when task is loaded
  useEffect(() => {
    if (task?.project_id) {
      dispatch(getProjectDetail(task.project_id));
    }
  }, [task?.project_id, dispatch]);

  const fetchTask = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/tasks/${id}`);
      
      if (response.data.success) {
        const taskData = response.data.data.task;
        setTask(taskData);
        setName(taskData.title || '');
        setAssignees(taskData.assigned_to ? [taskData.assigned_to.toString()] : []);
        setStatus(taskData.status || 'todo');
        setDue(taskData.deadline || '');
        setDescription(taskData.description || '');
        // TODO: Load logtimes, attachments, comments from API
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      setError('Failed to load task details');
      message.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  // Hàm upload file (giả lập)
  const handleUpload = (file: RcFile) => {
    setAttachments([...attachments, { name: file.name, url: '#' }]);
    message.success('Tải lên thành công!');
    return false;
  };

  // Hàm thêm logtime mới
  const handleAddLogtime = () => {
    if (!logtime || !logtimeUser) return;
    setLogtimes([
      ...logtimes,
      {
        user: logtimeUser,
        hours: Number(logtime),
        desc: logtimeDesc,
        time: new Date().toLocaleString('vi-VN'),
      },
    ]);
    setLogtime('');
    setLogtimeDesc('');
  };

  // Hàm thêm bình luận
  const handleAddComment = () => {
    if (commentInput.trim()) {
      setComments([...comments, { user: 'Bạn', content: commentInput, time: 'Vừa xong' }]);
      setCommentInput('');
    }
  };

  const statusOptions = [
    {
      label: (
        <span>
          <ClockCircleOutlined style={{ color: '#faad14' }} /> Chưa bắt đầu
        </span>
      ),
      value: 'todo',
    },
    {
      label: (
        <span>
          <SyncOutlined spin style={{ color: '#1890ff' }} /> Đang làm
        </span>
      ),
      value: 'in_progress',
    },
    {
      label: (
        <span>
          <CheckCircleOutlined style={{ color: '#52c41a' }} /> Hoàn thành
        </span>
      ),
      value: 'done',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>{error || 'Task not found'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>
                    <ArrowLeftOutlined /> {t('projects')}
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a onClick={() => navigate(`/projects/${task?.project_id}`)} style={{ cursor: 'pointer' }}>
                    {project?.name || `Project ${task?.project_id}`}
                  </a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{t('task')}: {name}</Breadcrumb.Item>
              </Breadcrumb>
              {task?.project_id && (
                <Button 
                  type="primary" 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(`/projects/${task.project_id}`)}
                >
                  Quay lại dự án
                </Button>
              )}
            </div>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px #0001',
                border: 'none',
                marginTop: 24,
                marginBottom: 24,
              }}
              bodyStyle={{ padding: 32 }}
            >
              <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
                {/* Cột trái: Thông tin chính */}
                <div style={{ flex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                    {editingName ? (
                      <Input
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        onBlur={() => setEditingName(false)}
                        onPressEnter={() => setEditingName(false)}
                        style={{ fontSize: 24, fontWeight: 700, width: 400 }}
                        autoFocus
                        placeholder={t('taskName')}
                      />
                    ) : (
                      <h1 style={{ margin: 0, fontWeight: 700, fontSize: 24, color: '#222', cursor: 'pointer' }} onClick={() => setEditingName(true)}>
                        {name} <EditOutlined style={{ fontSize: 16, color: '#aaa' }} />
                      </h1>
                    )}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <Row gutter={24}>
                      <Col span={12}>
                        <b><UserOutlined style={{ color: '#4B48E5' }} /> {t('assignees')}</b>
                        <Select
                          mode="multiple"
                          value={assignees}
                          onChange={setAssignees}
                          options={users}
                          style={{ width: '100%', marginTop: 8 }}
                          placeholder={t('selectAssignees')}
                        />
                      </Col>
                      <Col span={6}>
                        <b>
                          <span style={{ color: statusMap[status as TaskStatus].color }}>
                            {statusMap[status as TaskStatus].icon}
                          </span> {t('status')}
                        </b>
                        <Select
                          value={status}
                          onChange={setStatus}
                          options={statusOptions}
                          style={{ width: '100%', marginTop: 8 }}
                        />
                      </Col>
                      <Col span={6}>
                        <b><ClockCircleOutlined style={{ color: '#faad14' }} /> {t('dueDate')}</b>
                        <DatePicker
                          value={due ? dayjs(due) : null}
                          onChange={(d: dayjs.Dayjs | null) => setDue(d ? d.format('YYYY-MM-DD') : '')}
                          format="DD/MM/YYYY"
                          style={{ width: '100%', marginTop: 8 }}
                        />
                      </Col>
                    </Row>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <b>{t('description')}</b>
                    <ReactQuill
                      value={description}
                      onChange={setDescription}
                      style={{ marginTop: 8, background: '#fff', borderRadius: 8, height: 300 }}
                      placeholder={t('taskDescriptionPlaceholder')}
                      theme="snow"
                    />
                  </div>
                  <Divider />
                  <div style={{ marginBottom: 16 }}>
                    <b><ClockCircleOutlined /> {t('logtime')}</b>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 8 }}>
                      <Select
                        value={logtimeUser}
                        onChange={setLogtimeUser}
                        options={users}
                        style={{ width: 180 }}
                        placeholder={t('logUser')}
                      />
                      <Input
                        value={logtime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogtime(e.target.value)}
                        placeholder={t('logHours')}
                        style={{ width: 100 }}
                        type="number"
                        min={0}
                      />
                      <Input
                        value={logtimeDesc}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogtimeDesc(e.target.value)}
                        placeholder={t('logDesc')}
                        style={{ width: 220 }}
                      />
                      <Button type="primary" onClick={handleAddLogtime}>{t('log')}</Button>
                    </div>
                    <List
                      dataSource={logtimes}
                      renderItem={(item) => (
                        <Card
                          size="small"
                          style={{
                            marginBottom: 12,
                            background: '#f6f8fa',
                            borderLeft: '4px solid #4B48E5',
                            borderRadius: 8,
                            boxShadow: '0 1px 4px #0001',
                          }}
                          bodyStyle={{ padding: 12 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <UserAvatar userId={1} size={24} showPosition={true} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600 }}>
                                <ClockCircleOutlined style={{ color: '#faad14', marginRight: 4 }} />
                                {item.hours} giờ
                                <span style={{ color: '#888', marginLeft: 8 }}>{item.desc}</span>
                              </div>
                              <div style={{ fontSize: 12, color: '#aaa' }}>
                                {item.user} • {item.time}
                              </div>
                            </div>
                          </div>
                        </Card>
                      )}
                      locale={{ emptyText: 'Chưa có logtime.' }}
                      style={{ marginTop: 8 }}
                    />
                  </div>
                  <Divider />
                  <div>
                    <b><PaperClipOutlined /> {t('attachments')}</b>
                    <Upload
                      showUploadList={false}
                      beforeUpload={handleUpload}
                    >
                      <Button size="small" style={{ marginLeft: 8 }}>{t('upload')}</Button>
                    </Upload>
                    <List
                      dataSource={attachments}
                      renderItem={file => (
                        <List.Item>
                          <PaperClipOutlined style={{ marginRight: 8 }} />
                          <a href={file.url}>{file.name}</a>
                        </List.Item>
                      )}
                      locale={{ emptyText: 'Không có tệp đính kèm.' }}
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </div>
                {/* Cột phải: Bình luận, lịch sử */}
                <div style={{ flex: 1 }}>
                  <Card
                    style={{
                      borderRadius: 12,
                      boxShadow: '0 2px 8px #0001',
                      border: 'none',
                      marginBottom: 24,
                    }}
                    bodyStyle={{ padding: 24 }}
                    title={<span><CommentOutlined /> {t('comments')}</span>}
                  >
                    <List
                      dataSource={comments}
                      renderItem={(cmt) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<UserAvatar userId={1} size={32} showPosition={true} />}
                            title={
                              <span>
                                <b>{cmt.user}</b>
                                <span style={{ color: '#aaa', fontWeight: 400, fontSize: 12, marginLeft: 8 }}>
                                  <ClockCircleOutlined style={{ marginRight: 4 }} />
                                  {cmt.time}
                                </span>
                              </span>
                            }
                            description={
                              <div>
                                <CommentOutlined style={{ color: '#1890ff', marginRight: 4 }} />
                                {cmt.content}
                                {/* Hiển thị file/ảnh nếu có */}
                                {cmt.files && cmt.files.length > 0 && (
                                  <div style={{ marginTop: 8 }}>
                                    {cmt.files.map((file: CommentFile, idx: number) =>
                                      file.type.startsWith('image') ? (
                                        <img key={idx} src={file.url} alt={file.name} style={{ maxWidth: 80, marginRight: 8, borderRadius: 4 }} />
                                      ) : (
                                        <a key={idx} href={file.url} style={{ marginRight: 8 }}>
                                          <PaperClipOutlined /> {file.name}
                                        </a>
                                      )
                                    )}
                                  </div>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                      locale={{ emptyText: 'Chưa có bình luận.' }}
                    />
                    <ReactQuill
                      value={commentInput}
                      onChange={setCommentInput}
                      style={{
                        marginTop: 16,
                        background: '#fff',
                        borderRadius: 8,
                        minHeight: 120,   // hoặc height: 150
                        height: 150
                      }}
                      placeholder="Nhập bình luận, có thể chèn ảnh, file..."
                      theme="snow"
                    />
                    <div style={{ textAlign: 'right', marginTop: 8 }}>
                      <Button type="primary" onClick={handleAddComment}>{t('sendComment')}</Button>
                    </div>
                  </Card>
                  <Card
                    style={{
                      borderRadius: 12,
                      boxShadow: '0 2px 8px #0001',
                      border: 'none',
                    }}
                    bodyStyle={{ padding: 24 }}
                    title={t('activityHistory')}
                  >
                    <List
                      dataSource={[
                        { user: 'Nguyễn Văn A', action: 'cập nhật trạng thái task', time: '10 phút trước' },
                        { user: 'Trần Thị B', action: 'log 2 giờ', time: '1 giờ trước' },
                      ]}
                      renderItem={(item: { user: string; action: string; time: string }) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<UserAvatar userId={1} size={32} showPosition={true} />}
                            title={<span><b>{item.user}</b> {item.action}</span>}
                            description={item.time}
                          />
                        </List.Item>
                      )}
                      locale={{ emptyText: 'Chưa có lịch sử.' }}
                    />
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
