import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

export function AuthCallbackPage() {
  const { initialize } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      await initialize()
      navigate('/', { replace: true })
    })()
  }, [initialize, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-[var(--muted)]">
      Đang xác thực...
    </div>
  )
}
