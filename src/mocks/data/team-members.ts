import { MOCK_PERSONS } from './persons'
import type { TeamMemberEntry } from '@shared/types/academy'

export const MOCK_TEAM_MEMBERS: TeamMemberEntry[] = [
  {
    person_id: MOCK_PERSONS[0].id,
    full_name: 'Leader 01',
    username: '@leader-01',
    avatar_initials: 'L1',
    primary_role: 'leader',
    domain_statuses: [
      { domain: 'drive',     status: 'ok' },
      { domain: 'backup',    status: 'ok' },
      { domain: 'training',  status: 'ok' },
      { domain: 'translate', status: 'ok' },
    ],
  },
  {
    person_id: MOCK_PERSONS[1].id,
    full_name: 'Co-Leader 01',
    username: '@co-leader-01',
    avatar_initials: 'CL',
    primary_role: 'co_leader',
    domain_statuses: [
      { domain: 'drive',     status: 'blocked' },
      { domain: 'backup',    status: 'ok' },
      { domain: 'training',  status: 'ok' },
      { domain: 'translate', status: 'ok' },
    ],
  },
  {
    person_id: MOCK_PERSONS[2].id,
    full_name: 'Member 01',
    username: '@member-01',
    avatar_initials: 'M1',
    primary_role: 'member',
    domain_statuses: [
      { domain: 'drive',     status: 'in_progress' },
      { domain: 'backup',    status: 'ok' },
      { domain: 'training',  status: 'ok' },
      { domain: 'translate', status: 'in_progress' },
    ],
  },
  {
    person_id: MOCK_PERSONS[3].id,
    full_name: 'Member 02',
    username: '@member-02',
    avatar_initials: 'M2',
    primary_role: 'member',
    domain_statuses: [
      { domain: 'drive',     status: 'blocked' },
      { domain: 'backup',    status: 'blocked' },
      { domain: 'training',  status: 'ok' },
      { domain: 'translate', status: 'ok' },
    ],
  },
  {
    person_id: MOCK_PERSONS[4].id,
    full_name: 'Member 03',
    username: '@member-03',
    avatar_initials: 'M3',
    primary_role: 'member',
    domain_statuses: [
      { domain: 'drive',     status: 'ok' },
      { domain: 'backup',    status: 'ok' },
      { domain: 'training',  status: 'ok' },
      { domain: 'translate', status: 'ok' },
    ],
  },
]
