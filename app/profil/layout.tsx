import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import ProfilTabs from './ProfilTabs'

export default async function ProfilLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/profil')

  return (
    <div className="min-h-screen bg-[#F6F7FB]">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors mb-6"
        >
          <i className="ti ti-arrow-left text-[13px]" aria-hidden="true" />
          Dashboard
        </Link>

        <h1 className="text-[20px] font-medium text-neutral-800 mb-6">Pengaturan Akun</h1>

        <ProfilTabs />

        {children}
      </div>
    </div>
  )
}
