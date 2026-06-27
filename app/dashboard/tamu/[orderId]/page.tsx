import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { Guest } from '@/hooks/useGuests'
import GuestManager from './GuestManager'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function TamuPage({ params }: PageProps) {
  const { orderId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: {
      theme: { select: { name: true, id: true } },
      guests: { orderBy: { created_at: 'desc' } },
    },
  })

  if (!order) notFound()

  if (order.package === 'trial') {
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
        <div className="max-w-md mt-8 p-8 bg-white rounded-2xl border border-neutral-100 text-center">
          <i className="ti ti-lock text-[36px] text-neutral-200 block mb-4" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-600 mb-2">Fitur Kelola Tamu</p>
          <p className="text-[12px] text-neutral-400 mb-6">
            Manajemen tamu dan link personal undangan tersedia di paket Basic ke atas.
          </p>
          <Link
            href={`/checkout/${order.theme.id}`}
            className="text-[13px] px-5 py-2.5 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
          >
            Upgrade sekarang
          </Link>
        </div>
      </div>
    )
  }

  const initialGuests: Guest[] = order.guests.map((g) => ({
    id: g.id,
    name: g.name,
    token: g.token,
    rsvp_status: g.rsvp_status as Guest['rsvp_status'],
    rsvp_at: g.rsvp_at?.toISOString() ?? null,
    created_at: g.created_at.toISOString(),
  }))

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

      <div className="max-w-2xl">
        <GuestManager orderId={order.id} slug={order.slug} initialGuests={initialGuests} />
      </div>
    </div>
  )
}
