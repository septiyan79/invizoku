import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function BantuanPage({ params }: PageProps) {
  const { orderId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id },
    include: { theme: { select: { name: true } } },
  })

  if (!order) notFound()

  if (order.status === 'pending') {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors mb-3"
          >
            <i className="ti ti-arrow-left text-[13px]" aria-hidden="true" />
            Ringkasan
          </Link>
          <h1 className="text-[18px] font-medium text-neutral-800">{order.theme.name}</h1>
        </div>
        <div className="max-w-md p-8 bg-white rounded-2xl border border-neutral-100 text-center">
          <i className="ti ti-clock text-[36px] text-amber-300 block mb-4" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-600 mb-2">Menunggu Konfirmasi Pembayaran</p>
          <p className="text-[12px] text-neutral-400 mb-6 leading-relaxed">
            Fitur bantuan admin akan tersedia setelah pembayaran dikonfirmasi.
          </p>
          <Link
            href="/dashboard"
            className="text-[13px] px-5 py-2.5 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
          >
            Kembali ke ringkasan
          </Link>
        </div>
      </div>
    )
  }

  if (order.status !== 'active') notFound()

  const isPro = order.package === 'pro' || order.package === 'studio'

  if (!isPro) {
    return (
      <div className="px-4 md:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors mb-3"
          >
            <i className="ti ti-arrow-left text-[13px]" aria-hidden="true" />
            Ringkasan
          </Link>
          <h1 className="text-[18px] font-medium text-neutral-800">{order.theme.name}</h1>
        </div>
        <div className="max-w-md p-8 bg-white rounded-2xl border border-neutral-100 text-center">
          <i className="ti ti-lock text-[36px] text-neutral-200 block mb-4" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-600 mb-2">Fitur Terima Beres</p>
          <p className="text-[12px] text-neutral-400 mb-6">
            Bantuan pengerjaan oleh admin tersedia di paket Pro dan Studio.
          </p>
          <Link
            href="/harga"
            className="text-[13px] px-5 py-2.5 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
          >
            Lihat paket
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 py-8">
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

      <div className="max-w-md p-8 bg-white rounded-2xl border border-neutral-100 text-center">
        <i className="ti ti-tools text-[36px] text-neutral-200 block mb-4" aria-hidden="true" />
        <p className="text-[14px] font-medium text-neutral-600 mb-2">Terima Beres</p>
        <p className="text-[12px] text-neutral-400">
          Fitur ini sedang dalam pengembangan. Hubungi admin secara langsung untuk saat ini.
        </p>
      </div>
    </div>
  )
}
