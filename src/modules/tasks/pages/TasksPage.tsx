import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Check } from 'lucide-react'
import { tasksApi } from '../api/tasks.api'
import { Card, SectionHeader } from '@shared/components/Card'
import { cn } from '@shared/utils/cn'
import type { AcademyTask, TaskStatus } from '@shared/types/academy'

const PRI_LABEL: Record<string, { label: string; cls: string }> = {
  today:     { label: 'HÔM NAY',  cls: 'bg-[var(--red-l)] text-[var(--red)]' },
  this_week: { label: 'TUẦN NÀY', cls: 'bg-[var(--gold-l)] text-[#7A4A00]' },
  backlog:   { label: 'BACKLOG',  cls: 'bg-gray-100 text-[var(--muted)]' },
}

const CAT_LABEL: Record<string, string> = {
  drive: 'Drive', backup: 'Backup', training: 'Training',
  translate: 'Translate', report: 'Report', other: 'Khác',
}

export function TasksPage() {
  const qc = useQueryClient()
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', 'me'],
    queryFn: tasksApi.listMine,
  })

  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.update(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Đã cập nhật task')
    },
    onError: (e: Error) => toast.error(e.message),
  })

  const todo = tasks.filter(t => t.status !== 'done')
  const done = tasks.filter(t => t.status === 'done')

  const renderTask = (t: AcademyTask) => {
    const pri = t.priority ? PRI_LABEL[t.priority] : undefined
    const isDone = t.status === 'done'
    return (
      <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] last:border-b-0 hover:bg-gray-50">
        <button
          onClick={() => update.mutate({ id: t.id, status: isDone ? 'todo' : 'done' })}
          className={cn(
            'w-5 h-5 rounded-md border-2 grid place-items-center transition flex-shrink-0',
            isDone ? 'bg-[var(--green)] border-[var(--green)] text-white' : 'border-[var(--border)] hover:border-[var(--green)]',
          )}
        >
          {isDone && <Check size={12} strokeWidth={3} />}
        </button>
        <div className={cn('flex-1 text-[13px]', isDone && 'line-through text-[var(--muted)]')}>
          <div>{t.title}</div>
          {t.description && <div className="text-[11px] text-[var(--muted)] mt-0.5">{t.description}</div>}
        </div>
        {pri && !isDone && (
          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-md', pri.cls)}>{pri.label}</span>
        )}
        <span className="text-[10px] text-[var(--muted)] min-w-[70px] text-right">{CAT_LABEL[t.category]}</span>
      </div>
    )
  }

  return (
    <div>
      <SectionHeader title="Việc của tôi" sub={`${todo.length} chưa xong / ${tasks.length} tổng`} />
      <Card>
        {isLoading
          ? <div className="p-4 text-sm text-[var(--muted)]">Đang tải...</div>
          : todo.length === 0
            ? <div className="p-6 text-center text-sm text-[var(--muted)]">Hết việc rồi 🎉</div>
            : todo.map(renderTask)}
      </Card>

      {done.length > 0 && (
        <>
          <SectionHeader title="Đã hoàn thành" sub={`${done.length} task`} />
          <Card>{done.map(renderTask)}</Card>
        </>
      )}
    </div>
  )
}
