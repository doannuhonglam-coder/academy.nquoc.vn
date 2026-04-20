import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized, notFound } from '../config'
import {
  MOCK_ALERTS_DEFAULT,
  MOCK_ALERTS_CRITICAL,
  MOCK_ALERTS_DISMISSED,
} from '../data/alerts'
import type { AcademyAlert, AlertStatus } from '@shared/types/academy'

const ALL_ALERTS: AcademyAlert[] = [
  ...MOCK_ALERTS_DEFAULT,
  ...MOCK_ALERTS_CRITICAL,
  ...MOCK_ALERTS_DISMISSED,
]

const PERSON_ALERT_IDS: Record<string, string[]> = {
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890': [
    '7a000000-0000-4000-8000-000000000001',
    '7a000000-0000-4000-8000-000000000002',
  ],
  'b2c3d4e5-f6a7-8901-bcde-f23456789012': [
    '7a000000-0000-4000-8000-000000000003',
    '7a000000-0000-4000-8000-000000000004',
  ],
}

export const alertHandlers = [
  http.get('*/api/academy/alerts', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const url          = new URL(request.url)
    const statusFilter = (url.searchParams.get('status') ?? 'active') as AlertStatus | 'all'

    const ids  = PERSON_ALERT_IDS[personId] ?? []
    let alerts = ALL_ALERTS.filter(a => ids.includes(a.id))
    if (statusFilter !== 'all') {
      alerts = alerts.filter(a => a.status === statusFilter)
    }
    return HttpResponse.json({ data: alerts })
  }),

  http.patch('*/api/academy/alerts/:id', async ({ params, request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const idx = ALL_ALERTS.findIndex(a => a.id === params.id)
    if (idx < 0) return notFound()

    const body = await request.json() as { status: AlertStatus }
    ALL_ALERTS[idx] = {
      ...ALL_ALERTS[idx],
      status: body.status,
      ...(body.status === 'dismissed' && {
        dismissed_at: new Date().toISOString(),
        dismissed_by_person_id: personId,
      }),
    }
    return HttpResponse.json({ data: ALL_ALERTS[idx] })
  }),
]
