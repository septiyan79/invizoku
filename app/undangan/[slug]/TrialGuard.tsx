'use client'

import { useSession } from 'next-auth/react'

function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C9A55A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px] text-neutral-400">Memuat undangan...</p>
      </div>
    </div>
  )
}

function Blocked() {
  return (
    <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-[#EEF0F9] flex items-center justify-center mx-auto mb-5">
          <i className="ti ti-eye-off text-[28px] text-[#4A5FA8]" aria-hidden="true" />
        </div>
        <h1 className="text-[18px] font-medium text-neutral-800 mb-2">
          Undangan dalam mode uji coba
        </h1>
        <p className="text-[13px] text-neutral-500 mb-6 leading-relaxed">
          Undangan ini belum dipublikasikan. Pemilik perlu upgrade ke paket berbayar
          agar bisa disebar ke tamu.
        </p>
        <a
          href="/"
          className="inline-block text-[13px] px-6 py-2.5 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
        >
          Buat undangan sendiri
        </a>
      </div>
    </div>
  )
}

export default function TrialGuard({
  ownerId,
  children,
}: {
  ownerId: string
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') return <Skeleton />
  if (!session?.user?.id || session.user.id !== ownerId) return <Blocked />
  return <>{children}</>
}
