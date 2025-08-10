import React, { useState } from 'react'
import { Modal, Form, Input, DatePicker, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { useDispatch } from 'react-redux'
import type { AppDispatch } from '../../app/store'
import { createNewProject, getProjects } from '../../features/project/projectSlice'

interface ProjectCreateModalProps {
  open: boolean
  onCancel: () => void
  onOk: () => void
  form: any
  selectedMembers: string[]
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>
  memberRoles: { [key: string]: string }
  setMemberRoles: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>
  fileList: any[]
  setFileList: React.Dispatch<React.SetStateAction<any[]>>
  dateRange: [Dayjs | null, Dayjs | null]
  setDateRange: React.Dispatch<React.SetStateAction<[Dayjs | null, Dayjs | null]>>
  memberOptions: { value: string, label: string }[]
  roleOptions: { value: string, label: string }[]
  statusOptions: { value: string, label: string }[]
  users: any[]
  t: any
  onProjectCreated?: () => void
}

const { RangePicker } = DatePicker

const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({
  open,
  onCancel,
  onOk,
  form,
  selectedMembers,
  setSelectedMembers,
  memberRoles,
  setMemberRoles,
  fileList,
  setFileList,
  dateRange,
  setDateRange,
  memberOptions,
  roleOptions,
  statusOptions,
  users,
  t,
  onProjectCreated,
}) => {
  const [watchedBudget, setWatchedBudget] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  // Theo dõi thay đổi ngân sách
  React.useEffect(() => {
    setWatchedBudget(form.getFieldValue('budget') || 0)
    const unsubscribe = form.subscribe?.(() => {
      setWatchedBudget(form.getFieldValue('budget') || 0)
    })
    return () => { if (unsubscribe) unsubscribe() }
  }, [form])

  const getMonthDiff = (start: any, end: any) => {
    if (!start || !end) return 1;
    const s = start.clone ? start.clone() : start;
    const e = end.clone ? end.clone() : end;
    return Math.max(1, Math.round(e.diff(s, 'months', true) + 1));
  };
  const numMonths = dateRange[0] && dateRange[1] ? getMonthDiff(dateRange[0], dateRange[1]) : 1;
  const totalSalary = selectedMembers.reduce((sum: number, m: any) => sum + (users.find((u: any) => u.id === m)?.employee?.salary || 0), 0);
  const profit = Math.round((watchedBudget / numMonths) - (totalSalary / numMonths));

  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      // Validate form fields first
      const values = await form.validateFields()
      
      // Check required fields
      if (!values.name || values.name.trim() === '') {
        message.error(t('projectName') + ' ' + (t('required') || 'là bắt buộc'))
        setLoading(false)
        return
      }
      
      if (!values.manager) {
        message.error(t('selectManager') || 'Vui lòng chọn quản lý dự án')
        setLoading(false)
        return
      }
      
      if (!values.budget || Number(values.budget) <= 0) {
        message.error(t('budget') + ' ' + (t('required') || 'là bắt buộc'))
        setLoading(false)
        return
      }
      
      // Validate date range
      if (!dateRange[0] || !dateRange[1]) {
        message.error(t('selectProjectTime') || 'Vui lòng chọn thời gian dự án!')
        setLoading(false)
        return
      }
      
      const projectData = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        owner_id: values.manager, // Backend expects owner_id, not manager_id
        start_date: dateRange[0].format('YYYY-MM-DD'),
        end_date: dateRange[1].format('YYYY-MM-DD'),
        total_amount: Number(values.budget), // Backend expects total_amount, not budget
        status: values.status || 'planning',
        members: selectedMembers.map(memberId => Number(memberId)),
        attachments: fileList.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      }

      console.log('Sending project data:', projectData)
      
      await dispatch(createNewProject(projectData)).unwrap()
      
      message.success(t('createSuccess') || 'Tạo dự án thành công!')
      
      // Refresh danh sách projects
      if (onProjectCreated) {
        onProjectCreated()
      } else {
        // Fallback: refresh projects list
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const userId = user?.data?.user?.id || user?.data?.id || user?.id
        if (userId) {
          dispatch(getProjects(`?user_id=${userId}`))
        }
      }
      
      // Reset form và đóng modal
      form.resetFields()
      setSelectedMembers([])
      setMemberRoles({})
      setFileList([])
      setDateRange([null, null])
      setWatchedBudget(0)
      onOk()
      
    } catch (error: any) {
      console.error('Error creating project:', error)
      
      // Handle validation errors
      if (error.errorFields && error.errorFields.length > 0) {
        const firstError = error.errorFields[0]
        message.error(`${firstError.name[0]}: ${firstError.errors[0]}`)
      } else {
        message.error(error?.message || t('createError') || 'Có lỗi xảy ra khi tạo dự án!')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={t('createNew') + ' dự án'}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={t('createNew')}
      cancelText={t('cancel')}
      width={900}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'planning' }}
      >
        <Form.Item
          name="name"
          label={t('projectName')}
          rules={[
            { required: true, message: t('projectName') + ' ' + (t('required') || 'là bắt buộc') },
            { whitespace: true, message: t('projectName') + ' không được để trống' }
          ]}
        >
          <Input placeholder={t('projectName')} />
        </Form.Item>
        <Form.Item name="description" label={t('description')}>
          <Input.TextArea rows={2} placeholder={t('description')} />
        </Form.Item>
        <Form.Item
          name="manager"
          label={t('manager')}
          rules={[{ required: true, message: t('selectManager') || 'Vui lòng chọn quản lý dự án' }]}
        >
          <Select
            placeholder={t('selectManager')}
            options={memberOptions}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            optionLabelProp="label"
          />
        </Form.Item>
        <Form.Item label={t('projectTime')} required>
          <RangePicker
            style={{ width: '100%' }}
            value={dateRange}
            onChange={v => setDateRange(v ? v as [Dayjs, Dayjs] : [null, null])}
            format="DD/MM/YYYY"
          />
        </Form.Item>
        <Form.Item
          name="budget"
          label={t('budget')}
          rules={[
            { required: true, message: t('budget') + ' ' + (t('required') || 'là bắt buộc') },
            { pattern: /^[0-9]+$/, message: 'Ngân sách phải là số' }
          ]}
        >
          <Input 
            type="number" 
            min={0} 
            addonAfter="VNĐ" 
            placeholder={t('budget')} 
            onChange={e => setWatchedBudget(Number(e.target.value))}
          /> 
        </Form.Item>
        <div style={{ margin: '12px 0 0 0', fontWeight: 600, color: '#4B48E5' }}>
          {t('totalSalary')}: {totalSalary.toLocaleString()} VNĐ / tháng<br />
          {t('profit')}: <span style={{ color: profit >= 0 ? '#52c41a' : '#fa3e3e' }}>{profit.toLocaleString()} VNĐ / tháng</span>
        </div>
        <Form.Item name="status" label={t('status')}>
          <Select options={statusOptions} />
        </Form.Item>
        <Form.Item label={t('uploadHint')}>
          <Upload.Dragger
            multiple
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList)}
            onRemove={file => {
              setFileList(prev => prev.filter((f: any) => f.uid !== file.uid))
              return true
            }}
          >
            <p className="ant-upload-drag-icon"><UploadOutlined /></p>
            <p className="ant-upload-text">{t('uploadHint')}</p>
          </Upload.Dragger>
        </Form.Item>
        <Form.Item label={t('selectMembers')}>
          <Select
            mode="multiple"
            placeholder={t('selectMembers')}
            options={memberOptions}
            value={selectedMembers}
            onChange={members => {
              setSelectedMembers(members)
              setMemberRoles(prev => {
                const next: {[key:string]: string} = {}
                members.forEach(m => { next[m] = prev[m] || 'member' })
                return next
              })
            }}
            style={{ width: '100%' }}
          />
          {selectedMembers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {selectedMembers.map(m => {
                const user = users.find(u => u.id === m)
                const salary = user?.employee?.salary || 0
                return (
                  <div
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 8,
                      marginBottom: 10,
                      maxWidth: 520,
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    <span style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user ? `${user.name} (Lương: ${salary.toLocaleString()} VNĐ)` : `User ${m}`}
                    </span>
                    <Select
                      value={memberRoles[m] || 'member'}
                      options={roleOptions}
                      style={{ width: 120, minWidth: 100 }}
                      onChange={role => setMemberRoles(r => ({ ...r, [m]: role }))}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProjectCreateModal 