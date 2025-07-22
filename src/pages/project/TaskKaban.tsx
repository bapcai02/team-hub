import { useState } from 'react';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { Card, Button, Avatar, Tag, Input, Modal } from 'antd';
import { PlusOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

type TaskStatus = 'Chưa bắt đầu' | 'Đang làm' | 'Hoàn thành';

const statusList: { key: TaskStatus; color: string; icon: React.ReactNode }[] = [
  { key: 'Chưa bắt đầu', color: 'default', icon: <ClockCircleOutlined /> },
  { key: 'Đang làm', color: 'blue', icon: <SyncOutlined spin /> },
  { key: 'Hoàn thành', color: 'green', icon: <CheckCircleOutlined /> },
];

const initialTasks = [
  {
    name: 'Thiết kế UI',
    assignee: 'Nguyễn Văn A',
    status: 'Chưa bắt đầu' as TaskStatus,
    priority: 'Cao',
    deadline: '2024-07-20',
    description: 'Thiết kế giao diện dashboard và các module chính.',
  },
  {
    name: 'Phân tích yêu cầu',
    assignee: 'Trần Thị B',
    status: 'Đang làm' as TaskStatus,
    priority: 'Thấp',
    deadline: '2024-07-22',
    description: 'Phân tích nghiệp vụ và yêu cầu khách hàng.',
  },
  {
    name: 'Triển khai backend',
    assignee: 'Lê Văn C',
    status: 'Hoàn thành' as TaskStatus,
    priority: 'Cao',
    deadline: '2024-07-18',
    description: 'Xây dựng API và cấu trúc dữ liệu.',
  },
];

export default function TaskKanban() {
  const [tasks, setTasks] = useState(initialTasks);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    assignee: '',
    status: 'Chưa bắt đầu' as TaskStatus,
    priority: 'Thấp',
    deadline: '',
    description: '',
  });

  const handleAddTask = () => {
    if (!newTask.name.trim()) return;
    setTasks([...tasks, newTask]);
    setModalOpen(false);
    setNewTask({ name: '', assignee: '', status: 'Chưa bắt đầu', priority: 'Thấp', deadline: '', description: '' });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <HeaderBar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: 32 }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {statusList.map(status => (
              <div key={status.key} style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Tag color={status.color} style={{ fontWeight: 600, fontSize: 16 }}>
                    {status.icon} {status.key}
                  </Tag>
                  {status.key === 'Chưa bắt đầu' && (
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
                {tasks.filter(t => t.status === status.key).map((task, idx) => (
                  <Card
                    key={idx}
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
                      {task.name}
                      {task.priority && (
                        <Tag color={task.priority === 'Cao' ? 'red' : 'blue'} style={{ marginLeft: 8 }}>
                          {task.priority}
                        </Tag>
                      )}
                    </div>
                    <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>
                      <UserOutlined style={{ color: '#4B48E5', marginRight: 4 }} />
                      {task.assignee}
                      {task.deadline && (
                        <span style={{ marginLeft: 12 }}>
                          <ClockCircleOutlined style={{ color: '#faad14', marginRight: 4 }} />
                          {task.deadline}
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <div style={{ color: '#666', fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>
                        {task.description.length > 60 ? task.description.slice(0, 60) + '...' : task.description}
                      </div>
                    )}
                  </Card>
                ))}
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
              value={newTask.name}
              onChange={e => setNewTask({ ...newTask, name: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            <Input
              placeholder="Người phụ trách"
              value={newTask.assignee}
              onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
              style={{ marginBottom: 12 }}
            />
            {/* Có thể thêm chọn trạng thái nếu muốn */}
          </Modal>
        </div>
      </div>
    </div>
  );
}
