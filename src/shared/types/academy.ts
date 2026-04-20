// src/shared/types/academy.ts
// Field naming: snake_case cho MỌI field. ID: UUID v4. Timestamp: ISO 8601 UTC.

// ─── Core ──────────────────────────────────────────────────────────────────
export type AcademyRole = 'leader' | 'co_leader' | 'member'

export interface AuthUser {
  person_id: string
  email: string
  full_name: string
  avatar_url?: string
  roles: AcademyRole[]
  primary_role: AcademyRole
}

export interface Person {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  roles: AcademyRole[]
  primary_role: AcademyRole
  created_at: string
}

// ─── Academy Task ──────────────────────────────────────────────────────────
export type TaskStatus   = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'today' | 'this_week' | 'backlog'
export type TaskCategory = 'drive' | 'backup' | 'training' | 'translate' | 'report' | 'other'

export interface AcademyTask {
  id: string
  title: string
  description?: string
  assignee_person_id: string
  role_target: AcademyRole
  category: TaskCategory
  status: TaskStatus
  priority?: TaskPriority
  due_date?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

// ─── Drive Audit ───────────────────────────────────────────────────────────
export type DriveIssueType =
  | 'folder_outside_structure'
  | 'wrong_naming'
  | 'wrong_location'
  | 'file_outside_folder'
  | 'missing_folder'

export type DriveAuditStatus = 'resolved' | 'pending' | 'error'

export interface DriveAuditEntry {
  id: string
  team_name: string
  issue_description: string
  issue_type: DriveIssueType
  status: DriveAuditStatus
  action_taken?: string
  created_by_person_id: string
  audit_month: string
  created_at: string
  updated_at: string
}

// ─── Asset Register ────────────────────────────────────────────────────────
export type AssetType =
  | 'video_youtube'
  | 'strategy_document'
  | 'training_document'
  | 'translation'
  | 'other'

export type AssetVerifiedStatus = 'pending' | 'verified' | 'error'

export interface AssetRegisterEntry {
  id: string
  asset_name: string
  asset_type: AssetType
  backup_date: string
  drive_path: string
  is_name_correct: boolean
  verified_status: AssetVerifiedStatus
  verified_by_person_id?: string
  created_by_person_id: string
  created_at: string
  updated_at: string
}

// ─── Training Log ──────────────────────────────────────────────────────────
export type TrainingResponseStatus = 'has_update' | 'no_update' | 'pending'
export type TrainingLmsStatus      = 'na' | 'processing' | 'uploaded'

export interface TrainingLogEntry {
  id: string
  team_name: string
  training_cycle: string
  response_status: TrainingResponseStatus
  document_name?: string
  sent_to_it_at?: string
  lms_upload_status: TrainingLmsStatus
  lms_verified: boolean
  created_by_person_id: string
  created_at: string
  updated_at: string
}

// ─── Translate Log ─────────────────────────────────────────────────────────
export type TranslateLanguage = 'en_to_vi' | 'vi_to_en' | 'other'
export type TranslatePriority = 'normal' | 'high' | 'urgent'
export type TranslateStatus   = 'done' | 'in_progress' | 'pending_assignment'

export interface TranslateLogEntry {
  id: string
  requester_name: string
  document_name: string
  language: TranslateLanguage
  priority: TranslatePriority
  deadline: string
  assignee_person_id?: string
  status: TranslateStatus
  received_at: string
  created_by_person_id: string
  created_at: string
  updated_at: string
}

// ─── Improvement Items ─────────────────────────────────────────────────────
export type ImprovementDecision   = 'update' | 'remove' | 'archive'
export type ImprovementItemStatus = 'pending' | 'in_progress' | 'completed'

export interface ImprovementItem {
  id: string
  item_name: string
  reason_with_data: string
  decision: ImprovementDecision
  status: ImprovementItemStatus
  change_description?: string
  assignee_person_id: string
  due_date: string
  result?: string
  created_by_person_id: string
  created_at: string
  updated_at: string
}

// ─── KPI + Alerts ──────────────────────────────────────────────────────────
export interface KpiCard {
  key: 'asset_health' | 'drive_compliance' | 'training_response' | 'translate_backlog'
  label: string
  value: number
  unit: 'percent' | 'count'
  target: number
  status: 'ok' | 'warning' | 'critical'
}

export interface KpiSnapshot {
  id: string
  month: string
  kpi_cards: KpiCard[]
  computed_at: string
}

export interface KpiResponse {
  month: string
  kpi_cards: KpiCard[]
  updated_at: string
}

export type AlertStatus = 'active' | 'dismissed'

export interface AcademyAlert {
  id: string
  level: 'red' | 'yellow' | 'green'
  message: string
  action_hint: string
  source: 'drive' | 'backup' | 'training' | 'translate'
  status: AlertStatus
  dismissed_at?: string
  dismissed_by_person_id?: string
  created_at: string
}

// ─── Team Members (composite view) ─────────────────────────────────────────
export type DomainStatus = 'ok' | 'in_progress' | 'blocked'
export type Domain       = 'drive' | 'backup' | 'training' | 'translate'

export interface TeamMemberEntry {
  person_id: string
  full_name: string
  username: string
  avatar_initials: string
  primary_role: AcademyRole
  domain_statuses: Array<{ domain: Domain; status: DomainStatus }>
}
