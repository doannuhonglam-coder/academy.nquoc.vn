import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { supabase } from '@shared/config/supabase'
import { api } from '@shared/config/api-client'
import type { AuthUser } from '@shared/types/academy'

type Status = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  status: Status
  user: AuthUser | null
  initialize: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    status: 'idle',
    user: null,

    initialize: async () => {
      set((s) => { s.status = 'loading' })
      try {
        if (import.meta.env.VITE_ENABLE_MOCKING === 'true') {
          // Mock mode — fetch /auth/me using mock user id
          const user = await api.get<AuthUser>('/auth/me')
          set((s) => { s.status = 'authenticated'; s.user = user })
          return
        }

        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          set((s) => { s.status = 'unauthenticated'; s.user = null })
          return
        }
        const user = await api.get<AuthUser>('/auth/me')
        set((s) => { s.status = 'authenticated'; s.user = user })
      } catch {
        set((s) => { s.status = 'unauthenticated'; s.user = null })
      }
    },

    loginWithGoogle: async () => {
      if (import.meta.env.VITE_ENABLE_MOCKING === 'true') {
        const user = await api.get<AuthUser>('/auth/me')
        set((s) => { s.status = 'authenticated'; s.user = user })
        return
      }
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth-callback` },
      })
    },

    logout: async () => {
      if (import.meta.env.VITE_ENABLE_MOCKING !== 'true') {
        await supabase.auth.signOut()
      }
      set((s) => { s.status = 'unauthenticated'; s.user = null })
    },
  })),
)
