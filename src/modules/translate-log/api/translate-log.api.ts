import { api } from '@shared/config/api-client'
import type { TranslateLogEntry, TranslateLanguage, TranslatePriority, TranslateStatus } from '@shared/types/academy'

export interface TranslateCreate {
  requester_name: string
  document_name: string
  language: TranslateLanguage
  priority: TranslatePriority
  deadline: string
}

export const translateLogApi = {
  list:   () => api.get<TranslateLogEntry[]>('/academy/translate-log-entries'),
  create: (body: TranslateCreate) => api.post<TranslateLogEntry>('/academy/translate-log-entries', body),
  update: (id: string, body: { status?: TranslateStatus; assignee_person_id?: string }) =>
    api.patch<TranslateLogEntry>(`/academy/translate-log-entries/${id}`, body),
}
