import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { driveAuditApi, type DriveAuditCreate } from '../api/drive-audit.api'
import { Card, SectionHeader, StatusBadge } from '@shared/components/Card'
import type { DriveAuditStatus, DriveIssueType } from '@shared/types/academy'

const ISSUE_LABEL: Record<DriveIssueType, string> = {
  folder_outside_structure: 'Thư mục ngoài sơ đồ',
  wrong_naming:             'Sai naming',
  wrong_location:           'Sai vị trí',
  file_outside_folder:      'File ngoài folder',
  missing_folder:           'Thiếu folder',
}

const STATUS_LABEL: Record<DriveAuditStatus, { label: string; status: 'ok' | 'pending' | 'error' }> = {
  resolved: { label: 'Đã xử lý',   status: 'ok' },
  pending:  { label: 'Chưa xử lý', status: 'pending' },
  error:    { label: 'Lỗi',        status: 'error' },
}

const initialForm: DriveAuditCreate = {
  team_name: '', issue_description: '', issue_type: 'folder_outside_structure', audit_month: '2025-03',
}

export function DriveAuditPage() {
  const qc = useQueryClient()
  const [month] = useState('2025-03')
  const [openForm, setOpenForm] = useState(false)
  const [form, setForm] = useState<DriveAuditCreate>(initialForm)

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['drive-audit', month],
    queryFn: () => driveAuditApi.list(month),
  })

  const create = useMutation({
    mutationFn: () => driveAuditApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['drive-audit'] })
      toast.success('Đã thêm entry')
      setOpenForm(false); setForm(initialForm)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const resolve = useMutation({
    mutationFn: (id: string) => driveAuditApi.update(id, { status: 'resolved' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['drive-audit'] })
      toast.success('Đã đánh dấu đã xử lý')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div>
      <SectionHeader
        title={`Drive Audit Log — tháng ${month}`}
        sub={`${entries.length} entries`}
        action={
          <button
            onClick={() => setOpenForm(v => !v)}
            className="inline-flex items-center gap-1 bg-[var(--navy)] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:opacity-90"
          >
            <Plus size={12} /> Thêm entry
          </button>
        }
      />

      {openForm && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted)]">
              Team
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.team_name} onChange={e => setForm({ ...form, team_name: e.target.value })}
                placeholder="HR / Admin / Design..." />
            </label>
            <label className="text-xs text-[var(--muted)]">
              Loại vấn đề
              <select className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.issue_type} onChange={e => setForm({ ...form, issue_type: e.target.value as DriveIssueType })}>
                {Object.entries(ISSUE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--muted)] col-span-2">
              Mô tả
              <textarea className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                rows={2} value={form.issue_description}
                onChange={e => setForm({ ...form, issue_description: e.target.value })}
                placeholder="Tối thiểu 10 ký tự" />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setOpenForm(false)} className="px-3 py-1.5 text-xs text-[var(--muted)]">Huỷ</button>
            <button onClick={() => create.mutate()} disabled={create.isPending}
              className="bg-[var(--navy)] text-white px-3 py-1.5 rounded text-xs font-bold disabled:opacity-50">
              {create.isPending ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </Card>
      )}

      <Card>
        {isLoading ? (
          <div className="p-4 text-sm text-[var(--muted)]">Đang tải...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--navy)] text-white">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-bold">Team</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Vấn đề</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Loại</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Trạng thái</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Action</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entries.map(e => {
                const st = STATUS_LABEL[e.status]
                return (
                  <tr key={e.id} className="border-b border-[var(--border)] hover:bg-[var(--navy-l)]/30 align-top">
                    <td className="px-3 py-2 font-bold text-[var(--navy)]">{e.team_name}</td>
                    <td className="px-3 py-2 text-[12px]">{e.issue_description}</td>
                    <td className="px-3 py-2 text-[12px] text-[var(--muted)]">{ISSUE_LABEL[e.issue_type]}</td>
                    <td className="px-3 py-2"><StatusBadge status={st.status}>{st.label}</StatusBadge></td>
                    <td className="px-3 py-2 text-[12px]">{e.action_taken ?? '—'}</td>
                    <td className="px-3 py-2 text-right">
                      {e.status === 'pending' && (
                        <button onClick={() => resolve.mutate(e.id)}
                          className="text-[11px] text-[var(--green)] font-bold hover:underline">
                          Đánh dấu xong
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
