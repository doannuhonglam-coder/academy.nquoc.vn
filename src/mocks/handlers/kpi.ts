import { http, HttpResponse } from 'msw'
import { getCurrentMockUserId, unauthorized } from '../config'
import {
  MOCK_KPI_MARCH_2025,
  MOCK_KPI_FEBRUARY_2025,
  MOCK_KPI_APRIL_2025,
} from '../data/kpi'

export const kpiHandlers = [
  http.get('*/api/academy/kpi', async ({ request }) => {
    const personId = await getCurrentMockUserId()
    if (!personId) return unauthorized()

    const url   = new URL(request.url)
    const month = url.searchParams.get('month') ?? new Date().toISOString().slice(0, 7)

    const kpiMap: Record<string, typeof MOCK_KPI_MARCH_2025> = {
      '2025-03': MOCK_KPI_MARCH_2025,
      '2025-02': MOCK_KPI_FEBRUARY_2025,
      '2025-04': MOCK_KPI_APRIL_2025,
    }
    const kpi_cards = kpiMap[month] ?? MOCK_KPI_MARCH_2025

    return HttpResponse.json({
      data: { month, kpi_cards, updated_at: new Date().toISOString() },
    })
  }),
]
