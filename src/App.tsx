import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@shared/config/query-client'
import { AppRoutes } from '@routes/index'
import { useAuthStore } from '@modules/auth/stores/auth.store'

export default function App() {
  const initialize = useAuthStore(s => s.initialize)
  useEffect(() => { initialize() }, [initialize])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
