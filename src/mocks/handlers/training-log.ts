import { http, HttpResponse } from 'msw'
import {
  getCurrentMockUserId, getCurrentMockPerson,
  unauthorized, forbidden,
} from '../config'
import { MOCK_TRAINING_LOG } from '../data/training-log'
import type { TrainingLogEntry } from '@shared/types/academy'

const ROLES = ['leader', 'co_leader']

export const trainingLogHandlers = [
  http.get('*/api/academy/training-log-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ROLES.includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const url   = new URL(request.url)
    const cycle = url.searchParams.get('cycle')
    const page  = Number(url.searchParams.get('page')  ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    const filtered = cycle
      ? MOCK_TRAINING_LOG.filter(e => e.training_cycle === cycle)
      : MOCK_TRAINING_LOG
    const paged = filtered.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({
      data: paged,
      meta: { page, limit, total: filtered.length },
    })
  }),

  http.post('*/api/academy/training-log-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ROLES.includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const body = await request.json() as Partial<TrainingLogEntry>
    const errors: string[] = []
    if (!body.team_name)       errors.push('team_name should not be empty')
    if (!body.training_cycle)  errors.push('training_cycle should not be empty')
    if (!body.response_status) errors.push('response_status should not be empty')
    if (errors.length) {
      return HttpResponse.json(
        { statusCode: 400, message: errors, error: 'Bad Request' },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const entry: TrainingLogEntry = {
      id: crypto.randomUUID(),
      team_name: body.team_name!,
      training_cycle: body.training_cycle!,
      response_status: body.response_status!,
      document_name: body.document_name,
      sent_to_it_at: body.response_status === 'has_update' ? now : undefined,
      lms_upload_status: body.lms_upload_status ?? 'na',
      lms_verified: false,
      created_by_person_id: personId,
      created_at: now,
      updated_at: now,
    }
    MOCK_TRAINING_LOG.push(entry)
    return HttpResponse.json({ data: entry }, { status: 201 })
  }),
]
