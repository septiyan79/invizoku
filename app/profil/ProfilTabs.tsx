'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/profil', label: 'Profil', icon: 'ti-user' },
  { href: '/profil/keamanan', label: 'Keamanan', icon: 'ti-lock' },
  { href: '/profil/notifikasi', label: 'Notifikasi', icon: 'ti-bell' },
]

export default function ProfilTabs() {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 bg-white rounded-xl border border-neutral-100 p-1 mb-6">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-[#EEF0F9] text-[#4A5FA8] font-medium'
                : 'text-neutral-500 hover:text-[#4A5FA8] hover:bg-[#EEF0F9]'
            }`}
          >
            <i className={`ti ${tab.icon} text-[14px]`} aria-hidden="true" />
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
