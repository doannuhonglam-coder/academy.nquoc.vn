import type { AcademyAlert } from '@shared/types/academy'
import { MOCK_PERSONS } from './persons'

export const MOCK_ALERTS_DEFAULT: AcademyAlert[] = [
  {
    id: '7a000000-0000-4000-8000-000000000001',
    level: 'red',
    message: 'Drive: HR + Admin chưa phản hồi audit sau 5 ngày.',
    action_hint: 'Co-Leader cần escalate lên Leader hôm nay.',
    source: 'drive',
    status: 'active',
    created_at: '2025-03-10T08:00:00.000Z',
  },
  {
    id: '7a000000-0000-4000-8000-000000000002',
    level: 'green',
    message: 'Asset Backup: 100% video tuần này backup trong 24h.',
    action_hint: 'Duy trì tốt — không cần action.',
    source: 'backup',
    status: 'active',
    created_at: '2025-03-10T08:00:00.000Z',
  },
]

export const MOCK_ALERTS_CRITICAL: AcademyAlert[] = [
  {
    id: '7a000000-0000-4000-8000-000000000003',
    level: 'red',
    message: 'Drive: 4 team chưa phản hồi audit. Deadline ngày 10.',
    action_hint: 'Leader cần liên hệ trực tiếp 4 team ngay hôm nay.',
    source: 'drive',
    status: 'active',
    created_at: '2025-04-08T08:00:00.000Z',
  },
  {
    id: '7a000000-0000-4000-8000-000000000004',
    level: 'yellow',
    message: 'Translate: 1 tài liệu đang dịch trễ 2 ngày so với deadline.',
    action_hint: 'Co-Leader cần xác nhận tình trạng với người dịch.',
    source: 'translate',
    status: 'active',
    created_at: '2025-04-08T08:00:00.000Z',
  },
]

export const MOCK_ALERTS_DISMISSED: AcademyAlert[] = [
  {
    id: '7a000000-0000-4000-8000-000000000005',
    level: 'red',
    message: 'Drive: Social chưa phản hồi audit.',
    action_hint: 'Đã xử lý.',
    source: 'drive',
    status: 'dismissed',
    dismissed_at: '2025-03-08T11:00:00.000Z',
    dismissed_by_person_id: MOCK_PERSONS[0].id,
    created_at: '2025-03-07T08:00:00.000Z',
  },
]
