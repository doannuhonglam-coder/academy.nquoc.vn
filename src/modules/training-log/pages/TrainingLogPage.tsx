import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { trainingLogApi, type TrainingCreate } from '../api/training-log.api'
import { Card, SectionHeader, StatusBadge } from '@shared/components/Card'
import type { TrainingResponseStatus, TrainingLmsStatus } from '@shared/types/academy'

const RESP_LABEL: Record<TrainingResponseStatus, { label: string; status: 'ok' | 'pending' | 'neutral' }> = {
  has_update: { label: 'Có update',    status: 'ok' },
  no_update:  { label: 'Không update', status: 'neutral' },
  pending:    { label: 'Chưa phản hồi', status: 'pending' },
}

const LMS_LABEL: Record<TrainingLmsStatus, { label: string; status: 'ok' | 'pending' | 'neutral' }> = {
  uploaded:   { label: 'Đã upload',   status: 'ok' },
  processing: { label: 'Đang xử lý',  status: 'pending' },
  na:         { label: 'N/A',         status: 'neutral' },
}

const initial: TrainingCreate = {
  team_name: '', training_cycle: 'T03-04/2025', response_status: 'pending',
}

export function TrainingLogPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TrainingCreate>(initial)

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['training-log'],
    queryFn: () => trainingLogApi.list(),
  })

  const create = useMutation({
    mutationFn: () => trainingLogApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['training-log'] })
      toast.success('Đã thêm entry')
      setOpen(false); setForm(initial)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div>
      <SectionHeader
        title="Training Log"
        sub={`${entries.length} entries`}
        action={
          <button onClick={() => setOpen(v => !v)}
            className="inline-flex items-center gap-1 bg-[var(--navy)] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:opacity-90">
            <Plus size={12} /> Thêm entry
          </button>
        }
      />

      {open && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs text-[var(--muted)]">
              Team
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.team_name} onChange={e => setForm({ ...form, team_name: e.target.value })} />
            </label>
            <label className="text-xs text-[var(--muted)]">
              Chu kỳ
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.training_cycle} onChange={e => setForm({ ...form, training_cycle: e.target.value })} />
            </label>
            <label className="text-xs text-[var(--muted)]">
              Trạng thái phản hồi
              <select className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.response_status}
                onChange={e => setForm({ ...form, response_status: e.target.value as TrainingResponseStatus })}>
                {Object.entries(RESP_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={() => setOpen(false)} className="px-3 py-1.5 text-xs text-[var(--muted)]">Huỷ</button>
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
                <th className="text-left px-3 py-2 text-xs font-bold">Chu kỳ</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Phản hồi</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Tài liệu</th>
                <th className="text-left px-3 py-2 text-xs font-bold">LMS</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => {
                const resp = RESP_LABEL[e.response_status]
                const lms  = LMS_LABEL[e.lms_upload_status]
                return (
                  <tr key={e.id} className="border-b border-[var(--border)] hover:bg-[var(--navy-l)]/30">
                    <td className="px-3 py-2 font-bold text-[var(--navy)]">{e.team_name}</td>
                    <td className="px-3 py-2 text-[12px]">{e.training_cycle}</td>
                    <td className="px-3 py-2"><StatusBadge status={resp.status}>{resp.label}</StatusBadge></td>
                    <td className="px-3 py-2 text-[12px] font-mono">{e.document_name ?? '—'}</td>
                    <td className="px-3 py-2"><StatusBadge status={lms.status}>{lms.label}</StatusBadge></td>
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
