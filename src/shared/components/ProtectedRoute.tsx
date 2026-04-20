import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@modules/auth/stores/auth.store'
import type { AcademyRole } from '@shared/types/academy'

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode
  allowedRoles?: AcademyRole[]
}) {
  const { status, user } = useAuthStore()

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center text-sm text-[var(--muted)]">
        Đang tải...
      </div>
    )
  }
  if (status === 'unauthenticated' || !user) {
    return <Navigate to="/auth" replace />
  }
  if (allowedRoles && !user.roles.some(r => allowedRoles.includes(r))) {
    return (
      <div className="min-h-screen grid place-items-center p-8">
        <div className="bg-white rounded-xl p-8 shadow text-center max-w-md">
          <div className="text-2xl font-extrabold text-[var(--red)] mb-2">403</div>
          <div className="text-sm text-[var(--muted)]">
            Bạn không có quyền xem trang này. Yêu cầu role: {allowedRoles.join(', ')}.
          </div>
        </div>
      </div>
    )
  }
  return <>{children}</>
}
