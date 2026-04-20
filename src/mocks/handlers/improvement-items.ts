import { http, HttpResponse } from 'msw'
import {
  getCurrentMockUserId, getCurrentMockPerson,
  unauthorized, forbidden, notFound,
} from '../config'
import { MOCK_IMPROVEMENT_ITEMS } from '../data/improvement-items'
import type { ImprovementItem, ImprovementItemStatus } from '@shared/types/academy'

const VIEW_ROLES   = ['leader', 'co_leader']
const CREATE_ROLES = ['leader']

export const improvementItemHandlers = [
  http.get('*/api/academy/improvement-items', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => VIEW_ROLES.includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const url   = new URL(request.url)
    const month = url.searchParams.get('month')
    const page  = Number(url.searchParams.get('page')  ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    const filtered = month
      ? MOCK_IMPROVEMENT_ITEMS.filter(e => e.due_date.startsWith(month))
      : MOCK_IMPROVEMENT_ITEMS
    const paged = filtered.slice((page - 1) * limit, page * limit)

    return HttpResponse.json({
      data: paged,
      meta: { page, limit, total: filtered.length },
    })
  }),

  http.post('*/api/academy/improvement-items', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => CREATE_ROLES.includes(r))) {
      return forbidden('Leader only')
    }

    const body = await request.json() as Partial<ImprovementItem>
    const errors: string[] = []
    if (!body.item_name)          errors.push('item_name should not be empty')
    if (!body.reason_with_data)   errors.push('reason_with_data should not be empty')
    if (!body.decision)           errors.push('decision should not be empty')
    if (!body.assignee_person_id) errors.push('assignee_person_id should not be empty')
    if (!body.due_date)           errors.push('due_date should not be empty')
    if (errors.length) {
      return HttpResponse.json(
        { statusCode: 400, message: errors, error: 'Bad Request' },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const item: ImprovementItem = {
      id: crypto.randomUUID(),
      item_name: body.item_name!,
      reason_with_data: body.reason_with_data!,
      decision: body.decision!,
      status: 'pending',
      change_description: body.change_description,
      assignee_person_id: body.assignee_person_id!,
      due_date: body.due_date!,
      result: body.result,
      created_by_person_id: personId,
      created_at: now,
      updated_at: now,
    }
    MOCK_IMPROVEMENT_ITEMS.push(item)
    return HttpResponse.json({ data: item }, { status: 201 })
  }),

  http.patch('*/api/academy/improvement-items/:id', async ({ params, request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => CREATE_ROLES.includes(r))) {
      return forbidden('Leader only')
    }

    const idx = MOCK_IMPROVEMENT_ITEMS.findIndex(e => e.id === params.id)
    if (idx < 0) return notFound()

    const body = await request.json() as {
      status?: ImprovementItemStatus
      result?: string
      change_description?: string
    }
    MOCK_IMPROVEMENT_ITEMS[idx] = {
      ...MOCK_IMPROVEMENT_ITEMS[idx],
      ...(body.status             && { status: body.status }),
      ...(body.result             && { result: body.result }),
      ...(body.change_description && { change_description: body.change_description }),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json({ data: MOCK_IMPROVEMENT_ITEMS[idx] })
  }),
]
