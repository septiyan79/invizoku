import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { InvitationData } from '@/types/invitation'
import InvitationDataEditor from './InvitationDataEditor'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default async function EditPage({ params }: PageProps) {
  const { orderId } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: {
      invitation: { select: { content: true, published_at: true } },
      theme: { select: { name: true, event_categories: true } },
    },
  })

  if (!order || !order.invitation) notFound()

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

      <InvitationDataEditor
        orderId={order.id}
        slug={order.slug}
        pkg={order.package}
        content={order.invitation.content as unknown as InvitationData}
        eventCategories={order.theme.event_categories}
        publishedAt={order.invitation.published_at?.toISOString() ?? null}
      />
    </div>
  )
}
