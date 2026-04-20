import { api } from '@shared/config/api-client'
import type { AcademyAlert } from '@shared/types/academy'

export const alertsApi = {
  list:    (status: 'active' | 'all' = 'active') => api.get<AcademyAlert[]>(`/academy/alerts?status=${status}`),
  dismiss: (id: string) => api.patch<AcademyAlert>(`/academy/alerts/${id}`, { status: 'dismissed' }),
}
