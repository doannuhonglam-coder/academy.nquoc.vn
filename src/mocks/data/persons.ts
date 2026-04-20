import type { AcademyRole } from '@shared/types/academy'

export interface MockPerson {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  roles: AcademyRole[]
  primary_role: AcademyRole
}

export const MOCK_PERSONS: MockPerson[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    email: 'leader-01@academy-dashboard.vn',
    full_name: 'Leader 01',
    roles: ['leader'],
    primary_role: 'leader',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    email: 'co-leader-01@academy-dashboard.vn',
    full_name: 'Co-Leader 01',
    roles: ['co_leader'],
    primary_role: 'co_leader',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    email: 'member-01@academy-dashboard.vn',
    full_name: 'Member 01',
    roles: ['member'],
    primary_role: 'member',
  },
  {
    id: 'd4e5f6a7-b8c9-0123-defa-456789012345',
    email: 'member-02@academy-dashboard.vn',
    full_name: 'Member 02',
    roles: ['member'],
    primary_role: 'member',
  },
  {
    id: 'e5f6a7b8-c9d0-1234-efab-567890123456',
    email: 'member-03@academy-dashboard.vn',
    full_name: 'Member 03',
    roles: ['member'],
    primary_role: 'member',
  },
]
