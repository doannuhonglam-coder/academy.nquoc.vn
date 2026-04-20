import { api } from '@shared/config/api-client'
import type { KpiResponse } from '@shared/types/academy'

export const kpiApi = {
  get: (month?: string) => api.get<KpiResponse>(`/academy/kpi${month ? `?month=${month}` : ''}`),
}
