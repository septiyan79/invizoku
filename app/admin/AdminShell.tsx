'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Order', icon: 'ti-list-details', exact: true },
  { href: '/admin/tema', label: 'Tema', icon: 'ti-palette' },
  { href: '/admin/users', label: 'User', icon: 'ti-users' },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-neutral-100">
          <p className="text-[13px] font-semibold text-neutral-800">Invizoku</p>
          <p className="text-[11px] text-neutral-400 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] transition-colors ${
                isActive(item.href, item.exact)
                  ? 'bg-[#EEF0F9] text-[#4A5FA8] font-medium'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <i className={`ti ${item.icon} text-[16px]`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-neutral-100">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <i className="ti ti-logout text-[16px]" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 px-8 py-8">{children}</main>
    </div>
  )
}
