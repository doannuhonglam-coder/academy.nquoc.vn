import { env } from './env'
import { supabase } from './supabase'

export class ApiError extends Error {
  status: number
  code?: string
  details?: unknown
  constructor(status: number, message: string, code?: string, details?: unknown) {
    super(message)
    this.status = status
    this.code = code
    this.details = details
  }
}

const BASE_URL = env.VITE_API_URL.replace(/\/+$/, '') // strip trailing slash

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // attach Supabase JWT (skip if mock-only mode and no session)
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }
  } catch {
    // ignore — mock mode still works without session
  }

  // path normalization: caller passes /auth/me or /academy/...
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${BASE_URL}${normalizedPath}`

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 204) return undefined as T

  const text = await res.text()
  const json = text ? JSON.parse(text) : null

  if (!res.ok) {
    const msg = Array.isArray(json?.message)
      ? json.message.join('; ')
      : (json?.message ?? 'Request failed')
    throw new ApiError(res.status, msg, json?.code, json?.details)
  }

  return (json?.data ?? json) as T
}

export const api = {
  get:    <T>(path: string)             => request<T>('GET',    path),
  post:   <T>(path: string, body?: any) => request<T>('POST',   path, body),
  patch:  <T>(path: string, body?: any) => request<T>('PATCH',  path, body),
  put:    <T>(path: string, body?: any) => request<T>('PUT',    path, body),
  delete: <T>(path: string)             => request<T>('DELETE', path),
}
