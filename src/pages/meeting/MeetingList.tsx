import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Space, Tag, Avatar, Typography, Card, Row, Col, Statistic } from 'antd';
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store';
import Sidebar from '../../components/Sidebar';
import HeaderBar from '../../components/HeaderBar';
import { getUsers } from '../../features/user/userSlice';

const { Content } = Layout;
const { Title, Text } = Typography;

interface Meeting {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'in-person';
  participants: number[];
  organizer: number;
  meetingUrl?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

const MeetingList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { list: users, loading: usersLoading } = useSelector((state: RootState) => state.user);

  // Mock meetings data
  const [meetings] = useState<Meeting[]>([
    {
      id: 1,
      title: 'Weekly Team Standup',
      description: 'Daily standup meeting for the development team',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T09:30:00Z',
      status: 'upcoming',
      type: 'video',
      participants: [1, 2, 3, 4],
      organizer: 1,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      title: 'Project Review Meeting',
      description: 'Review progress on the new feature development',
      startTime: '2024-01-15T14:00:00Z',
      endTime: '2024-01-15T15:00:00Z',
      status: 'ongoing',
      type: 'video',
      participants: [1, 2, 5, 6],
      organizer: 2,
      meetingUrl: 'https://zoom.us/j/123456789',
      createdAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-12T14:00:00Z'
    },
    {
      id: 3,
      title: 'Client Presentation',
      description: 'Present the final design to the client',
      startTime: '2024-01-14T10:00:00Z',
      endTime: '2024-01-14T11:00:00Z',
      status: 'completed',
      type: 'video',
      participants: [1, 3, 7, 8],
      organizer: 1,
      meetingUrl: 'https://teams.microsoft.com/l/meetup-join/19:meeting_abc123',
      createdAt: '2024-01-08T09:00:00Z',
      updatedAt: '2024-01-14T11:00:00Z'
    },
    {
      id: 4,
      title: 'Office Meeting',
      description: 'In-person meeting in conference room A',
      startTime: '2024-01-16T13:00:00Z',
      endTime: '2024-01-16T14:00:00Z',
      status: 'upcoming',
      type: 'in-person',
      participants: [1, 2, 3, 4, 5],
      organizer: 3,
      location: 'Conference Room A',
      createdAt: '2024-01-13T16:00:00Z',
      updatedAt: '2024-01-13T16:00:00Z'
    }
  ]);

  useEffect(() => {
    // Load users if not already loaded
    if (users.length === 0) {
      dispatch(getUsers());
    }
  }, [dispatch, users.length]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'blue';
      case 'ongoing': return 'green';
      case 'completed': return 'default';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraOutlined />;
      case 'audio': return <ClockCircleOutlined />;
      case 'in-person': return <UserOutlined />;
      default: return <CalendarOutlined />;
    }
  };

  const getOrganizerName = (organizerId: number) => {
    const organizer = users.find(user => user.id === organizerId);
    return organizer?.name || `User ${organizerId}`;
  };

  const getParticipantNames = (participantIds: number[]) => {
    return participantIds
      .map(id => users.find(user => user.id === id)?.name || `User ${id}`)
      .join(', ');
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = [
    {
      title: 'Meeting',
      key: 'meeting',
      render: (record: Meeting) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar
            size={40}
            style={{ backgroundColor: '#7B7FFF' }}
            icon={getTypeIcon(record.type)}
          />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {record.title}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Organizer',
      key: 'organizer',
      render: (record: Meeting) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Avatar size={24} src={users.find(u => u.id === record.organizer)?.avatar}>
            {getOrganizerName(record.organizer).charAt(0)}
          </Avatar>
          <span>{getOrganizerName(record.organizer)}</span>
        </div>
      ),
    },
    {
      title: 'Participants',
      key: 'participants',
      render: (record: Meeting) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <UserOutlined style={{ marginRight: '4px' }} />
            {record.participants.length} participants
          </div>
          <div style={{ fontSize: '12px', color: '#666', maxWidth: '200px' }}>
            {getParticipantNames(record.participants)}
          </div>
        </div>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Meeting) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {formatDateTime(record.startTime)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {new Date(record.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
            {new Date(record.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (record: Meeting) => (
        <Tag color={getStatusColor(record.status)}>
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Meeting) => (
        <Space>
          {record.status === 'upcoming' && (
            <>
              <Button size="small" type="primary">
                Join
              </Button>
              <Button size="small">
                Edit
              </Button>
            </>
          )}
          {record.status === 'ongoing' && (
            <Button size="small" type="primary" danger>
              End
            </Button>
          )}
          {record.status === 'completed' && (
            <Button size="small">
              View Recording
            </Button>
          )}
          <Button size="small">
            Details
          </Button>
        </Space>
      ),
    },
  ];

  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming');
  const ongoingMeetings = meetings.filter(m => m.status === 'ongoing');
  const completedMeetings = meetings.filter(m => m.status === 'completed');

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
          {/* Header */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={2} style={{ margin: 0 }}>
                <CalendarOutlined style={{ marginRight: '8px' }} />
                Meetings
              </Title>
              <Button type="primary" icon={<PlusOutlined />} size="large">
                Create Meeting
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <Row gutter={16} style={{ marginBottom: '24px' }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total Meetings"
                  value={meetings.length}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Upcoming"
                  value={upcomingMeetings.length}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Ongoing"
                  value={ongoingMeetings.length}
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<VideoCameraOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={completedMeetings.length}
                  valueStyle={{ color: '#666' }}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Meetings Table */}
          <Card title="All Meetings" extra={
            <Space>
              <Button>Export</Button>
              <Button type="primary">Filter</Button>
            </Space>
          }>
            <Table
              columns={columns}
              dataSource={meetings}
              rowKey="id"
              loading={usersLoading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} meetings`
              }}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MeetingList; 