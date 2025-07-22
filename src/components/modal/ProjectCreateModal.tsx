import React, { useState } from 'react'
import { Modal, Form, Input, DatePicker, Select, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'

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
}) => {
  const [watchedBudget, setWatchedBudget] = useState<number>(0)

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

  return (
    <Modal
      title={t('createNew') + ' dự án'}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      okText={t('createNew')}
      cancelText={t('cancel')}
      width={900}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'planning' }}
      >
        <Form.Item name="name" label={t('projectName')} rules={[{ required: true, message: t('projectName') + ' ' + t('required') }]}> <Input placeholder={t('projectName')} /> </Form.Item>
        <Form.Item name="description" label={t('description')}> <Input.TextArea rows={2} placeholder={t('description')} /> </Form.Item>
        <Form.Item name="manager" label={t('manager')} rules={[{ required: true, message: t('selectManager') }]}> 
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
        <Form.Item name="budget" label={t('budget')} rules={[{ required: true, message: t('budget') + ' ' + t('required') }]}> 
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
                      {user ? `${user.name} (Lương: ${salary.toLocaleString()} VNĐ)` : m}
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