import { api } from '@shared/config/api-client'
import type { ImprovementItem, ImprovementDecision, ImprovementItemStatus } from '@shared/types/academy'

export interface ImprovementCreate {
  item_name: string
  reason_with_data: string
  decision: ImprovementDecision
  assignee_person_id: string
  due_date: string
  change_description?: string
  result?: string
}

export const improvementItemsApi = {
  list:   () => api.get<ImprovementItem[]>('/academy/improvement-items'),
  create: (body: ImprovementCreate) => api.post<ImprovementItem>('/academy/improvement-items', body),
  update: (id: string, body: { status?: ImprovementItemStatus; result?: string; change_description?: string }) =>
    api.patch<ImprovementItem>(`/academy/improvement-items/${id}`, body),
}
