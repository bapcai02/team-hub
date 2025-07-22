import React, { useState } from 'react';
import { Card, Tabs, Tag, Button, Avatar, List, Descriptions, Breadcrumb, Badge, Space, Progress, Radio } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, FileTextOutlined, UnorderedListOutlined, HistoryOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from 'react-i18next';

const members = [
  { name: 'Nguyễn Văn A', role: 'Quản trị viên' },
  { name: 'Trần Thị B', role: 'Thành viên' },
];

const tasks = [
  { name: 'Thiết kế giao diện', assignee: 'Nguyễn Văn A', status: 'Đang làm', due: '10/06/2024' },
  { name: 'Phân tích yêu cầu', assignee: 'Trần Thị B', status: 'Hoàn thành', due: '05/06/2024' },
  { name: 'Triển khai backend', assignee: 'Lê Văn C', status: 'Chưa bắt đầu', due: '15/06/2024' },
];

const documents = [
  { name: 'Đặc tả dự án.pdf', type: 'PDF', uploader: 'Nguyễn Văn A', date: '01/06/2024' },
  { name: 'Kế hoạch.xlsx', type: 'Excel', uploader: 'Trần Thị B', date: '02/06/2024' },
];

const activities = [
  { user: 'Nguyễn Văn A', action: 'tạo task mới', time: '10 phút trước' },
  { user: 'Trần Thị B', action: 'upload tài liệu', time: '1 giờ trước' },
  { user: 'Lê Văn C', action: 'cập nhật trạng thái task', time: '2 giờ trước' },
];

export default function ProjectDetail() {
  const [taskView, setTaskView] = useState<'list' | 'kanban'>('list');
  const { t } = useTranslation();

  const taskStatus = [
    { key: 'Đang làm', title: 'Đang làm', color: 'blue' },
    { key: 'Hoàn thành', title: 'Hoàn thành', color: 'green' },
    { key: 'Chưa bắt đầu', title: 'Chưa bắt đầu', color: 'default' },
  ];

  // Kanban component như đã hướng dẫn ở trên
  const KanbanBoard = (
    <div style={{ display: 'flex', gap: 16, padding: 24, minHeight: 400 }}>
      {taskStatus.map(status => (
        <div key={status.key} style={{ flex: 1, background: '#fafbfc', borderRadius: 8, padding: 12, minWidth: 220 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#555' }}>
            <Tag color={status.color}>{status.title}</Tag>
          </div>
          {tasks.filter(t => t.status === status.key).length === 0 && (
            <div style={{ color: '#bbb', fontStyle: 'italic', textAlign: 'center', marginTop: 24 }}>Không có công việc</div>
          )}
          {tasks.filter(t => t.status === status.key).map(task => (
            <Card
              key={task.name}
              size="small"
              style={{ marginBottom: 12, borderLeft: `4px solid #4B48E5` }}
              bodyStyle={{ padding: 12 }}
            >
              <div style={{ fontWeight: 500 }}>{task.name}</div>
              <div style={{ fontSize: 13, color: '#888' }}>
                Người thực hiện: <b>{task.assignee}</b>
              </div>
              <div style={{ fontSize: 12, color: '#aaa' }}>
                Hạn: {task.due}
              </div>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );

  // List component như bạn đã có
  const TaskList = (
    <List
      style={{ padding: 24 }}
      itemLayout="horizontal"
      dataSource={tasks}
      renderItem={item => (
        <List.Item
          actions={[
            <Tag color={
              item.status === 'Hoàn thành' ? 'green' :
                item.status === 'Đang làm' ? 'blue' : 'default'
            }>{item.status}</Tag>
          ]}
        >
          <List.Item.Meta
            title={item.name}
            description={
              <>
                <span>Người thực hiện: <b>{item.assignee}</b></span><br />
                <span>Hạn: {item.due}</span>
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
                    <a href="/projects"><ArrowLeftOutlined /> {t('projects')}</a>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{t('project')} ABC</Breadcrumb.Item>
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
                    <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28, color: '#222' }}>{t('project')} ABC</h1>
                    <div style={{ marginTop: 8, color: '#888' }}>{t('description')}: TeamHub</div>
                  </div>
                  <Badge status="processing" text={<span style={{ fontWeight: 500, color: '#4B48E5' }}>{t('status')}: {t('processing')}</span>} />
                  <Button icon={<EditOutlined />} type="primary" style={{ marginLeft: 24 }}>{t('edit')}</Button>
                </div>
                <Card
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px #0001',
                    border: 'none',
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Descriptions column={1} labelStyle={{ fontWeight: 600, color: '#4B48E5' }}>
                    <Descriptions.Item label={t('manager')}>Nguyễn Văn A</Descriptions.Item>
                    <Descriptions.Item label={t('startDate')}>01/06/2024</Descriptions.Item>
                    <Descriptions.Item label={t('endDate')}>30/09/2024</Descriptions.Item>
                    <Descriptions.Item label={t('status')}>
                      <Tag color="processing">{t('processing')}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('members')}>{members.length}</Descriptions.Item>
                    <Descriptions.Item label={t('tasks')}>
                      {t('total')}: {tasks.length} &nbsp;|&nbsp;
                      {t('done')}: {tasks.filter(t => t.status === 'Hoàn thành').length} &nbsp;|&nbsp;
                      {t('processing')}: {tasks.filter(t => t.status === 'Đang làm').length}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('progress')}>
                      <Progress
                        percent={Math.round(
                          (tasks.filter(t => t.status === 'Hoàn thành').length / tasks.length) * 100
                        )}
                        size="small"
                        status="active"
                        style={{ width: 200 }}
                      />
                    </Descriptions.Item>
                    <Descriptions.Item label={t('docs')}>{documents.length}</Descriptions.Item>
                    <Descriptions.Item label={t('priority')}>
                      <Tag color="red">{t('high')}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('remainingTime')}>
                      100 {t('days')}
                    </Descriptions.Item>
                    <Descriptions.Item label={t('description')}>
                      {t('project')} TeamHub, {t('description')} nội bộ.
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
                          dataSource={members}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar style={{ background: '#4B48E5' }}>{item.name[0]}</Avatar>}
                                title={<span style={{ fontWeight: 600 }}>{item.name}</span>}
                                description={<Tag color={item.role === 'Quản trị viên' ? 'purple' : 'blue'}>{t(item.role === 'Quản trị viên' ? 'admin' : 'member')}</Tag>}
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
                            <Button
                              type="primary"
                              icon={<AppstoreOutlined />}
                              href="/projects/1/kanban"
                            >
                              {t('viewKanban')}
                            </Button>
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
                          dataSource={documents}
                          renderItem={item => (
                            <List.Item
                              actions={[
                                <Tag>{item.type}</Tag>
                              ]}
                            >
                              <List.Item.Meta
                                title={<a href="#">{item.name}</a>}
                                description={
                                  <>
                                    <span>Người upload: <b>{item.uploader}</b></span><br />
                                    <span>Ngày: {item.date}</span>
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
                          dataSource={activities}
                          renderItem={item => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={<Avatar>{item.user[0]}</Avatar>}
                                title={<span><b>{item.user}</b> {item.action}</span>}
                                description={item.time}
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
