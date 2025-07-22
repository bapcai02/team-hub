import React from 'react'
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
  memberSalaries: { [key: string]: number }
  setMemberSalaries: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>
  defaultSalaries: { [key: string]: number }
  totalSalary: number
  profit: number
  memberOptions: { value: string, label: string }[]
  roleOptions: { value: string, label: string }[]
  statusOptions: { value: string, label: string }[]
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
  memberSalaries,
  setMemberSalaries,
  defaultSalaries,
  totalSalary,
  profit,
  memberOptions,
  roleOptions,
  statusOptions,
  t,
}) => {
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
            options={selectedMembers.map(m => ({ value: m, label: m }))}
            disabled={selectedMembers.length === 0}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
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
        <Form.Item name="budget" label={t('budget')} rules={[{ required: true, message: t('budget') + ' ' + t('required') }]}> <Input type="number" min={0} addonAfter="VNĐ" placeholder={t('budget')} /> </Form.Item>
        <div style={{ margin: '12px 0 0 0', fontWeight: 600, color: '#4B48E5' }}>
          {t('totalSalary')}: {totalSalary.toLocaleString()} VNĐ<br />
          {t('profit')}: <span style={{ color: profit >= 0 ? '#52c41a' : '#fa3e3e' }}>{profit.toLocaleString()} VNĐ</span>
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
              setMemberSalaries(prev => {
                const next: {[key:string]: number} = {}
                members.forEach(m => {
                  next[m] = prev[m] !== undefined ? prev[m] : (defaultSalaries[m] || 0)
                })
                return next
              })
            }}
            style={{ width: '100%' }}
          />
          {selectedMembers.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {selectedMembers.map(m => (
                <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ minWidth: 120 }}>{m}</span>
                  <Select
                    value={memberRoles[m] || 'member'}
                    options={roleOptions}
                    style={{ width: 140 }}
                    onChange={role => setMemberRoles(r => ({ ...r, [m]: role }))}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder={t('salaryPerMonth')}
                    value={memberSalaries[m] || ''}
                    onChange={e => setMemberSalaries(s => ({ ...s, [m]: Number(e.target.value) }))}
                    style={{ width: 180 }}
                    addonAfter="VNĐ"
                  />
                </div>
              ))}
            </div>
          )}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ProjectCreateModal 