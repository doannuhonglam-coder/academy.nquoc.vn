import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'

export function LoginPage() {
  const { status, loginWithGoogle } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'authenticated') navigate('/', { replace: true })
  }, [status, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--gray)] p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-[var(--teal)] text-white font-black grid place-items-center">A</div>
          <div>
            <div className="text-sm font-extrabold text-[var(--navy)]">Academy Dashboard</div>
            <div className="text-xs text-[var(--muted)]">NhiLe Holding · Academy Team</div>
          </div>
        </div>
        <h1 className="text-xl font-extrabold text-[var(--navy)] mb-2">Đăng nhập nội bộ</h1>
        <p className="text-sm text-[var(--muted)] mb-6">
          Sử dụng tài khoản Google của Academy Team. Hệ thống sẽ tự xác minh role.
        </p>
        <button
          onClick={loginWithGoogle}
          className="w-full bg-[var(--navy)] text-white py-2.5 rounded-lg font-bold text-sm hover:opacity-90 transition"
        >
          Đăng nhập Google
        </button>
        {import.meta.env.VITE_ENABLE_MOCKING === 'true' && (
          <p className="text-xs text-[var(--muted)] mt-4 text-center">
            Mock mode — đổi <code className="bg-gray-100 px-1 rounded">VITE_MOCK_USER_ID</code> trong <code className="bg-gray-100 px-1 rounded">.env.local</code> để test role khác.
          </p>
        )}
      </div>
    </div>
  )
}
