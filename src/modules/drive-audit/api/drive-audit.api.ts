import { api } from '@shared/config/api-client'
import type { DriveAuditEntry, DriveAuditStatus, DriveIssueType } from '@shared/types/academy'

export interface DriveAuditCreate {
  team_name: string
  issue_description: string
  issue_type: DriveIssueType
  audit_month: string
  action_taken?: string
}

export const driveAuditApi = {
  list:   (month: string) => api.get<DriveAuditEntry[]>(`/academy/drive-audit-entries?month=${month}`),
  create: (body: DriveAuditCreate) => api.post<DriveAuditEntry>('/academy/drive-audit-entries', body),
  update: (id: string, body: { status?: DriveAuditStatus; action_taken?: string }) =>
    api.patch<DriveAuditEntry>(`/academy/drive-audit-entries/${id}`, body),
}
