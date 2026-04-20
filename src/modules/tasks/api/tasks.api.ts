import { api } from '@shared/config/api-client'
import type { AcademyTask, TaskStatus } from '@shared/types/academy'

export const tasksApi = {
  listMine: () => api.get<AcademyTask[]>('/academy/tasks/me'),
  update:   (id: string, body: { status?: TaskStatus }) =>
    api.patch<AcademyTask>(`/academy/tasks/${id}`, body),
}
