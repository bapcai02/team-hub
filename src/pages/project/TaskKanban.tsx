import { useState, useEffect } from 'react';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { Card, Button, Tag, Input, Modal, Breadcrumb, Spin, message } from 'antd';
import { PlusOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { getProjectDetail } from '../../features/project/projectSlice';
import { useTranslation } from 'react-i18next';
import axios from '../../services/axios';
import UserAvatar from '../../components/UserAvatar';

type TaskStatus = 'todo' | 'in_progress' | 'done';

const statusList: { key: TaskStatus; title: string; color: string; icon: React.ReactNode }[] = [
  { key: 'todo', title: 'Chưa bắt đầu', color: 'orange', icon: <ClockCircleOutlined /> },
  { key: 'in_progress', title: 'Đang làm', color: 'blue', icon: <SyncOutlined spin /> },
  { key: 'done', title: 'Hoàn thành', color: 'green', icon: <CheckCircleOutlined /> },
];

// Helper function to get priority color
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'blue';
    default: return 'default';
  }
};

// Helper function to get priority text
const getPriorityText = (priority: string) => {
  switch (priority) {
    case 'high': return 'Cao';
    case 'medium': return 'Trung bình';
    case 'low': return 'Thấp';
    default: return priority;
  }
};

export default function TaskKanban() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Debug: Log the id
  console.log('TaskKanban - Project ID:', id);
  
  const project = useSelector((state: RootState) => state.project.detail);
  const loading = useSelector((state: RootState) => state.project.loading);
  const error = useSelector((state: RootState) => state.project.error);

  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    assigned_to: '',
    status: 'todo' as TaskStatus,
    priority: 'low',
    deadline: '',
    description: '',
  });

  useEffect(() => {
    console.log('useEffect - ID changed:', id);
    if (id) {
      dispatch(getProjectDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    console.log('useEffect - Fetching tasks for ID:', id);
    if (id) {
      fetchTasks();
    }
  }, [id]);

  const fetchTasks = async () => {
    if (!id) {
      console.log('fetchTasks: No ID found');
      return;
    }
    
    console.log('fetchTasks: Fetching tasks for project ID:', id);
    setTasksLoading(true);
    try {
      const response = await axios.get(`/projects/${id}/kanban/tasks`);
      
      console.log('fetchTasks: Response:', response.data);
      if (response.data.success) {
        setTasks(response.data.data.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      message.error('Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      message.error('Failed to load project details');
    }
  }, [error]);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const response = await axios.post(`/projects/${id}/tasks`, {
        ...newTask,
        project_id: id,
        created_by: 1, // TODO: Get from user context
      });
      
      if (response.data.success) {
        message.success('Task created successfully');
        fetchTasks(); // Refresh tasks
        setModalOpen(false);
        setNewTask({ title: '', assigned_to: '', status: 'todo', priority: 'low', deadline: '', description: '' });
      }
    } catch (error) {
      console.error('Error creating task:', error);
      message.error('Failed to create task');
    }
  };

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

  if (!project) {
    return (
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <HeaderBar />
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar />
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div>Project not found</div>
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
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: 32 }}>
          <Breadcrumb style={{ marginBottom: 24 }}>
            <Breadcrumb.Item>
              <a onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>
                <ArrowLeftOutlined /> {t('projects')}
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <a onClick={() => navigate(`/projects/${id}`)} style={{ cursor: 'pointer' }}>
                {project?.name || `Project ${id}`}
              </a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{t('kanban')}</Breadcrumb.Item>
          </Breadcrumb>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: 0 }}>{project?.name || `Project ${id}`} - {t('kanban')}</h2>
              <p style={{ color: '#666', margin: '8px 0 0 0' }}>{project?.description || 'Không có mô tả'}</p>
            </div>
            <Button 
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(`/projects/${id}`)}
            >
              Quay lại dự án
            </Button>
          </div>
          
          <div style={{ display: 'flex', gap: 24 }}>
            {statusList.map(status => (
              <div key={status.key} style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Tag color={status.color} style={{ fontWeight: 600, fontSize: 16 }}>
                    {status.icon} {status.title}
                  </Tag>
                  {status.key === 'todo' && (
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size="small"
                      style={{ marginLeft: 'auto' }}
                      onClick={() => setModalOpen(true)}
                    >
                      Thêm task
                    </Button>
                  )}
                </div>
                {tasksLoading ? (
                  <div style={{ textAlign: 'center', padding: 20 }}>
                    <Spin />
                  </div>
                ) : (
                  tasks.filter(t => t.status === status.key).map((task, idx) => (
                    <Card
                      key={task.id || idx}
                      size="small"
                      style={{
                        marginBottom: 12,
                        borderLeft: `4px solid #4B48E5`,
                        borderRadius: 12,
                        boxShadow: '0 2px 8px #0002',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s',
                      }}
                      bodyStyle={{ padding: 16 }}
                      hoverable
                      onClick={() => {}}
                    >
                      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                        {task.title}
                        {task.priority && (
                          <Tag color={getPriorityColor(task.priority)} style={{ marginLeft: 8 }}>
                            {getPriorityText(task.priority)}
                          </Tag>
                        )}
                      </div>
                      <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>
                        <UserOutlined style={{ color: '#4B48E5', marginRight: 4 }} />
                        User ID: {task.assigned_to || 'Chưa phân công'}
                        {task.deadline && (
                          <span style={{ marginLeft: 12 }}>
                            <ClockCircleOutlined style={{ color: '#faad14', marginRight: 4 }} />
                            {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <div style={{ color: '#666', fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>
                          {task.description.length > 60 ? task.description.slice(0, 60) + '...' : task.description}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            ))}
          </div>
          {/* Modal thêm task */}
          <Modal
            open={modalOpen}
            title="Thêm task mới"
            onCancel={() => setModalOpen(false)}
            onOk={handleAddTask}
            okText="Thêm"
            cancelText="Hủy"
          >
            <Input
              placeholder="Tên task"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Người phụ trách (User ID)"
              value={newTask.assigned_to}
              onChange={e => setNewTask({ ...newTask, assigned_to: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Mô tả (tùy chọn)"
              value={newTask.description}
              onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Deadline (YYYY-MM-DD)"
              value={newTask.deadline}
              onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
              style={{ marginBottom: 12 }}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
}
