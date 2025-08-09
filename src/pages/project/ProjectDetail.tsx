import { useState, useEffect } from 'react';
import { Card, Tabs, Tag, Button, List, Descriptions, Breadcrumb, Badge, Space, Radio, Spin, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, FileTextOutlined, UnorderedListOutlined, HistoryOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { getProjectDetail } from '../../features/project/projectSlice';
import ProjectStats from '../../components/ProjectStats';
import UserAvatar from '../../components/UserAvatar';

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'green';
    case 'in_progress': return 'blue';
    case 'todo': return 'orange';
    default: return 'default';
  }
};

// Helper function to get status text
const getStatusText = (status: string) => {
  switch (status) {
    case 'done': return 'Hoàn thành';
    case 'in_progress': return 'Đang làm';
    case 'todo': return 'Chưa bắt đầu';
    default: return status;
  }
};

export default function ProjectDetail() {
  const [taskView, setTaskView] = useState<'list' | 'kanban'>('list');
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const project = useSelector((state: RootState) => state.project.detail);
  const loading = useSelector((state: RootState) => state.project.loading);
  const error = useSelector((state: RootState) => state.project.error);

  useEffect(() => {
    if (id) {
      dispatch(getProjectDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      message.error('Failed to load project details');
    }
  }, [error]);

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

  const taskStatus = [
    { key: 'in_progress', title: 'Đang làm', color: 'blue' },
    { key: 'done', title: 'Hoàn thành', color: 'green' },
    { key: 'todo', title: 'Chưa bắt đầu', color: 'orange' },
  ];

  // Kanban component sử dụng dữ liệu từ API
  const KanbanBoard = (
    <div style={{ display: 'flex', gap: 16, padding: 24, minHeight: 400 }}>
      {taskStatus.map(status => (
        <div key={status.key} style={{ flex: 1, background: '#fafbfc', borderRadius: 8, padding: 12, minWidth: 220 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#555' }}>
            <Tag color={status.color}>{status.title}</Tag>
          </div>
          {(project.tasks || []).filter((t: any) => t.status === status.key).length === 0 && (
            <div style={{ color: '#bbb', fontStyle: 'italic', textAlign: 'center', marginTop: 24 }}>Không có công việc</div>
          )}
          {(project.tasks || []).filter((t: any) => t.status === status.key).map((task: any) => (
            <Card
              key={task.id}
              size="small"
              style={{ marginBottom: 12, borderLeft: `4px solid #4B48E5` }}
              bodyStyle={{ padding: 12 }}
            >
              <div style={{ fontWeight: 500 }}>{task.title}</div>
              <div style={{ fontSize: 13, color: '#888' }}>
                Người thực hiện: <b>User ID: {task.assigned_to}</b>
              </div>
              <div style={{ fontSize: 12, color: '#aaa' }}>
                Hạn: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Chưa có'}
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );

  // List component sử dụng dữ liệu từ API
  const TaskList = (
    <List
      style={{ padding: 24 }}
      itemLayout="horizontal"
      dataSource={project.tasks || []}
      renderItem={(item: any) => (
        <List.Item
          actions={[
            <Tag color={getStatusColor(item.status)}>{getStatusText(item.status)}</Tag>
          ]}
        >
          <List.Item.Meta
            title={item.title}
            description={
              <>
                <span>Người thực hiện: <b>User ID: {item.assigned_to}</b></span><br />
                <span>Hạn: {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'Chưa có'}</span>
              </>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 30px' }}>
          <div style={{ display: 'flex', gap: 32, margin: '0 auto' }}>
            {/* Cột trái: Thông tin dự án */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <a onClick={() => navigate('/projects')} style={{ cursor: 'pointer' }}>
                      <ArrowLeftOutlined /> {t('projects')}
                    </a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{project?.name || `Project ${id}`}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #0001',
                  padding: '24px 32px',
                  marginBottom: 0,
                }}>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28, color: '#222' }}>{project?.name || `Project ${id}`}</h1>
                    <div style={{ marginTop: 8, color: '#888' }}>{project?.description || t('noDescription')}</div>
                  </div>
                  <Badge 
                    status={project.status === 'active' ? 'processing' : project.status === 'completed' ? 'success' : 'default'} 
                    text={<span style={{ fontWeight: 500, color: '#4B48E5' }}>{t('status')}: {t(project.status)}</span>} 
                  />
                  <Button 
                    icon={<EditOutlined />} 
                    type="primary" 
                    style={{ marginLeft: 24 }}
                    onClick={() => navigate(`/projects/${id}/edit`)}
                  >
                    {t('edit')}
                  </Button>
                  <Button 
                    icon={<UnorderedListOutlined />} 
                    style={{ marginLeft: 12 }}
                    onClick={() => navigate(`/projects/${id}/tasks`)}
                  >
                    {t('viewTasks')}
                  </Button>
                  <Button 
                    icon={<AppstoreOutlined />} 
                    style={{ marginLeft: 12 }}
                    onClick={() => navigate(`/projects/${id}/kanban`)}
                  >
                    {t('viewKanban')}
                  </Button>
                </div>
                
                <ProjectStats project={project} t={t} />
                
                <Card
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px #0001',
                    border: 'none',
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Descriptions column={1} labelStyle={{ fontWeight: 600, color: '#4B48E5' }}>
                    <Descriptions.Item label={t('owner')}>ID: {project.owner_id}</Descriptions.Item>
                    <Descriptions.Item label={t('description')}>
                      {project.description || t('noDescription')}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Space>
            </div>
            {/* Cột phải: Tabs */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <Card
                style={{
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #0001',
                  border: 'none',
                  height: '100%',
                }}
                bodyStyle={{ padding: 0, minHeight: 500 }}
              >
                <Tabs
                  defaultActiveKey="members"
                  tabBarGutter={32}
                  tabBarStyle={{ padding: '0 24px', marginBottom: 0 }}
                  items={[
                    {
                      key: 'members',
                      label: <span><UserOutlined /> {t('members')}</span>,
                      children: (
                        <List
                          style={{ padding: 24 }}
                          itemLayout="horizontal"
                          dataSource={project.members || []}
                          renderItem={(item: any) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<UserAvatar userId={item.user_id} size={32} showPosition={true} />}
                                title={<span style={{ fontWeight: 600 }}>{item.name || `User ID: ${item.user_id}`}</span>}
                                description={<Tag color={item.role === 'manager' ? 'purple' : item.role === 'editor' ? 'blue' : 'green'}>{t(item.role)}</Tag>}
                              />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                    {
                      key: 'tasks',
                      label: <span><UnorderedListOutlined /> {t('tasks')}</span>,
                      children: (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px 0 24px' }}>
                            <div>
                              <Radio.Group
                                value={taskView}
                                onChange={e => setTaskView(e.target.value)}
                                optionType="button"
                                buttonStyle="solid"
                              >
                                <Radio.Button value="list"><BarsOutlined /> {t('list')}</Radio.Button>
                                <Radio.Button value="kanban"><AppstoreOutlined /> {t('kanban')}</Radio.Button>
                              </Radio.Group>
                            </div>
                            <Space>
                              <Button
                                type="primary"
                                icon={<UnorderedListOutlined />}
                                onClick={() => navigate(`/projects/${id}/tasks`)}
                              >
                                Xem danh sách
                              </Button>
                              <Button
                                icon={<AppstoreOutlined />}
                                onClick={() => navigate(`/projects/${id}/kanban`)}
                              >
                                {t('viewKanban')}
                              </Button>
                            </Space>
                          </div>
                          {taskView === 'list' ? TaskList : KanbanBoard}
                        </div>
                      ),
                    },
                    {
                      key: 'docs',
                      label: <span><FileTextOutlined /> {t('docs')}</span>,
                      children: (
                        <List
                          style={{ padding: 24 }}
                          itemLayout="horizontal"
                          dataSource={project.documents || []}
                          renderItem={(item: any) => (
                            <List.Item
                              actions={[
                                <Tag>{item.visibility}</Tag>
                              ]}
                            >
                              <List.Item.Meta
                                title={<a href="#">{item.title}</a>}
                                description={
                                  <>
                                    <span>Người tạo: <b>{item.creator?.name || item.user?.name || `User ID: ${item.created_by}`}</b></span><br />
                                    <span>Ngày: {new Date(item.created_at).toLocaleDateString()}</span>
                                  </>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                    {
                      key: 'activity',
                      label: <span><HistoryOutlined /> Lịch sử</span>,
                      children: (
                        <List
                          style={{ padding: 24 }}
                          itemLayout="horizontal"
                          dataSource={project.edit_history || []}
                          renderItem={(item: any) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<UserAvatar userId={item.user_id} size={32} showPosition={true} />}
                                title={<span><b>User ID: {item.user_id}</b> đã cập nhật dự án</span>}
                                description={
                                  <>
                                    <div>Thay đổi: {item.changes ? JSON.stringify(JSON.parse(item.changes), null, 2) : 'Không có thông tin'}</div>
                                    <div>Thời gian: {new Date(item.created_at).toLocaleString()}</div>
                                  </>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      ),
                    },
                  ]}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
