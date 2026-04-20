import { api } from '@shared/config/api-client'
import type { TeamMemberEntry } from '@shared/types/academy'

export const teamMembersApi = {
  list: () => api.get<TeamMemberEntry[]>('/academy/team-members'),
}
