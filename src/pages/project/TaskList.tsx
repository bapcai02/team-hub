import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Input, Select, Space, message, Spin, Breadcrumb, DatePicker, Row, Col, Divider } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { getProjectDetail } from '../../features/project/projectSlice';
import { useTranslation } from 'react-i18next';
import axios from '../../services/axios';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import UserAvatar from '../../components/UserAvatar';

const { Search } = Input;

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'done': return 'green';
    case 'in_progress': return 'blue';
    case 'todo': return 'orange';
    default: return 'default';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'done': return 'Hoàn thành';
    case 'in_progress': return 'Đang làm';
    case 'todo': return 'Chưa bắt đầu';
    default: return status;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'red';
    case 'medium': return 'orange';
    case 'low': return 'blue';
    default: return 'default';
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

export default function TaskList() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const project = useSelector((state: RootState) => state.project.detail);
  const loading = useSelector((state: RootState) => state.project.loading);
  const error = useSelector((state: RootState) => state.project.error);

  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<string>('all');
  const [createdByFilter, setCreatedByFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<[string, string] | null>(null);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

  useEffect(() => {
    if (id) {
      dispatch(getProjectDetail(id));
      fetchTasks();
    }
  }, [dispatch, id]);

  const fetchTasks = async () => {
    if (!id) return;
    
    setTasksLoading(true);
    try {
      const response = await axios.get(`/projects/${id}/tasks`);
      
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

  // Get unique assignees and creators for filter options
  const uniqueAssignees = Array.from(new Set(tasks.map(task => task.assigned_to).filter(Boolean)));
  const uniqueCreators = Array.from(new Set(tasks.map(task => task.created_by).filter(Boolean)));

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(searchText.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesAssignee = assigneeFilter === 'all' || task.assigned_to?.toString() === assigneeFilter;
    const matchesCreatedBy = createdByFilter === 'all' || task.created_by?.toString() === createdByFilter;
    
    // Deadline filter
    let matchesDeadline = true;
    if (deadlineFilter !== 'all' && task.deadline) {
      const taskDate = new Date(task.deadline);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      switch (deadlineFilter) {
        case 'overdue':
          matchesDeadline = taskDate < today;
          break;
        case 'today':
          matchesDeadline = taskDate.toDateString() === today.toDateString();
          break;
        case 'tomorrow':
          matchesDeadline = taskDate.toDateString() === tomorrow.toDateString();
          break;
        case 'this_week':
          matchesDeadline = taskDate >= today && taskDate <= nextWeek;
          break;
        case 'no_deadline':
          matchesDeadline = !task.deadline;
          break;
      }
    }
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRangeFilter) {
      const taskDate = new Date(task.created_at);
      const startDate = new Date(dateRangeFilter[0]);
      const endDate = new Date(dateRangeFilter[1]);
      matchesDateRange = taskDate >= startDate && taskDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && 
           matchesCreatedBy && matchesDeadline && matchesDateRange;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'updated_at' || sortBy === 'deadline') {
      aValue = new Date(aValue || 0).getTime();
      bValue = new Date(bValue || 0).getTime();
    }
    
    if (sortOrder === 'ascend') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const columns = [
    {
      title: 'Task',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 600, color: '#222' }}>{text}</div>
          {record.description && (
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              {record.description.length > 50 ? record.description.slice(0, 50) + '...' : record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
      render: (assignedTo: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {assignedTo ? (
            <UserAvatar userId={assignedTo} size={24} showName={true} showPosition={true} />
          ) : (
            <span style={{ color: '#999' }}>Chưa phân công</span>
          )}
        </div>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'created_by',
      key: 'created_by',
      render: (createdBy: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {createdBy ? (
            <UserAvatar userId={createdBy} size={24} showName={true} showPosition={true} />
          ) : (
            <span style={{ color: '#999' }}>Không xác định</span>
          )}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (deadline: string) => (
        <span style={{ color: deadline ? '#faad14' : '#999' }}>
          {deadline ? new Date(deadline).toLocaleDateString() : 'Chưa có'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (createdAt: string) => (
        <span style={{ color: '#666', fontSize: 12 }}>
          {createdAt ? new Date(createdAt).toLocaleDateString() : 'Không xác định'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/projects/task/${record.id}`)}
          >
            Xem
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/projects/task/${record.id}/edit`)}
          >
            Sửa
          </Button>
        </Space>
      ),
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
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 0' }}>
          <div style={{ margin: '0 auto', padding: '0 40px' }}>
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
              <Breadcrumb.Item>Danh sách Tasks</Breadcrumb.Item>
            </Breadcrumb>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
                  Danh sách Tasks - {project?.name || `Project ${id}`}
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                  Project: {project?.name || `Project ${id}`} • {tasks.length} tasks tổng cộng • {sortedTasks.length} tasks hiển thị
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(`/projects/${id}`)}
                >
                  Quay lại dự án
                </Button>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => navigate(`/projects/${id}/tasks/create`)}
                >
                  Tạo Task mới
                </Button>
              </div>
            </div>

            <Card
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px #0001',
                border: 'none',
              }}
              bodyStyle={{ padding: 24 }}
            >
              <div style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <h3 style={{ margin: 0 }}>Bộ lọc</h3>
                      <Button 
                        size="small" 
                        onClick={() => {
                          setSearchText('');
                          setStatusFilter('all');
                          setPriorityFilter('all');
                          setAssigneeFilter('all');
                          setDeadlineFilter('all');
                          setCreatedByFilter('all');
                          setDateRangeFilter(null);
                          setSortBy('created_at');
                          setSortOrder('descend');
                        }}
                      >
                        Xóa tất cả bộ lọc
                      </Button>
                    </div>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Search
                      placeholder="Tìm kiếm tasks..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Trạng thái"
                      value={statusFilter}
                      onChange={setStatusFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả trạng thái</Select.Option>
                      <Select.Option value="todo">Chưa bắt đầu</Select.Option>
                      <Select.Option value="in_progress">Đang làm</Select.Option>
                      <Select.Option value="done">Hoàn thành</Select.Option>
                    </Select>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Độ ưu tiên"
                      value={priorityFilter}
                      onChange={setPriorityFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả độ ưu tiên</Select.Option>
                      <Select.Option value="high">Cao</Select.Option>
                      <Select.Option value="medium">Trung bình</Select.Option>
                      <Select.Option value="low">Thấp</Select.Option>
                    </Select>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Người thực hiện"
                      value={assigneeFilter}
                      onChange={setAssigneeFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả người thực hiện</Select.Option>
                      {uniqueAssignees.map(userId => (
                        <Select.Option key={userId} value={userId.toString()}>
                          <UserAvatar userId={parseInt(userId)} size={16} showName={true} />
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Người tạo"
                      value={createdByFilter}
                      onChange={setCreatedByFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả người tạo</Select.Option>
                      {uniqueCreators.map(userId => (
                        <Select.Option key={userId} value={userId.toString()}>
                          <UserAvatar userId={parseInt(userId)} size={16} showName={true} />
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Deadline"
                      value={deadlineFilter}
                      onChange={setDeadlineFilter}
                      style={{ width: '100%' }}
                      allowClear
                    >
                      <Select.Option value="all">Tất cả deadline</Select.Option>
                      <Select.Option value="overdue">Quá hạn</Select.Option>
                      <Select.Option value="today">Hôm nay</Select.Option>
                      <Select.Option value="tomorrow">Ngày mai</Select.Option>
                      <Select.Option value="this_week">Tuần này</Select.Option>
                      <Select.Option value="no_deadline">Không có deadline</Select.Option>
                    </Select>
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <DatePicker.RangePicker
                      placeholder={['Từ ngày', 'Đến ngày']}
                      value={dateRangeFilter ? [dayjs(dateRangeFilter[0]), dayjs(dateRangeFilter[1])] : null}
                      onChange={(dates) => {
                        if (dates) {
                          setDateRangeFilter([dates[0]?.format('YYYY-MM-DD') || '', dates[1]?.format('YYYY-MM-DD') || '']);
                        } else {
                          setDateRangeFilter(null);
                        }
                      }}
                      style={{ width: '100%' }}
                    />
                  </Col>
                  
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Select
                      placeholder="Sắp xếp theo"
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(value) => {
                        const [field, order] = value.split('-');
                        setSortBy(field);
                        setSortOrder(order as 'ascend' | 'descend');
                      }}
                      style={{ width: '100%' }}
                    >
                      <Select.Option value="created_at-descend">Mới nhất</Select.Option>
                      <Select.Option value="created_at-ascend">Cũ nhất</Select.Option>
                      <Select.Option value="updated_at-descend">Cập nhật gần nhất</Select.Option>
                      <Select.Option value="deadline-ascend">Deadline sớm nhất</Select.Option>
                      <Select.Option value="deadline-descend">Deadline muộn nhất</Select.Option>
                      <Select.Option value="title-ascend">Tên A-Z</Select.Option>
                      <Select.Option value="title-descend">Tên Z-A</Select.Option>
                      <Select.Option value="priority-descend">Độ ưu tiên cao nhất</Select.Option>
                      <Select.Option value="priority-ascend">Độ ưu tiên thấp nhất</Select.Option>
                    </Select>
                  </Col>
                </Row>
                
                <Divider style={{ margin: '16px 0' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Tag color="blue">{filteredTasks.length} tasks</Tag>
                    {(statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all' || 
                      deadlineFilter !== 'all' || createdByFilter !== 'all' || dateRangeFilter || searchText) && (
                      <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                        (Đã lọc)
                      </span>
                    )}
                  </div>
                  <div>
                    <Space>
                      <Button 
                        size="small" 
                        onClick={() => setSortOrder(sortOrder === 'ascend' ? 'descend' : 'ascend')}
                      >
                        {sortOrder === 'ascend' ? '↑' : '↓'} Sắp xếp
                      </Button>
                    </Space>
                  </div>
                </div>
              </div>

              <Table
                columns={columns}
                dataSource={sortedTasks}
                rowKey="id"
                loading={tasksLoading}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tasks`,
                }}
                locale={{
                  emptyText: 'Không có tasks nào',
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 