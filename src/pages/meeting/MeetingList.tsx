import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  message, 
  Popconfirm,
  Row,
  Col,
  Statistic,
  Typography,
  Tooltip,
  Badge
} from 'antd';
import { 
  PlusOutlined, 
  PlayCircleOutlined, 
  StopOutlined, 
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState, AppDispatch } from '../../app/store';
import { 
  fetchMeetings, 
  fetchMeetingStats, 
  deleteMeeting, 
  startMeeting, 
  endMeeting, 
  cancelMeeting,
  Meeting 
} from '../../features/meeting';
import CreateMeetingModal from '../../components/meeting/CreateMeetingModal';
import EditMeetingModal from '../../components/meeting/EditMeetingModal';
import Sidebar from '../../components/Sidebar';
import HeaderBar from '../../components/HeaderBar';
import { format } from 'date-fns';

const { Title, Text } = Typography;
const { Content } = Layout;

const MeetingList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { meetings = [], stats, loading } = useSelector((state: RootState) => state.meeting);
  
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    dispatch(fetchMeetings({}));
    dispatch(fetchMeetingStats());
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteMeeting(id)).unwrap();
      message.success(t('meeting.deleted'));
    } catch (error) {
      message.error(t('meeting.deleteFailed'));
    }
  };

  const handleStartMeeting = async (id: number) => {
    try {
      await dispatch(startMeeting(id)).unwrap();
      message.success(t('meeting.started'));
    } catch (error) {
      message.error(t('meeting.startFailed'));
    }
  };

  const handleEndMeeting = async (id: number) => {
    try {
      await dispatch(endMeeting(id)).unwrap();
      message.success(t('meeting.ended'));
    } catch (error) {
      message.error(t('meeting.endFailed'));
    }
  };

  const handleCancelMeeting = async (id: number) => {
    try {
      await dispatch(cancelMeeting(id)).unwrap();
      message.success(t('meeting.cancelled'));
    } catch (error) {
      message.error(t('meeting.cancelFailed'));
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setEditModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'ongoing':
        return 'green';
      case 'finished':
        return 'default';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return t('meeting.status.scheduled');
      case 'ongoing':
        return t('meeting.status.ongoing');
      case 'finished':
        return t('meeting.status.finished');
      case 'cancelled':
        return t('meeting.status.cancelled');
      default:
        return status;
    }
  };

  const columns = [
    {
      title: t('meeting.title'),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: t('meeting.startTime'),
      dataIndex: 'start_time',
      key: 'start_time',
      render: (date: string) => (
        <Space>
          <ClockCircleOutlined />
          {format(new Date(date), 'dd/MM/yyyy HH:mm')}
        </Space>
      ),
    },
    {
      title: t('meeting.duration'),
      dataIndex: 'duration_minutes',
      key: 'duration_minutes',
      render: (minutes: number) => t('meeting.durationMinutes', { minutes }),
    },
    {
      title: t('meeting.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: t('meeting.participants'),
      dataIndex: 'participants',
      key: 'participants',
      render: (participants: any[]) => (
        <Space>
          <UserOutlined />
          <Badge count={participants?.length || 0} />
        </Space>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      render: (_: any, record: Meeting) => (
        <Space>
          {record.status === 'scheduled' && (
            <Tooltip title={t('meeting.startMeeting')}>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                size="small"
                onClick={() => handleStartMeeting(record.id)}
              />
            </Tooltip>
          )}
          
          {record.status === 'ongoing' && (
            <Tooltip title={t('meeting.endMeeting')}>
              <Button
                type="primary"
                danger
                icon={<StopOutlined />}
                size="small"
                onClick={() => handleEndMeeting(record.id)}
              />
            </Tooltip>
          )}
          
          {(record.status === 'scheduled' || record.status === 'ongoing') && (
            <Tooltip title={t('meeting.cancelMeeting')}>
              <Button
                icon={<CloseCircleOutlined />}
                size="small"
                onClick={() => handleCancelMeeting(record.id)}
              />
            </Tooltip>
          )}
          
          <Tooltip title={t('common.edit')}>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Popconfirm
            title={t('meeting.deleteConfirm')}
            onConfirm={() => handleDelete(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
          <div style={{ marginBottom: '24px' }}>
            <Row gutter={16} style={{ marginBottom: '24px' }}>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('meeting.stats.total')}
                    value={stats?.total || 0}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('meeting.stats.scheduled')}
                    value={stats?.scheduled || 0}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('meeting.stats.ongoing')}
                    value={stats?.ongoing || 0}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic
                    title={t('meeting.stats.upcoming')}
                    value={stats?.upcoming || 0}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Card>
              </Col>
            </Row>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3}>{t('meeting.title')}</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                {t('meeting.create')}
              </Button>
            </div>
          </div>

          <Card>
            <Table
              columns={columns}
              dataSource={meetings || []}
              rowKey="id"
              loading={loading.meetings}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  t('meeting.pagination', { from: range[0], to: range[1], total }),
              }}
            />
          </Card>

          <CreateMeetingModal
            visible={createModalVisible}
            onCancel={() => setCreateModalVisible(false)}
            onSuccess={() => {
              setCreateModalVisible(false);
              dispatch(fetchMeetings({}));
              dispatch(fetchMeetingStats());
            }}
          />

          <EditMeetingModal
            visible={editModalVisible}
            meeting={selectedMeeting}
            onCancel={() => {
              setEditModalVisible(false);
              setSelectedMeeting(null);
            }}
            onSuccess={() => {
              setEditModalVisible(false);
              setSelectedMeeting(null);
              dispatch(fetchMeetings({}));
              dispatch(fetchMeetingStats());
            }}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MeetingList; 