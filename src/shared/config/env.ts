import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL:      z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_API_URL:           z.string().url(),
  VITE_ENABLE_MOCKING:    z.enum(['true', 'false']).default('false'),
  VITE_MOCK_USER_ID:      z.string().uuid().optional(),
})

export const env = envSchema.parse(import.meta.env)
