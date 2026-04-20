import type { ReactElement } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@modules/auth/pages/LoginPage'
import { AuthCallbackPage } from '@modules/auth/pages/AuthCallbackPage'
import { ProtectedRoute } from '@shared/components/ProtectedRoute'
import { AppLayout } from '@shared/layouts/AppLayout'
import { DashboardPage } from '@modules/kpi/pages/DashboardPage'
import { TasksPage } from '@modules/tasks/pages/TasksPage'
import { DriveAuditPage } from '@modules/drive-audit/pages/DriveAuditPage'
import { AssetRegisterPage } from '@modules/asset-register/pages/AssetRegisterPage'
import { TrainingLogPage } from '@modules/training-log/pages/TrainingLogPage'
import { TranslateLogPage } from '@modules/translate-log/pages/TranslateLogPage'
import { ImprovementItemsPage } from '@modules/improvement-items/pages/ImprovementItemsPage'
import { TeamMembersPage } from '@modules/team-members/pages/TeamMembersPage'

const protect = (node: ReactElement, roles?: ('leader'|'co_leader'|'member')[]) => (
  <ProtectedRoute allowedRoles={roles}>
    <AppLayout>{node}</AppLayout>
  </ProtectedRoute>
)

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth"          element={<LoginPage />} />
      <Route path="/auth-callback" element={<AuthCallbackPage />} />

      <Route path="/"                  element={protect(<DashboardPage />)} />
      <Route path="/tasks"             element={protect(<TasksPage />)} />
      <Route path="/drive-audit"       element={protect(<DriveAuditPage />,       ['leader','co_leader'])} />
      <Route path="/asset-register"    element={protect(<AssetRegisterPage />)} />
      <Route path="/training-log"      element={protect(<TrainingLogPage />,      ['leader','co_leader'])} />
      <Route path="/translate-log"     element={protect(<TranslateLogPage />)} />
      <Route path="/improvement-items" element={protect(<ImprovementItemsPage />, ['leader','co_leader'])} />
      <Route path="/team-members"      element={protect(<TeamMembersPage />,      ['leader','co_leader'])} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
