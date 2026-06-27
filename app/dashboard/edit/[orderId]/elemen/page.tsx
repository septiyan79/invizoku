import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function ElemenPage({ params }: PageProps) {
  const { orderId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: {
      theme: { select: { name: true } },
    },
  })

  if (!order) notFound()

  const isTrial = order.package === 'trial'
  const isPro = order.package === 'pro' || order.package === 'studio'

  const galleryLimit = isTrial ? 2 : order.package === 'basic' ? 10 : order.package === 'pro' ? 30 : null

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors mb-3"
        >
          <i className="ti ti-arrow-left text-[13px]" aria-hidden="true" />
          Ringkasan
        </Link>
        <h1 className="text-[18px] font-medium text-neutral-800">{order.theme.name}</h1>
        <p className="text-[12px] text-neutral-400 mt-0.5">
          invizoku.com/undangan/{order.slug}
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 mb-6">
        <Link
          href={`/dashboard/edit/${orderId}`}
          className="text-[13px] px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
        >
          Data Acara
        </Link>
        <span className="text-[13px] px-4 py-2 rounded-xl bg-[#4A5FA8] text-white font-medium">
          Foto & Elemen
        </span>
      </div>

      {/* Content sections */}
      <div className="space-y-4 max-w-2xl">
        {/* Foto Cover */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h3 className="text-[13px] font-semibold text-neutral-700 mb-1">Foto Cover</h3>
          <p className="text-[12px] text-neutral-400 mb-4">
            Foto utama yang tampil di halaman pertama undangan. Semua paket bisa upload 1 foto cover.
          </p>
          <div className="flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
            <p className="text-[12px] text-neutral-400">Upload foto cover — segera hadir</p>
          </div>
        </div>

        {/* Galeri */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[13px] font-semibold text-neutral-700">Galeri Foto</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-medium">
              Maks. {galleryLimit ?? '∞'} foto
            </span>
          </div>
          <p className="text-[12px] text-neutral-400 mb-4">
            {isTrial
              ? 'Uji coba: upload hingga 2 foto untuk melihat tampilan galeri.'
              : `Paket ${order.package}: hingga ${galleryLimit ?? 'tidak terbatas'} foto galeri.`}
          </p>
          <div className="flex items-center justify-center h-32 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
            <p className="text-[12px] text-neutral-400">Upload foto galeri — segera hadir</p>
          </div>
        </div>

        {/* Musik — Basic+ */}
        <div className={`bg-white rounded-2xl border border-neutral-100 p-5 ${!isPro && isTrial ? 'opacity-50' : ''}`}>
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[13px] font-semibold text-neutral-700">Musik Latar</h3>
            {isTrial && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-medium">
                Basic+
              </span>
            )}
          </div>
          <p className="text-[12px] text-neutral-400 mb-4">
            Pilih musik latar dari library kami untuk undangan. Tersedia di paket Basic ke atas.
          </p>
          {isTrial ? (
            <div className="text-center py-4">
              <p className="text-[12px] text-neutral-400 mb-3">Fitur ini tersedia di paket berbayar.</p>
              <Link href="/harga" className="text-[12px] px-4 py-2 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors">
                Lihat paket
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
              <p className="text-[12px] text-neutral-400">Pilih musik — segera hadir</p>
            </div>
          )}
        </div>

        {/* Angpao — Basic+ */}
        <div className={`bg-white rounded-2xl border border-neutral-100 p-5 ${isTrial ? 'opacity-50' : ''}`}>
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[13px] font-semibold text-neutral-700">Angpao Digital</h3>
            {isTrial && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-medium">
                Basic+
              </span>
            )}
          </div>
          <p className="text-[12px] text-neutral-400 mb-4">
            Tambahkan info rekening bank, QRIS, atau alamat pengiriman hadiah.
          </p>
          {isTrial ? (
            <div className="text-center py-4">
              <p className="text-[12px] text-neutral-400 mb-3">Fitur ini tersedia di paket berbayar.</p>
              <Link href="/harga" className="text-[12px] px-4 py-2 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors">
                Lihat paket
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
              <p className="text-[12px] text-neutral-400">Setting angpao — segera hadir</p>
            </div>
          )}
        </div>

        {/* Love Story — Pro+ */}
        {isPro && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h3 className="text-[13px] font-semibold text-neutral-700 mb-1">Love Story</h3>
            <p className="text-[12px] text-neutral-400 mb-4">
              Ceritakan perjalanan cinta dengan foto dan keterangan. Tersedia di paket Pro & Studio.
            </p>
            <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
              <p className="text-[12px] text-neutral-400">Tambah love story — segera hadir</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
