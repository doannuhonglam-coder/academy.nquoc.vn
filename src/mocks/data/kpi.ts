import type { KpiCard } from '@shared/types/academy'

export const MOCK_KPI_MARCH_2025: KpiCard[] = [
  { key: 'asset_health',      label: 'Asset Backup',       value: 100, unit: 'percent', target: 100, status: 'ok'      },
  { key: 'drive_compliance',  label: 'Drive Compliance',   value: 80,  unit: 'percent', target: 100, status: 'warning' },
  { key: 'training_response', label: 'Training On-time',   value: 90,  unit: 'percent', target: 90,  status: 'ok'      },
  { key: 'translate_backlog', label: 'Translate On-time',  value: 100, unit: 'percent', target: 90,  status: 'ok'      },
]

export const MOCK_KPI_FEBRUARY_2025: KpiCard[] = [
  { key: 'asset_health',      label: 'Asset Backup',       value: 100, unit: 'percent', target: 100, status: 'ok' },
  { key: 'drive_compliance',  label: 'Drive Compliance',   value: 100, unit: 'percent', target: 100, status: 'ok' },
  { key: 'training_response', label: 'Training On-time',   value: 95,  unit: 'percent', target: 90,  status: 'ok' },
  { key: 'translate_backlog', label: 'Translate On-time',  value: 100, unit: 'percent', target: 90,  status: 'ok' },
]

export const MOCK_KPI_APRIL_2025: KpiCard[] = [
  { key: 'asset_health',      label: 'Asset Backup',       value: 100, unit: 'percent', target: 100, status: 'ok'       },
  { key: 'drive_compliance',  label: 'Drive Compliance',   value: 60,  unit: 'percent', target: 100, status: 'critical' },
  { key: 'training_response', label: 'Training On-time',   value: 0,   unit: 'percent', target: 90,  status: 'warning'  },
  { key: 'translate_backlog', label: 'Translate On-time',  value: 100, unit: 'percent', target: 90,  status: 'ok'       },
]
