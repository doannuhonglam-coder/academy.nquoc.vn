import { http, HttpResponse } from 'msw'
import {
  getCurrentMockUserId, getCurrentMockPerson,
  unauthorized, forbidden, notFound,
} from '../config'
import { MOCK_TRANSLATE_LOG } from '../data/translate-log'
import type { TranslateLogEntry, TranslateStatus } from '@shared/types/academy'

export const translateLogHandlers = [
  http.get('*/api/academy/translate-log-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const url    = new URL(request.url)
    const status = url.searchParams.get('status') as TranslateStatus | null
    const page   = Number(url.searchParams.get('page')  ?? '1')
    const limit  = Number(url.searchParams.get('limit') ?? '20')

    const filtered = status
      ? MOCK_TRANSLATE_LOG.filter(e => e.status === status)
      : MOCK_TRANSLATE_LOG
    const paged = filtered.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({
      data: paged,
      meta: { page, limit, total: filtered.length },
    })
  }),

  http.post('*/api/academy/translate-log-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const body = await request.json() as Partial<TranslateLogEntry>
    const errors: string[] = []
    if (!body.requester_name) errors.push('requester_name should not be empty')
    if (!body.document_name)  errors.push('document_name should not be empty')
    if (!body.language)       errors.push('language should not be empty')
    if (!body.priority)       errors.push('priority should not be empty')
    if (!body.deadline)       errors.push('deadline should not be empty')
    if (errors.length) {
      return HttpResponse.json(
        { statusCode: 400, message: errors, error: 'Bad Request' },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const entry: TranslateLogEntry = {
      id: crypto.randomUUID(),
      requester_name: body.requester_name!,
      document_name: body.document_name!,
      language: body.language!,
      priority: body.priority!,
      deadline: body.deadline!,
      status: 'pending_assignment',
      received_at: now,
      created_by_person_id: personId,
      created_at: now,
      updated_at: now,
    }
    MOCK_TRANSLATE_LOG.push(entry)
    return HttpResponse.json({ data: entry }, { status: 201 })
  }),

  http.patch('*/api/academy/translate-log-entries/:id', async ({ params, request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ['leader', 'co_leader'].includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const idx = MOCK_TRANSLATE_LOG.findIndex(e => e.id === params.id)
    if (idx < 0) return notFound()

    const body = await request.json() as {
      status?: TranslateStatus
      assignee_person_id?: string
    }
    MOCK_TRANSLATE_LOG[idx] = {
      ...MOCK_TRANSLATE_LOG[idx],
      ...(body.status             && { status: body.status }),
      ...(body.assignee_person_id && { assignee_person_id: body.assignee_person_id }),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json({ data: MOCK_TRANSLATE_LOG[idx] })
  }),
]
