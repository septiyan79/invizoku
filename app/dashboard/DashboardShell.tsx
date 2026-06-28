'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

interface Order {
  id: string
  package: string
  slug: string
  expires_at: Date | null
  theme: { name: string }
}

interface Props {
  orders: Order[]
  primaryOrder: Order | null
  user: { name: string; email: string }
  children: React.ReactNode
}

const PKG_LABEL: Record<string, string> = {
  trial: 'Uji Coba',
  basic: 'Basic',
  pro: 'Pro',
  studio: 'Studio',
}

const PKG_CHIP: Record<string, string> = {
  trial: 'bg-neutral-100 text-neutral-500',
  basic: 'bg-[#EEF0F9] text-[#4A5FA8]',
  pro: 'bg-[#EEF0F9] text-[#4A5FA8]',
  studio: 'bg-[#FDF4E8] text-[#7A5A1A]',
}

function NavLink({
  href,
  icon,
  label,
  active,
  onClick,
}: {
  href: string
  icon: string
  label: string
  active: boolean
  onClick?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
        active
          ? 'bg-[#EEF0F9] text-[#4A5FA8] font-medium'
          : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
      }`}
    >
      <i className={`ti ${icon} text-[15px] shrink-0`} aria-hidden="true" />
      {label}
    </Link>
  )
}

export default function DashboardShell({ orders, primaryOrder, user, children }: Props) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const orderId = primaryOrder?.id ?? ''
  const isTrial = primaryOrder?.package === 'trial'
  const isPro = primaryOrder?.package === 'pro' || primaryOrder?.package === 'studio'

  const navItems = [
    { href: '/dashboard', label: 'Ringkasan', icon: 'ti-layout-dashboard' },
    ...(orderId
      ? [{ href: `/dashboard/edit/${orderId}`, label: 'Edit Undangan', icon: 'ti-edit' }]
      : []),
    ...(orderId && !isTrial
      ? [{ href: `/dashboard/tamu/${orderId}`, label: 'Kelola Tamu', icon: 'ti-users' }]
      : []),
    ...(orderId && isPro
      ? [{ href: `/dashboard/bantuan/${orderId}`, label: 'Bantuan Admin', icon: 'ti-headset' }]
      : []),
    { href: '/profil', label: 'Pengaturan', icon: 'ti-settings' },
  ]

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/profil') return pathname.startsWith('/profil')
    const section = href.split('/').slice(0, 3).join('/')
    return pathname.startsWith(section)
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const expiryLabel = primaryOrder?.expires_at
    ? (() => {
        const days = Math.ceil((primaryOrder.expires_at.getTime() - Date.now()) / 86_400_000)
        return days > 14
          ? primaryOrder.expires_at.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : days > 0
          ? `${days} hari lagi`
          : 'Segera expired'
      })()
    : 'Tanpa batas'

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 h-14 flex items-center shrink-0 border-b border-neutral-100">
        <Link href="/dashboard" className="text-[15px] font-medium text-neutral-800">
          inviz<span className="text-[#4A5FA8]">oku</span>
          <span className="text-[#C9A55A]">.</span>
        </Link>
      </div>

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Order info card */}
        {primaryOrder && (
          <div className="mb-4 px-1">
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">
              Undangan aktif
            </p>
            <div className="bg-neutral-50 rounded-xl px-3 py-2.5 border border-neutral-100">
              <p className="text-[12px] font-medium text-neutral-700 truncate">
                {primaryOrder.theme.name}
              </p>
              <div className="flex items-center justify-between mt-1.5 gap-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    PKG_CHIP[primaryOrder.package]
                  }`}
                >
                  {PKG_LABEL[primaryOrder.package]}
                </span>
                <span className="text-[10px] text-neutral-400 truncate text-right">
                  {expiryLabel}
                </span>
              </div>
            </div>

            {/* Multiple orders indicator */}
            {orders.length > 1 && (
              <p className="text-[10px] text-neutral-400 mt-1.5 px-1">
                +{orders.length - 1} undangan lain →{' '}
                <Link href="/dashboard" className="text-[#4A5FA8] hover:underline" onClick={() => setOpen(false)}>
                  Ringkasan
                </Link>
              </p>
            )}
          </div>
        )}

        {/* Nav links */}
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
            onClick={() => setOpen(false)}
          />
        ))}

        {/* Upgrade CTA */}
        {primaryOrder && (isTrial || primaryOrder.package === 'basic') && (
          <div className="pt-4 mt-2 border-t border-neutral-100">
            <Link
              href="/harga"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-[12px] px-3 py-2 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
            >
              <i className="ti ti-rocket text-[13px]" aria-hidden="true" />
              {isTrial ? 'Upgrade sekarang' : 'Upgrade ke Pro/Studio'}
            </Link>
          </div>
        )}
      </div>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-neutral-100 shrink-0">
        <Link
          href="/profil"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 mb-2.5 px-1 py-1.5 rounded-xl hover:bg-neutral-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[#EEF0F9] flex items-center justify-center shrink-0 group-hover:bg-[#DDE1F5] transition-colors">
            <span className="text-[11px] font-semibold text-[#4A5FA8]">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-medium text-neutral-700 truncate">{user.name}</p>
            <p className="text-[10px] text-neutral-400 truncate">{user.email}</p>
          </div>
          <i className="ti ti-chevron-right text-[12px] text-neutral-300 group-hover:text-neutral-400 shrink-0" aria-hidden="true" />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <i className="ti ti-logout text-[14px]" aria-hidden="true" />
          Keluar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-100 z-40 flex items-center justify-between px-4">
        <button
          onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition-colors"
          aria-label="Buka menu"
        >
          <i className="ti ti-menu-2 text-[18px] text-neutral-600" aria-hidden="true" />
        </button>
        <span className="text-[15px] font-medium text-neutral-800">
          inviz<span className="text-[#4A5FA8]">oku</span>
          <span className="text-[#C9A55A]">.</span>
        </span>
        <Link
          href="/profil"
          className="w-9 h-9 rounded-full bg-[#EEF0F9] flex items-center justify-center hover:bg-[#DDE1F5] transition-colors"
          aria-label="Pengaturan akun"
        >
          <span className="text-[11px] font-semibold text-[#4A5FA8]">{initials}</span>
        </Link>
      </header>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-white border-r border-neutral-100 z-50 transition-transform duration-200 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <main className="md:ml-56 pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
