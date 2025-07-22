import React from 'react';
import { Layout, Button, Table, Modal, Form, Input, DatePicker, Select, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Sidebar from '../../components/Sidebar';
import HeaderBar from '../../components/HeaderBar';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { useEffect } from 'react';
import { getProjects } from '../../features/project/projectSlice';
import { Spin } from 'antd';
import { mapProjectsData } from '../../utils';
import { getProjectTableColumns } from '../../utils/table';
import { useNavigate } from 'react-router-dom';
import ProjectCreateModal from '../../components/modal/ProjectCreateModal'
import { getUsers } from '../../features/user/userSlice'

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
  const [modalOpen, setModalOpen] = React.useState(false);
  const [form] = Form.useForm();
  const [selectedMembers, setSelectedMembers] = React.useState<string[]>([]);
  const [memberRoles, setMemberRoles] = React.useState<{[key:string]: string}>({});
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [dateRange, setDateRange] = React.useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const projects = useSelector((state: RootState) => state.project.list);
  const loading = useSelector((state: RootState) => state.project.loading);
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.user.list) as any[]

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    dispatch(getProjects(`?user_id=${user.data.user.id}`))
    dispatch(getUsers())
  }, [dispatch])


  const getMonthDiff = (start: any, end: any) => {
    if (!start || !end) return 0;
    const s = start.clone ? start.clone() : start;
    const e = end.clone ? end.clone() : end;
    return e.diff(s, 'months', true) + 1;
  };
  const memberOptions = users.map((u: any) => ({ value: u.id, label: u.name }))
  const tableData = mapProjectsData(projects)
  const columns = getProjectTableColumns(t, navigate)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Layout>
        <HeaderBar />
        <Content style={{ margin: '24px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>{t('projects')}</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
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
            open={modalOpen}
            onCancel={() => setModalOpen(false)}
            onOk={() => {
              form.validateFields().then((values: any) => {
                setModalOpen(false)
                form.resetFields()
                setSelectedMembers([])
                setMemberRoles({})
                setFileList([])
                setDateRange([null, null])
              })
            }}
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default ProjectList;