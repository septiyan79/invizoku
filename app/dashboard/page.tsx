import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const PKG_LABEL: Record<string, string> = {
  trial: 'Uji Coba',
  basic: 'Basic',
  pro: 'Pro',
  studio: 'Studio',
}

const PKG_CHIP: Record<string, string> = {
  trial: 'bg-white/80 text-neutral-500',
  basic: 'bg-white/80 text-[#2D4080]',
  pro: 'bg-white/80 text-[#2D4080]',
  studio: 'bg-[#FDF4E8]/90 text-[#7A5A1A]',
}

const CARD_GRADIENT: Record<string, string> = {
  elegan: 'linear-gradient(135deg,#F7F0E8,#EDE0D0)',
  minimalis: 'linear-gradient(135deg,#EEF2F0,#DDE8E2)',
  'anime-kartun': 'linear-gradient(135deg,#1A1A2E,#2D2B55)',
  islami: 'linear-gradient(135deg,#F0F7F0,#DCF0DC)',
  modern: 'linear-gradient(135deg,#FFF5E8,#FFE8CC)',
  floral: 'linear-gradient(135deg,#FEF0F5,#F8D7E8)',
  'tradisional-adat': 'linear-gradient(135deg,#FDF8F0,#F5E8D0)',
  olahraga: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
}

function ExpiryLine({ expiresAt }: { expiresAt: Date }) {
  const days = Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)
  const isUrgent = days <= 14
  const label = expiresAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return (
    <p className={`text-[11px] font-medium ${isUrgent ? 'text-red-500' : 'text-neutral-400'}`}>
      {isUrgent
        ? `⚠ Expired ${days > 0 ? `dalam ${days} hari` : 'hari ini'}`
        : `Aktif hingga ${label}`}
    </p>
  )
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const orders = await prisma.order.findMany({
    where: {
      user_id: session.user.id,
      status: { in: ['active', 'pending'] },
    },
    select: {
      id: true,
      package: true,
      slug: true,
      status: true,
      expires_at: true,
      theme: {
        select: { name: true, event_categories: true, style_tag: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  const firstName = (session.user.name ?? 'Pengguna').split(' ')[0]

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-[20px] font-medium text-neutral-800 mb-1">
          Halo, {firstName} 👋
        </h1>
        <p className="text-[13px] text-neutral-400">
          {orders.length === 0
            ? 'Belum ada undangan aktif. Yuk pilih tema dan mulai buat undanganmu!'
            : `${orders.length} undangan aktif`}
        </p>
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 p-10 text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF0F9] flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-template text-[26px] text-[#4A5FA8]" aria-hidden="true" />
          </div>
          <p className="text-[14px] font-medium text-neutral-700 mb-1.5">Belum ada undangan</p>
          <p className="text-[12px] text-neutral-400 mb-5 leading-relaxed">
            Pilih tema undangan dan mulai perjalananmu bersama Invizoku.
          </p>
          <Link
            href="/katalog"
            className="inline-block text-[13px] px-5 py-2.5 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
          >
            Jelajahi tema undangan
          </Link>
        </div>
      )}

      {/* Order grid */}
      {orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => {
            const isTrial = order.package === 'trial'
            const isPro = order.package === 'pro' || order.package === 'studio'
            const isStudio = order.package === 'studio'
            const gradient = CARD_GRADIENT[order.theme.style_tag] ?? 'linear-gradient(135deg,#F3F5FB,#E8EAF5)'
            const categories = order.theme.event_categories
              .map((c: string) => c.charAt(0).toUpperCase() + c.slice(1))
              .join(', ')

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border overflow-hidden flex flex-col ${
                  isStudio ? 'border-[#E8C98A]' : 'border-neutral-200'
                }`}
              >
                {/* Visual header */}
                <div
                  className="h-28 relative flex items-start justify-between p-3"
                  style={{ background: gradient }}
                >
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${PKG_CHIP[order.package]}`}>
                    {PKG_LABEL[order.package]}
                  </span>
                  <Link
                    href={`/undangan/${order.slug}`}
                    target="_blank"
                    className="w-7 h-7 rounded-lg bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                    title="Lihat preview"
                  >
                    <i className="ti ti-external-link text-[13px] text-neutral-600" aria-hidden="true" />
                  </Link>
                </div>

                {/* Body */}
                <div className="px-4 pt-3.5 pb-3 flex-1">
                  <p className="text-[14px] font-medium text-neutral-800 leading-snug mb-0.5">
                    {order.theme.name}
                  </p>
                  <p className="text-[11px] text-neutral-400 mb-3">
                    {categories} · {order.theme.style_tag}
                  </p>

                  {isTrial ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1.5 rounded-lg">
                      <i className="ti ti-eye-off text-[12px] shrink-0" aria-hidden="true" />
                      Ada watermark · tidak bisa disebar
                    </div>
                  ) : order.expires_at ? (
                    <ExpiryLine expiresAt={order.expires_at} />
                  ) : null}
                </div>

                {/* Footer actions */}
                <div className="px-4 pb-4">
                  {order.status === 'pending' ? (
                    <div className="flex items-center gap-2 text-[12px] text-amber-600 bg-amber-50 border border-amber-100 px-3 py-2 rounded-xl">
                      <i className="ti ti-clock text-[13px] shrink-0" aria-hidden="true" />
                      Menunggu konfirmasi pembayaran
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/edit/${order.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 text-[12px] py-2 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
                      >
                        <i className="ti ti-edit text-[13px]" aria-hidden="true" />
                        Edit
                      </Link>

                      {isTrial && (
                        <Link
                          href="/harga"
                          className="flex-1 flex items-center justify-center gap-1.5 text-[12px] py-2 rounded-xl border border-[#4A5FA8] text-[#4A5FA8] hover:bg-[#EEF0F9] transition-colors"
                        >
                          <i className="ti ti-rocket text-[13px]" aria-hidden="true" />
                          Upgrade
                        </Link>
                      )}

                      {!isTrial && (
                        <Link
                          href={`/dashboard/tamu/${order.id}`}
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                          title="Kelola Tamu"
                        >
                          <i className="ti ti-users text-[15px]" aria-hidden="true" />
                        </Link>
                      )}

                      {isPro && (
                        <Link
                          href={`/dashboard/bantuan/${order.id}`}
                          className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                          title="Bantuan Admin"
                        >
                          <i className="ti ti-headset text-[15px]" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* Add new card */}
          <Link
            href="/katalog"
            className="rounded-2xl border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 h-52 text-neutral-400 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center">
              <i className="ti ti-plus text-[18px]" aria-hidden="true" />
            </div>
            <p className="text-[12px] font-medium">Buat undangan baru</p>
          </Link>
        </div>
      )}

      {/* Profile quick link */}
      {orders.length > 0 && (
        <div className="mt-6">
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 text-[12px] text-neutral-400 hover:text-[#4A5FA8] transition-colors"
          >
            <i className="ti ti-user text-[13px]" aria-hidden="true" />
            Edit profil & preferensi notifikasi
          </Link>
        </div>
      )}
    </div>
  )
}
