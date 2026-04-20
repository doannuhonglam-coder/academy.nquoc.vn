import { useQuery } from '@tanstack/react-query'
import { teamMembersApi } from '../api/team-members.api'
import { Card, SectionHeader } from '@shared/components/Card'
import type { Domain, DomainStatus } from '@shared/types/academy'

const DOMAIN_LABEL: Record<Domain, string> = {
  drive: 'Drive', backup: 'Backup', training: 'Training', translate: 'Translate',
}

const STATUS_DOT: Record<DomainStatus, string> = {
  ok:          'bg-[var(--green)]',
  in_progress: 'bg-[var(--gold)]',
  blocked:     'bg-[var(--red)]',
}

const ROLE_BADGE: Record<string, string> = {
  leader:    'bg-[var(--purple-l)] text-[var(--purple)]',
  co_leader: 'bg-[var(--blue-l)] text-[var(--blue)]',
  member:    'bg-gray-100 text-[var(--muted)]',
}

export function TeamMembersPage() {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: teamMembersApi.list,
  })

  return (
    <div>
      <SectionHeader title="Team Members" sub={`${members.length} thành viên`} />
      {isLoading ? (
        <Card className="p-4 text-sm text-[var(--muted)]">Đang tải...</Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {members.map(m => (
            <Card key={m.person_id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--navy)] text-white grid place-items-center font-black text-sm">
                  {m.avatar_initials}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-[var(--navy)]">{m.full_name}</div>
                  <div className="text-[11px] text-[var(--muted)]">{m.username}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${ROLE_BADGE[m.primary_role]}`}>
                  {m.primary_role.replace('_', '-')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {m.domain_statuses.map(d => (
                  <div key={d.domain} className="flex items-center gap-2 text-[11px] py-1">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[d.status]}`} />
                    <span className="text-[var(--muted)] flex-1">{DOMAIN_LABEL[d.domain]}</span>
                    <span className="text-[10px] text-[var(--muted)] capitalize">{d.status.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
