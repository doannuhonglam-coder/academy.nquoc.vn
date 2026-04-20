import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { translateLogApi, type TranslateCreate } from '../api/translate-log.api'
import { useAuthStore } from '@modules/auth/stores/auth.store'
import { Card, SectionHeader, StatusBadge } from '@shared/components/Card'
import type { TranslateLanguage, TranslatePriority, TranslateStatus } from '@shared/types/academy'

const LANG_LABEL: Record<TranslateLanguage, string> = {
  en_to_vi: 'EN → VI', vi_to_en: 'VI → EN', other: 'Khác',
}
const PRI_LABEL: Record<TranslatePriority, { label: string; cls: string }> = {
  normal: { label: 'Normal', cls: 'bg-gray-100 text-[var(--muted)]' },
  high:   { label: 'High',   cls: 'bg-[var(--gold-l)] text-[#7A4A00]' },
  urgent: { label: 'Urgent', cls: 'bg-[var(--red-l)] text-[var(--red)]' },
}
const STATUS_LABEL: Record<TranslateStatus, { label: string; status: 'ok' | 'pending' | 'neutral' }> = {
  done:               { label: 'Hoàn thành', status: 'ok' },
  in_progress:        { label: 'Đang dịch',  status: 'pending' },
  pending_assignment: { label: 'Chưa giao',  status: 'neutral' },
}

const initial: TranslateCreate = {
  requester_name: '', document_name: '', language: 'en_to_vi', priority: 'normal',
  deadline: new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10),
}

export function TranslateLogPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const canManage = user?.roles.some(r => ['leader', 'co_leader'].includes(r)) ?? false

  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<TranslateCreate>(initial)

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['translate-log'],
    queryFn: translateLogApi.list,
  })

  const create = useMutation({
    mutationFn: () => translateLogApi.create({
      ...form,
      deadline: new Date(form.deadline).toISOString(),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['translate-log'] })
      toast.success('Đã tạo yêu cầu dịch')
      setOpen(false); setForm(initial)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TranslateStatus }) =>
      translateLogApi.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['translate-log'] })
      toast.success('Đã cập nhật trạng thái')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div>
      <SectionHeader
        title="Translate Log"
        sub={`${entries.length} requests`}
        action={
          <button onClick={() => setOpen(v => !v)}
            className="inline-flex items-center gap-1 bg-[var(--navy)] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:opacity-90">
            <Plus size={12} /> Tạo request
          </button>
        }
      />

      {open && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-3 gap-3">
            <label className="text-xs text-[var(--muted)]">
              Requester
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.requester_name} onChange={e => setForm({ ...form, requester_name: e.target.value })} />
            </label>
            <label className="text-xs text-[var(--muted)] col-span-2">
              Tài liệu
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.document_name} onChange={e => setForm({ ...form, document_name: e.target.value })} />
            </label>
            <label className="text-xs text-[var(--muted)]">
              Language
              <select className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.language} onChange={e => setForm({ ...form, language: e.target.value as TranslateLanguage })}>
                {Object.entries(LANG_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--muted)]">
              Priority
              <select className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as TranslatePriority })}>
                {Object.entries(PRI_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--muted)]">
              Deadline
              <input type="date" className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
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
                <th className="text-left px-3 py-2 text-xs font-bold">Requester</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Tài liệu</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Lang</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Priority</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Deadline</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => {
                const st = STATUS_LABEL[e.status]
                const pri = PRI_LABEL[e.priority]
                return (
                  <tr key={e.id} className="border-b border-[var(--border)] hover:bg-[var(--navy-l)]/30">
                    <td className="px-3 py-2 font-bold text-[var(--navy)]">{e.requester_name}</td>
                    <td className="px-3 py-2 text-[12px]">{e.document_name}</td>
                    <td className="px-3 py-2 text-[12px]">{LANG_LABEL[e.language]}</td>
                    <td className="px-3 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${pri.cls}`}>{pri.label}</span></td>
                    <td className="px-3 py-2 text-[12px]">{new Date(e.deadline).toLocaleDateString('vi-VN')}</td>
                    <td className="px-3 py-2">
                      {canManage ? (
                        <select value={e.status}
                          onChange={ev => setStatus.mutate({ id: e.id, status: ev.target.value as TranslateStatus })}
                          className="text-[11px] font-bold border border-[var(--border)] rounded px-1.5 py-0.5">
                          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      ) : (
                        <StatusBadge status={st.status}>{st.label}</StatusBadge>
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
