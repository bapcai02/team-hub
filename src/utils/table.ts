import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Tag, Button, Progress } from 'antd';
import React from 'react';

export function getProjectTableColumns(t: any, navigate: any) {
  return [
    {
      title: t('project'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement(Avatar, { style: { backgroundColor: '#87d068' }, icon: React.createElement(PlusOutlined) }),
          React.createElement('div', null,
            React.createElement('strong', null, text),
            React.createElement('br'),
            React.createElement('small', { style: { color: '#888' } }, record.category)
          )
        )
      ),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'Active' ? 'green' : 'orange';
        return React.createElement(Tag, { color }, status);
      },
    },
    {
      title: t('dueDate'),
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: t('team'),
      dataIndex: 'team',
      key: 'team',
      render: (team: string | number) => t('numberOfMembers', { count: team }),
    },
    {
      title: t('tasks'),
      dataIndex: 'tasks',
      key: 'tasks',
      render: (tasks: string | number) => t('numberOfTasks', { count: tasks }),
    },
    {
      title: t('progress'),
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: string | number) => (
        React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
          React.createElement(Progress, { percent: Number(progress), size: 'small' }),
          React.createElement('span', null, `${progress}%`)
        )
      ),
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_: any, record: any) => (
        React.createElement('div', { style: { display: 'flex', gap: '8px' } },
          React.createElement(Button, {
            type: 'link',
            icon: React.createElement(EditOutlined),
            onClick: () => navigate(`/projects/${record.key}`)
          }, t('edit')),
          React.createElement(Button, {
            type: 'link',
            danger: true,
            icon: React.createElement(DeleteOutlined)
          }, t('archive'))
        )
      ),
    },
  ];
}
