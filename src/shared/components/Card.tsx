import { type ReactNode } from 'react'
import { cn } from '@shared/utils/cn'

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn('bg-white rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.06)]', className)}>
      {children}
    </div>
  )
}

export function SectionHeader({
  icon, title, sub, action,
}: { icon?: ReactNode; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-5">
      {icon && (
        <div className="w-7 h-7 rounded-md bg-[var(--navy-l)] grid place-items-center text-[var(--navy)]">
          {icon}
        </div>
      )}
      <div className="font-extrabold text-sm text-[var(--navy)]">{title}</div>
      {sub && <div className="text-[11px] text-[var(--muted)] ml-auto">{sub}</div>}
      {action && <div className={sub ? '' : 'ml-auto'}>{action}</div>}
    </div>
  )
}

export function StatusBadge({
  status, children,
}: { status: 'ok' | 'warning' | 'critical' | 'pending' | 'error' | 'neutral'; children: ReactNode }) {
  const cls: Record<string, string> = {
    ok:       'bg-[var(--green-l)] text-[var(--green)]',
    warning:  'bg-[var(--gold-l)] text-[#7A4A00]',
    critical: 'bg-[var(--red-l)] text-[var(--red)]',
    pending:  'bg-[var(--gold-l)] text-[#7A4A00]',
    error:    'bg-[var(--red-l)] text-[var(--red)]',
    neutral:  'bg-gray-100 text-[var(--muted)]',
  }
  return (
    <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', cls[status])}>
      {children}
    </span>
  )
}
