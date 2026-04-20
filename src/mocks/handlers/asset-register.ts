import { http, HttpResponse } from 'msw'
import {
  getCurrentMockUserId, getCurrentMockPerson,
  unauthorized, forbidden, notFound,
} from '../config'
import { MOCK_ASSET_REGISTER } from '../data/asset-register'
import type { AssetRegisterEntry } from '@shared/types/academy'

const ASSET_NAME_REGEX = /^\d{4}-\d{2}_[A-Za-z0-9\u00C0-\u024F-]+_[A-Za-z0-9\u00C0-\u024F_-]+_v\d+\..+$/

export const assetRegisterHandlers = [
  http.get('*/api/academy/asset-register-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const url   = new URL(request.url)
    const month = url.searchParams.get('month') ?? '2025-03'
    const page  = Number(url.searchParams.get('page')  ?? '1')
    const limit = Number(url.searchParams.get('limit') ?? '20')

    const filtered = MOCK_ASSET_REGISTER.filter(e => e.backup_date.startsWith(month))
    const paged    = filtered.slice((page - 1) * limit, page * limit)
    return HttpResponse.json({
      data: paged,
      meta: { page, limit, total: filtered.length },
    })
  }),

  http.post('*/api/academy/asset-register-entries', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const body = await request.json() as Partial<AssetRegisterEntry>
    const errors: string[] = []
    if (!body.asset_name) errors.push('asset_name should not be empty')
    if (!body.asset_type) errors.push('asset_type should not be empty')
    if (!body.drive_path) errors.push('drive_path should not be empty')
    if (body.asset_name && !ASSET_NAME_REGEX.test(body.asset_name)) {
      errors.push('asset_name must follow format [YYYY-MM]_[Loại]_[Nội dung]_[Version].[ext]')
    }
    if (errors.length) {
      return HttpResponse.json(
        { statusCode: 400, message: errors, error: 'Bad Request' },
        { status: 400 },
      )
    }

    const now = new Date().toISOString()
    const entry: AssetRegisterEntry = {
      id: crypto.randomUUID(),
      asset_name: body.asset_name!,
      asset_type: body.asset_type!,
      backup_date: now,
      drive_path: body.drive_path!,
      is_name_correct: ASSET_NAME_REGEX.test(body.asset_name!),
      verified_status: body.verified_status ?? 'pending',
      created_by_person_id: personId,
      created_at: now,
      updated_at: now,
    }
    MOCK_ASSET_REGISTER.push(entry)
    return HttpResponse.json({ data: entry }, { status: 201 })
  }),

  http.patch('*/api/academy/asset-register-entries/:id', async ({ params, request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const person = await getCurrentMockPerson()
    const body = await request.json() as Partial<AssetRegisterEntry>
    if (
      body.verified_status === 'verified' &&
      !person?.roles.some(r => ['leader', 'co_leader'].includes(r))
    ) {
      return forbidden('Only leader or co_leader can verify assets')
    }

    const idx = MOCK_ASSET_REGISTER.findIndex(e => e.id === params.id)
    if (idx < 0) return notFound()

    const now = new Date().toISOString()
    MOCK_ASSET_REGISTER[idx] = {
      ...MOCK_ASSET_REGISTER[idx],
      ...(body.verified_status && { verified_status: body.verified_status }),
      ...(body.verified_status === 'verified' && { verified_by_person_id: personId }),
      updated_at: now,
    }
    return HttpResponse.json({ data: MOCK_ASSET_REGISTER[idx] })
  }),
]
