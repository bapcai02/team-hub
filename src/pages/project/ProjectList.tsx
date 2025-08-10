import React from 'react';
import { Layout, Button, Table, Modal, Form, Input, DatePicker, Select, Upload, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import HeaderBar from '../../components/HeaderBar';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { useEffect } from 'react';
import { getProjects, deleteProject } from '../../features/project/projectSlice';
import { Spin } from 'antd';
import { mapProjectsData } from '../../utils';
import { getProjectTableColumns } from '../../utils/table';
import { useNavigate } from 'react-router-dom';
import ProjectCreateModal from '../../components/modal/ProjectCreateModal'
import ProjectEditModal from '../../components/modal/ProjectEditModal'
import { getUsers } from '../../features/user/userSlice'
import type { Project } from '../../features/project/types'

const { Content } = Layout;
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

const ProjectList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [form] = Form.useForm();
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const [memberRoles, setMemberRoles] = React.useState<{[key:string]: string}>({});
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [dateRange, setDateRange] = React.useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const projects = useSelector((state: RootState) => state.project.list) || [];
  const loading = useSelector((state: RootState) => state.project.loading);
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list) as any[] || []

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.data?.user?.id || user?.data?.id || user?.id
    if (userId) {
      dispatch(getProjects(`?user_id=${userId}`))
    }
    dispatch(getUsers())
  }, [dispatch])


  const getMonthDiff = (start: any, end: any) => {
    if (!start || !end) return 0;
    const s = start.clone ? start.clone() : start;
    const e = end.clone ? end.clone() : end;
    return e.diff(s, 'months', true) + 1;
  };
  const refreshProjects = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.data?.user?.id || user?.data?.id || user?.id
    if (userId) {
      dispatch(getProjects(`?user_id=${userId}`))
    }
  }

  const handleEdit = (project: any) => {
    // Find the full project object from the projects list
    const fullProject = projects.find(p => p.id === project.key)
    if (fullProject) {
      setSelectedProject(fullProject)
      setEditModalOpen(true)
    }
  }

  const handleDelete = (project: any) => {
    Modal.confirm({
      title: t('confirmDelete') || 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: `${t('confirmDeleteProject') || 'Bạn có chắc chắn muốn xóa dự án'} "${project.name}"?`,
      okText: t('delete') || 'Xóa',
      okType: 'danger',
      cancelText: t('cancel') || 'Hủy',
      onOk: async () => {
        try {
          await dispatch(deleteProject(project.key)).unwrap()
          message.success(t('deleteSuccess') || 'Xóa dự án thành công!')
          refreshProjects()
        } catch (error: any) {
          console.error('Error deleting project:', error)
          message.error(error?.message || t('deleteError') || 'Có lỗi xảy ra khi xóa dự án!')
        }
      }
    })
  }

  const memberOptions = (users || []).map((u: any) => ({ value: String(u.id), label: u.name }))
  const tableData = mapProjectsData(projects)
  const columns = getProjectTableColumns(t, navigate, handleEdit, handleDelete)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>{t('projects')}</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
              {t('createNew')}
            </Button>
          </div>
          {loading ? (
            <Spin />
          ) : (
            <Table columns={columns} dataSource={tableData}
              pagination={{
                pageSize: 5,
                showSizeChanger: true,
                pageSizeOptions: [5, 10, 20],
                showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} / ${total} projects`
              }}
            />
          )}
          <ProjectCreateModal
            open={createModalOpen}
            onCancel={() => setCreateModalOpen(false)}
            onOk={() => setCreateModalOpen(false)}
            onProjectCreated={refreshProjects}
            form={form}
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            memberRoles={memberRoles}
            setMemberRoles={setMemberRoles}
            fileList={fileList}
            setFileList={setFileList}
            dateRange={dateRange}
            setDateRange={setDateRange}
            memberOptions={memberOptions}
            roleOptions={roleOptions}
            statusOptions={statusOptions}
            t={t}
            users={users}
          />
          
          <ProjectEditModal
            open={editModalOpen}
            onCancel={() => {
              setEditModalOpen(false)
              setSelectedProject(null)
            }}
            onOk={() => {
              setEditModalOpen(false)
              setSelectedProject(null)
            }}
            project={selectedProject}
            onProjectUpdated={refreshProjects}
            memberOptions={memberOptions}
            roleOptions={roleOptions}
            statusOptions={statusOptions}
            t={t}
            users={users}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectList;