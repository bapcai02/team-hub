import React, { useState, useEffect } from 'react';
import { Card, Button, Breadcrumb, Spin, message, Space } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import HeaderBar from '../../components/HeaderBar';
import Sidebar from '../../components/Sidebar';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { getProjectDetail, updateProject } from '../../features/project/projectSlice';
import { getUsers } from '../../features/user/userSlice';
import ProjectEditModal from '../../components/modal/ProjectEditModal';
import type { Project } from '../../features/project/types';

const statusOptions = [
  { value: 'planning', label: 'Lên kế hoạch' },
  { value: 'active', label: 'Đang thực hiện' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'archived', label: 'Lưu trữ' },
];

const roleOptions = [
  { value: 'admin', label: 'Quản trị viên' },
  { value: 'member', label: 'Thành viên' },
];

export default function ProjectEdit() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const project = useSelector((state: RootState) => state.project.detail);
  const loading = useSelector((state: RootState) => state.project.loading);
  const error = useSelector((state: RootState) => state.project.error);
  const users = useSelector((state: RootState) => state.user.list) as any[];

  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProjectDetail(id));
      dispatch(getUsers());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      message.error('Failed to load project details');
    }
  }, [error]);

  const handleProjectUpdated = () => {
    setEditModalOpen(false);
    message.success('Project updated successfully!');
    navigate(`/projects/${id}`);
  };

  const memberOptions = users.map((u: any) => ({ value: String(u.id), label: u.name }));

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
        <div style={{ flex: 1, background: '#f6f8fa', overflow: 'auto', padding: '32px 30px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <a href="/projects"><ArrowLeftOutlined /> {t('projects')}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <a href={`/projects/${id}`}>{project.name}</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{t('edit')}</Breadcrumb.Item>
              </Breadcrumb>
              
              <Card
                style={{
                  borderRadius: 12,
                  boxShadow: '0 2px 8px #0001',
                  border: 'none',
                }}
                bodyStyle={{ padding: 24 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h2 style={{ margin: 0 }}>{t('editProject')}: {project.name}</h2>
                  <Button 
                    type="primary" 
                    icon={<SaveOutlined />}
                    onClick={() => setEditModalOpen(true)}
                  >
                    {t('edit')}
                  </Button>
                </div>
                
                <div style={{ color: '#666', lineHeight: 1.6 }}>
                  <p>Click the edit button above to modify project details.</p>
                  <p>You can update the project name, description, dates, status, members, and other information.</p>
                </div>
              </Card>
            </Space>
          </div>
        </div>
      </div>

      <ProjectEditModal
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={() => setEditModalOpen(false)}
        project={project}
        onProjectUpdated={handleProjectUpdated}
        memberOptions={memberOptions}
        roleOptions={roleOptions}
        statusOptions={statusOptions}
        t={t}
        users={users}
      />
    </div>
  );
} 