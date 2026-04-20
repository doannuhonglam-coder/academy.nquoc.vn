import { http, HttpResponse } from 'msw'
import {
  getCurrentMockUserId, getCurrentMockPerson,
  unauthorized, forbidden, notFound,
} from '../config'
import { MOCK_DRIVE_AUDIT } from '../data/drive-audit'
import type { DriveAuditEntry, DriveAuditStatus } from '@shared/types/academy'

const ROLES = ['leader', 'co_leader']

export const driveAuditHandlers = [
  http.get('*/api/academy/drive-audit-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ROLES.includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const url   = new URL(request.url)
    const month = url.searchParams.get('month') ?? '2025-03'
    const page  = Number(url.searchParams.get('page')  ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    const filtered = MOCK_DRIVE_AUDIT.filter(e => e.audit_month === month)
    const paged    = filtered.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({
      data: paged,
      meta: { page, limit, total: filtered.length },
    })
  }),

  http.post('*/api/academy/drive-audit-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ROLES.includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const body = await request.json() as Partial<DriveAuditEntry>
    const errors: string[] = []
    if (!body.team_name)         errors.push('team_name should not be empty')
    if (!body.issue_description) errors.push('issue_description should not be empty')
    if (!body.issue_type)        errors.push('issue_type should not be empty')
    if (!body.audit_month)       errors.push('audit_month should not be empty')
    if (errors.length) {
      return HttpResponse.json(
        { statusCode: 400, message: errors, error: 'Bad Request' },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const entry: DriveAuditEntry = {
      id: crypto.randomUUID(),
      team_name: body.team_name!,
      issue_description: body.issue_description!,
      issue_type: body.issue_type!,
      status: 'pending',
      action_taken: body.action_taken,
      created_by_person_id: personId,
      audit_month: body.audit_month!,
      created_at: now,
      updated_at: now,
    }
    MOCK_DRIVE_AUDIT.push(entry)
    return HttpResponse.json({ data: entry }, { status: 201 })
  }),

  http.patch('*/api/academy/drive-audit-entries/:id', async ({ params, request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    if (!person || !person.roles.some(r => ROLES.includes(r))) {
      return forbidden('Leader or Co-Leader only')
    }

    const idx = MOCK_DRIVE_AUDIT.findIndex(e => e.id === params.id)
    if (idx < 0) return notFound()

    const body = await request.json() as { status?: DriveAuditStatus; action_taken?: string }
    MOCK_DRIVE_AUDIT[idx] = {
      ...MOCK_DRIVE_AUDIT[idx],
      ...(body.status       && { status: body.status }),
      ...(body.action_taken && { action_taken: body.action_taken }),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json({ data: MOCK_DRIVE_AUDIT[idx] })
  }),
]
