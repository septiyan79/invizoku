import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import DashboardShell from './DashboardShell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/dashboard')

  const orders = await prisma.order.findMany({
    where: {
      user_id: session.user.id,
      status: 'active',
    },
    select: {
      id: true,
      package: true,
      slug: true,
      expires_at: true,
      theme: { select: { name: true } },
    },
    orderBy: { created_at: 'desc' },
  })

  // Primary order: paid first (non-trial), fallback to trial
  const primaryOrder = orders.find((o) => o.package !== 'trial') ?? orders[0] ?? null

  return (
    <DashboardShell
      orders={orders}
      primaryOrder={primaryOrder}
      user={{
        name: session.user.name ?? 'Pengguna',
        email: session.user.email ?? '',
      }}
    >
      {children}
    </DashboardShell>
  )
}
