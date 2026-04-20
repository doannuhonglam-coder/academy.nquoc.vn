import { useQuery } from '@tanstack/react-query'
import { improvementItemsApi } from '../api/improvement-items.api'
import { Card, SectionHeader, StatusBadge } from '@shared/components/Card'
import type { ImprovementDecision, ImprovementItemStatus } from '@shared/types/academy'

const DECISION_LABEL: Record<ImprovementDecision, { label: string; cls: string }> = {
  update:  { label: 'Update',  cls: 'bg-[var(--teal-l)] text-[var(--teal)]' },
  remove:  { label: 'Remove',  cls: 'bg-[var(--red-l)] text-[var(--red)]' },
  archive: { label: 'Archive', cls: 'bg-[var(--purple-l)] text-[var(--purple)]' },
}

const STATUS_LABEL: Record<ImprovementItemStatus, { label: string; status: 'ok' | 'pending' | 'neutral' }> = {
  completed:   { label: 'Hoàn thành', status: 'ok' },
  in_progress: { label: 'Đang làm',   status: 'pending' },
  pending:     { label: 'Chờ',        status: 'neutral' },
}

export function ImprovementItemsPage() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['improvement-items'],
    queryFn: improvementItemsApi.list,
  })

  return (
    <div>
      <SectionHeader title="Improvement Loop" sub={`${items.length} items`} />
      <Card>
        {isLoading ? (
          <div className="p-4 text-sm text-[var(--muted)]">Đang tải...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--navy)] text-white">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-bold">Item</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Lý do (data)</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Quyết định</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Trạng thái</th>
                <th className="text-left px-3 py-2 text-xs font-bold">Kết quả</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => {
                const d = DECISION_LABEL[it.decision]
                const s = STATUS_LABEL[it.status]
                return (
                  <tr key={it.id} className="border-b border-[var(--border)] hover:bg-[var(--navy-l)]/30 align-top">
                    <td className="px-3 py-2 font-bold text-[var(--navy)]">{it.item_name}</td>
                    <td className="px-3 py-2 text-[12px]">{it.reason_with_data}</td>
                    <td className="px-3 py-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${d.cls}`}>{d.label}</span></td>
                    <td className="px-3 py-2"><StatusBadge status={s.status}>{s.label}</StatusBadge></td>
                    <td className="px-3 py-2 text-[12px] text-[var(--muted)]">{it.result ?? '—'}</td>
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
