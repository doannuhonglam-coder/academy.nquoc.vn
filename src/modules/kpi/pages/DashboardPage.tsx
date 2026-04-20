import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react'
import { useAuthStore } from '@modules/auth/stores/auth.store'
import { kpiApi } from '../api/kpi.api'
import { alertsApi } from '@modules/alerts/api/alerts.api'
import { Card, SectionHeader, StatusBadge } from '@shared/components/Card'
import type { KpiCard as KpiCardType, AcademyAlert } from '@shared/types/academy'

const ALERT_STYLE: Record<AcademyAlert['level'], { wrap: string; icon: typeof AlertCircle }> = {
  red:    { wrap: 'bg-[var(--red-l)] text-[var(--red)] border-l-4 border-[var(--red)]',    icon: AlertCircle },
  yellow: { wrap: 'bg-[var(--gold-l)] text-[#7A4A00] border-l-4 border-[var(--gold)]',     icon: AlertTriangle },
  green:  { wrap: 'bg-[var(--green-l)] text-[var(--green)] border-l-4 border-[var(--green)]', icon: CheckCircle2 },
}

function KpiCardView({ k }: { k: KpiCardType }) {
  const colorMap = { ok: 'var(--green)', warning: 'var(--gold)', critical: 'var(--red)' } as const
  const color = colorMap[k.status]
  return (
    <Card className="p-4 relative border-t-[3px]" >
      <div style={{ height: 3, background: color, marginTop: -16, marginLeft: -16, marginRight: -16, marginBottom: 12, borderRadius: '12px 12px 0 0' }} />
      <StatusBadge status={k.status === 'critical' ? 'critical' : k.status === 'warning' ? 'warning' : 'ok'}>
        {k.status === 'ok' ? 'OK' : k.status === 'warning' ? '⚠' : '✕'}
      </StatusBadge>
      <div className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wide">{k.label}</div>
      <div className="text-3xl font-black my-1 leading-none" style={{ color }}>
        {k.value}{k.unit === 'percent' ? '%' : ''}
      </div>
      <div className="text-[10px] text-[var(--muted)]">Mục tiêu: {k.target}{k.unit === 'percent' ? '%' : ''}</div>
      <div className="h-[3px] bg-gray-200 rounded mt-2 overflow-hidden">
        <div className="h-full rounded transition-[width] duration-700" style={{ background: color, width: `${Math.min(100, (k.value / k.target) * 100)}%` }} />
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const qc = useQueryClient()

  const { data: kpi, isLoading } = useQuery({
    queryKey: ['kpi', '2025-03'],
    queryFn: () => kpiApi.get('2025-03'),
  })

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts', 'active'],
    queryFn: () => alertsApi.list('active'),
  })

  const dismissAlert = useMutation({
    mutationFn: (id: string) => alertsApi.dismiss(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alerts'] })
      toast.success('Đã ẩn alert')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  return (
    <div>
      {/* Hero */}
      <div className="rounded-2xl p-6 mb-5 text-white" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #2A4F8A 55%, var(--teal) 100%)' }}>
        <div className="grid grid-cols-[1fr_auto] gap-5 items-center">
          <div>
            <div className="text-white/65 text-xs">Xin chào,</div>
            <div className="text-xl font-extrabold">{user?.full_name}</div>
            <div className="text-white/75 text-xs mt-1">
              Vai trò: <span className="capitalize font-bold">{user?.primary_role.replace('_', '-')}</span> · Tháng vận hành: 03/2025
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {['Drive Audit', 'Asset Backup', 'Training', 'Translate'].map(t => (
                <span key={t} className="bg-white/15 border border-white/20 rounded-full px-3 py-0.5 text-[11px]">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/12 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <div className="text-2xl font-black leading-none">{alerts.length}</div>
              <div className="text-[10px] text-white/70 mt-1">Alerts</div>
            </div>
            <div className="bg-white/12 border border-white/15 rounded-xl px-4 py-3 text-center min-w-[80px]">
              <div className="text-2xl font-black leading-none">{kpi?.kpi_cards.filter(c => c.status === 'ok').length ?? 0}/4</div>
              <div className="text-[10px] text-white/70 mt-1">KPI OK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-5 space-y-2">
          {alerts.map(a => {
            const S = ALERT_STYLE[a.level]
            return (
              <div key={a.id} className={`rounded-xl p-3 flex items-start gap-3 text-[13px] ${S.wrap}`}>
                <S.icon size={18} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold">{a.message}</div>
                  <div className="text-[12px] opacity-90 mt-0.5">→ {a.action_hint}</div>
                </div>
                <button
                  onClick={() => dismissAlert.mutate(a.id)}
                  className="text-current opacity-60 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      <SectionHeader title="KPI tổng hợp — tháng 03/2025" sub={kpi?.updated_at ? `Cập nhật: ${new Date(kpi.updated_at).toLocaleString('vi-VN')}` : ''} />
      <div className="grid grid-cols-4 gap-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Card key={i} className="p-4 h-28 animate-pulse"><div /></Card>)
          : kpi?.kpi_cards.map(c => <KpiCardView key={c.key} k={c} />)}
      </div>
    </div>
  )
}
