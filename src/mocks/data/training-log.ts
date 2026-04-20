import type { TrainingLogEntry } from '@shared/types/academy'
import { MOCK_PERSONS } from './persons'

export const MOCK_TRAINING_LOG: TrainingLogEntry[] = [
  {
    id: '4a000000-0000-4000-8000-000000000001',
    team_name: 'IT',
    training_cycle: 'T01-02/2025',
    response_status: 'has_update',
    document_name: 'SOP_IT_v2.0.docx',
    sent_to_it_at: '2025-01-21T10:00:00.000Z',
    lms_upload_status: 'uploaded',
    lms_verified: true,
    created_by_person_id: MOCK_PERSONS[1].id,
    created_at: '2025-01-21T10:00:00.000Z',
    updated_at: '2025-01-25T09:00:00.000Z',
  },
  {
    id: '4a000000-0000-4000-8000-000000000002',
    team_name: 'Design',
    training_cycle: 'T01-02/2025',
    response_status: 'no_update',
    lms_upload_status: 'na',
    lms_verified: false,
    created_by_person_id: MOCK_PERSONS[1].id,
    created_at: '2025-01-21T10:05:00.000Z',
    updated_at: '2025-01-21T10:05:00.000Z',
  },
  {
    id: '4a000000-0000-4000-8000-000000000003',
    team_name: 'N-EDU',
    training_cycle: 'T01-02/2025',
    response_status: 'has_update',
    document_name: 'Workbook_NEDU_v1.1.docx',
    sent_to_it_at: '2025-01-21T11:00:00.000Z',
    lms_upload_status: 'uploaded',
    lms_verified: true,
    created_by_person_id: MOCK_PERSONS[1].id,
    created_at: '2025-01-21T11:00:00.000Z',
    updated_at: '2025-01-25T09:30:00.000Z',
  },
]
