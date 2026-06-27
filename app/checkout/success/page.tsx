import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

interface PageProps {
  searchParams: Promise<{ orderId?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams
  const session = await auth()

  if (!orderId || !session?.user?.id) redirect('/dashboard')

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id },
    include: { theme: true },
  })

  if (!order) redirect('/dashboard')

  const isPaid = order.package !== 'trial'
  const isTrial = order.package === 'trial'

  return (
    <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[#EEF0F9] flex items-center justify-center mx-auto mb-6">
          <i
            className="ti ti-check text-4xl"
            style={{ color: '#4A5FA8' }}
            aria-hidden="true"
          />
        </div>

        {/* Message */}
        <h1 className="text-[22px] font-medium text-neutral-800 mb-2">
          {isPaid ? 'Pembayaran berhasil!' : 'Uji coba aktif!'}
        </h1>
        <p className="text-[13px] text-neutral-500 mb-1">
          {order.theme.name}
        </p>
        {isPaid && order.expires_at && (
          <p className="text-[12px] text-neutral-400 mb-6">
            Aktif hingga{' '}
            {order.expires_at.toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        {isTrial && (
          <p className="text-[12px] text-neutral-400 mb-6">
            Undangan uji coba tidak bisa disebar. Upgrade kapan saja untuk menghilangkan watermark.
          </p>
        )}

        {/* Next step info */}
        <div className="bg-white border border-neutral-100 rounded-xl p-4 text-left mb-6">
          <p className="text-[12px] font-medium text-neutral-600 mb-3 uppercase tracking-wider">
            Langkah berikutnya
          </p>
          <div className="space-y-2.5">
            {[
              { icon: 'ti-edit', text: 'Isi data undangan (nama, tanggal, tempat)' },
              { icon: 'ti-photo', text: 'Upload foto & pilih musik latar' },
              { icon: 'ti-share', text: 'Publish dan bagikan link undangan' },
            ].map((step) => (
              <div key={step.icon} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#EEF0F9] flex items-center justify-center shrink-0">
                  <i className={`ti ${step.icon} text-[13px] text-[#4A5FA8]`} aria-hidden="true" />
                </div>
                <p className="text-[12px] text-neutral-600">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/dashboard"
          className="block w-full py-3 rounded-xl text-[14px] font-medium text-white text-center transition-colors hover:opacity-90"
          style={{ background: '#4A5FA8' }}
        >
          Mulai isi undangan
        </Link>

        <Link
          href="/katalog"
          className="block mt-3 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          Kembali ke katalog
        </Link>
      </div>
    </div>
  )
}
