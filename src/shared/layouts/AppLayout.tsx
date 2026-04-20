import { type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ListChecks, FolderSearch, Archive,
  GraduationCap, Languages, Lightbulb, Users2, LogOut,
} from 'lucide-react'
import { useAuthStore } from '@modules/auth/stores/auth.store'
import type { AcademyRole } from '@shared/types/academy'
import { cn } from '@shared/utils/cn'

interface NavConfig {
  to: string
  label: string
  icon: typeof LayoutDashboard
  roles?: AcademyRole[]
}

const NAV_OPS: NavConfig[] = [
  { to: '/',                  label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/tasks',             label: 'Việc của tôi',      icon: ListChecks },
]

const NAV_DOMAIN: NavConfig[] = [
  { to: '/drive-audit',       label: 'Drive Audit',       icon: FolderSearch,  roles: ['leader','co_leader'] },
  { to: '/asset-register',    label: 'Asset Register',    icon: Archive },
  { to: '/training-log',      label: 'Training Log',      icon: GraduationCap, roles: ['leader','co_leader'] },
  { to: '/translate-log',     label: 'Translate Log',     icon: Languages },
  { to: '/improvement-items', label: 'Improvement Loop',  icon: Lightbulb,     roles: ['leader','co_leader'] },
  { to: '/team-members',      label: 'Team Members',      icon: Users2,        roles: ['leader','co_leader'] },
]

function NavList({ items, userRoles }: { items: NavConfig[]; userRoles: AcademyRole[] }) {
  return (
    <div className="space-y-0.5">
      {items
        .filter(it => !it.roles || it.roles.some(r => userRoles.includes(r)))
        .map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition',
              isActive ? 'bg-[#1B3A6B] text-white' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-gray-200',
            )}
          >
            <Icon size={14} />
            <span>{label}</span>
          </NavLink>
        ))}
    </div>
  )
}

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const roles: AcademyRole[] = user?.roles ?? []

  const allNav = [...NAV_OPS, ...NAV_DOMAIN]
  const current = allNav.find(n => n.to === location.pathname)

  return (
    <div className="min-h-screen flex bg-[var(--gray)]">
      {/* Sidebar */}
      <aside className="w-60 bg-[var(--dark)] flex flex-col fixed top-0 left-0 h-screen z-40 overflow-y-auto">
        <div className="p-4 border-b border-[#222] flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--teal)] rounded-lg grid place-items-center text-white font-black text-xs">A</div>
          <div className="min-w-0">
            <div className="text-white text-xs font-bold truncate">Academy Dashboard</div>
            <div className="text-[10px] text-gray-500">academy.nquoc.vn</div>
          </div>
        </div>

        {/* User card */}
        <div className="p-3 border-b border-[#222]">
          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wide mb-2 px-1">Đang đăng nhập</div>
          <div className="bg-[#1e2a3a] rounded-lg px-2.5 py-2">
            <div className="text-white text-xs font-bold truncate">{user?.full_name ?? '—'}</div>
            <div className="text-[10px] text-gray-400 capitalize">{user?.primary_role.replace('_', '-')}</div>
          </div>
        </div>

        <div className="p-3 flex-1">
          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wide mb-1.5 px-1">Vận hành</div>
          <NavList items={NAV_OPS} userRoles={roles} />

          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-wide mt-4 mb-1.5 px-1">4 Mảng</div>
          <NavList items={NAV_DOMAIN} userRoles={roles} />
        </div>

        <div className="p-3 border-t border-[#1a1a1a]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs text-gray-400 hover:text-white px-2 py-2 rounded-lg hover:bg-[#1a1a1a] transition"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-60 flex-1 min-h-screen flex flex-col">
        <header className="bg-white border-b border-[var(--border)] h-[52px] px-6 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[var(--muted)]">Academy</span>
            <span className="text-[var(--muted)]">/</span>
            <span className="font-bold text-[var(--navy)]">{current?.label ?? 'Trang'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-[var(--navy-l)] text-[var(--navy)] text-[11px] font-bold px-2.5 py-1 rounded-full">
              {new Date().toLocaleDateString('vi-VN', { weekday: 'long' })}
            </span>
            <span className="text-[var(--muted)] text-xs">{new Date().toLocaleDateString('vi-VN')}</span>
          </div>
        </header>
        <div className="p-6 flex-1">{children}</div>
      </main>
    </div>
  )
}
