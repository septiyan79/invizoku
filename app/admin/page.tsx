import { prisma } from '@/lib/prisma'
import OrderTable from './OrderTable'

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: [
      // Studio & Pro yang butuh perhatian didahulukan
      { assist_status: 'asc' },
      { created_at: 'desc' },
    ],
    include: {
      user: { select: { name: true, email: true, phone_wa: true } },
      theme: { select: { name: true } },
    },
  })

  const serialized = orders.map((o) => ({
    id: o.id,
    slug: o.slug,
    package: o.package,
    status: o.status,
    assist_status: o.assist_status,
    expires_at: o.expires_at?.toISOString() ?? null,
    created_at: o.created_at.toISOString(),
    user: o.user,
    theme: o.theme,
  }))

  const stats = {
    total: orders.length,
    active: orders.filter((o) => o.status === 'active').length,
    pending: orders.filter((o) => o.status === 'pending').length,
    needAssist: orders.filter((o) => ['waiting_admin', 'waiting_review'].includes(o.assist_status)).length,
  }

  return (
    <div>
      <h1 className="text-[20px] font-semibold text-neutral-800 mb-6">Order</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total order', value: stats.total },
          { label: 'Aktif', value: stats.active },
          { label: 'Pending bayar', value: stats.pending, warn: stats.pending > 0 },
          { label: 'Perlu dibantu', value: stats.needAssist, warn: stats.needAssist > 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 px-5 py-4">
            <p className="text-[11px] text-neutral-400 mb-1">{s.label}</p>
            <p className={`text-[24px] font-semibold ${s.warn ? 'text-amber-500' : 'text-neutral-800'}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <OrderTable orders={serialized} />
    </div>
  )
}
