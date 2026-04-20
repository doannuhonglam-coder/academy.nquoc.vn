import { api } from '@shared/config/api-client'
import type { TrainingLogEntry, TrainingResponseStatus, TrainingLmsStatus } from '@shared/types/academy'

export interface TrainingCreate {
  team_name: string
  training_cycle: string
  response_status: TrainingResponseStatus
  document_name?: string
  lms_upload_status?: TrainingLmsStatus
}

export const trainingLogApi = {
  list:   (cycle?: string) => api.get<TrainingLogEntry[]>(`/academy/training-log-entries${cycle ? `?cycle=${cycle}` : ''}`),
  create: (body: TrainingCreate) => api.post<TrainingLogEntry>('/academy/training-log-entries', body),
}
