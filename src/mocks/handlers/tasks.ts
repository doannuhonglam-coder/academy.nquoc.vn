import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized, notFound } from '../config'
import { MOCK_TASKS } from '../data/tasks'
import type { AcademyTask, TaskStatus } from '@shared/types/academy'

export const taskHandlers = [
  http.get('*/api/academy/tasks/me', async () => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()
    const tasks = MOCK_TASKS[personId] ?? []
    return HttpResponse.json({ data: tasks })
  }),

  http.patch('*/api/academy/tasks/:id', async ({ params, request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const body = await request.json() as { status?: TaskStatus }
    const tasks = MOCK_TASKS[personId] ?? []
    const idx   = tasks.findIndex(t => t.id === params.id)
    if (idx < 0) return notFound()

    if (tasks[idx].assignee_person_id !== personId) {
      return HttpResponse.json(
        { statusCode: 403, message: 'Not your task', error: 'Forbidden' },
        { status: 403 },
      )
    }

    const now = new Date().toISOString()
    const updated: AcademyTask = {
      ...tasks[idx],
      status: body.status ?? tasks[idx].status,
      completed_at: body.status === 'done' ? now : tasks[idx].completed_at,
      updated_at: now,
    }
    tasks[idx] = updated
    return HttpResponse.json({ data: updated })
  }),
]
