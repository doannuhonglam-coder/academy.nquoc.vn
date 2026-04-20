import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Plus, CheckCircle2 } from 'lucide-react'
import { assetRegisterApi, type AssetCreate } from '../api/asset-register.api'
import { useAuthStore } from '@modules/auth/stores/auth.store'
import { Card, SectionHeader, StatusBadge } from '@shared/components/Card'
import type { AssetType } from '@shared/types/academy'

const TYPE_LABEL: Record<AssetType, string> = {
  video_youtube:      'Video YouTube',
  strategy_document:  'Strategy doc',
  training_document:  'Training doc',
  translation:        'Bản dịch',
  other:              'Khác',
}

const initial: AssetCreate = { asset_name: '', asset_type: 'video_youtube', drive_path: '' }

export function AssetRegisterPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const canVerify = user?.roles.some(r => ['leader', 'co_leader'].includes(r)) ?? false

  const [month] = useState('2025-03')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AssetCreate>(initial)

  const { data: assets = [], isLoading } = useQuery({
    queryKey: ['asset-register', month],
    queryFn: () => assetRegisterApi.list(month),
  })

  const create = useMutation({
    mutationFn: () => assetRegisterApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['asset-register'] })
      toast.success('Đã thêm asset')
      setOpen(false); setForm(initial)
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const verify = useMutation({
    mutationFn: (id: string) => assetRegisterApi.update(id, { verified_status: 'verified' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['asset-register'] })
      toast.success('Đã verify')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div>
      <SectionHeader
        title={`Asset Register — tháng ${month}`}
        sub={`${assets.length} assets`}
        action={
          <button onClick={() => setOpen(v => !v)}
            className="inline-flex items-center gap-1 bg-[var(--navy)] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:opacity-90">
            <Plus size={12} /> Thêm asset
          </button>
        }
      />

      {open && (
        <Card className="p-4 mb-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-[var(--muted)] col-span-2">
              Tên file (format: <code className="bg-gray-100 px-1 rounded">[YYYY-MM]_[Loại]_[Nội dung]_v1.ext</code>)
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm font-mono"
                value={form.asset_name} onChange={e => setForm({ ...form, asset_name: e.target.value })}
                placeholder="2025-03_Video_THCB-EP08_v1.mp4" />
            </label>
            <label className="text-xs text-[var(--muted)]">
              Loại
              <select className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.asset_type} onChange={e => setForm({ ...form, asset_type: e.target.value as AssetType })}>
                {Object.entries(TYPE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--muted)]">
              Drive path
              <input className="w-full border border-[var(--border)] rounded px-2 py-1.5 mt-1 text-sm"
                value={form.drive_path} onChange={e => setForm({ ...form, drive_path: e.target.value })}
                placeholder="/Backup/Video/2025-03/THCB" />
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
                <th className="text-left px-3 py-2 text-xs font-bold">Tên file</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Loại</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Drive path</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-[var(--border)] hover:bg-[var(--navy-l)]/30">
                  <td className="px-3 py-2 text-[12px] font-mono">{a.asset_name}</td>
                  <td className="px-3 py-2 text-[12px]">{TYPE_LABEL[a.asset_type]}</td>
                  <td className="px-3 py-2 text-[12px] text-[var(--muted)]">{a.drive_path}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={a.verified_status === 'verified' ? 'ok' : a.verified_status === 'pending' ? 'pending' : 'error'}>
                      {a.verified_status === 'verified' ? 'Đã verify' : a.verified_status === 'pending' ? 'Chờ verify' : 'Lỗi'}
                    </StatusBadge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {canVerify && a.verified_status === 'pending' && (
                      <button onClick={() => verify.mutate(a.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-[var(--green)] font-bold hover:underline">
                        <CheckCircle2 size={12} /> Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  )
}
