import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ userId: string }>
}

const PKG_LABEL: Record<string, string> = {
  trial: 'Trial', basic: 'Basic', pro: 'Pro', studio: 'Studio',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  active: 'bg-green-50 text-green-600 border-green-100',
  expired: 'bg-neutral-100 text-neutral-400 border-neutral-200',
}

export default async function AdminUserDetailPage({ params }: PageProps) {
  const { userId } = await params

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        orderBy: { created_at: 'desc' },
        include: { theme: { select: { name: true } } },
      },
    },
  })

  if (!user) notFound()

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors mb-5"
      >
        <i className="ti ti-arrow-left text-[13px]" />
        Semua user
      </Link>

      <h1 className="text-[20px] font-semibold text-neutral-800 mb-6">{user.name ?? user.email}</h1>

      <div className="space-y-4">
        {/* Profil */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h2 className="text-[13px] font-semibold text-neutral-700 mb-4 pb-3 border-b border-neutral-100">Profil</h2>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
            <dt className="text-neutral-400">ID</dt>
            <dd className="font-mono text-[11px] text-neutral-500">{user.id}</dd>
            <dt className="text-neutral-400">Nama</dt>
            <dd className="text-neutral-700">{user.name ?? '—'}</dd>
            <dt className="text-neutral-400">Email</dt>
            <dd className="text-neutral-700">{user.email}</dd>
            <dt className="text-neutral-400">Nomor WA</dt>
            <dd className="text-neutral-700">{user.phone_wa}</dd>
            <dt className="text-neutral-400">Role</dt>
            <dd className="text-neutral-700">{user.role}</dd>
            <dt className="text-neutral-400">Email verified</dt>
            <dd className={user.email_verified ? 'text-green-600' : 'text-red-400'}>
              {user.email_verified ? 'Ya' : 'Belum'}
            </dd>
            <dt className="text-neutral-400">Bergabung</dt>
            <dd className="text-neutral-700">
              {user.created_at.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </dd>
          </dl>
          <div className="mt-4">
            <a
              href={`https://wa.me/${user.phone_wa?.replace(/^0/, '62')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              <i className="ti ti-brand-whatsapp mr-1" />
              Hubungi WA
            </a>
          </div>
        </div>

        {/* Riwayat order */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h2 className="text-[13px] font-semibold text-neutral-700 mb-4 pb-3 border-b border-neutral-100">
            Riwayat Order ({user.orders.length})
          </h2>
          {user.orders.length === 0 ? (
            <p className="text-[12px] text-neutral-400">Belum ada order.</p>
          ) : (
            <div className="space-y-2">
              {user.orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-neutral-700">{order.theme.name}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {PKG_LABEL[order.package]} ·{' '}
                      {order.created_at.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {order.expires_at && ` · Exp: ${order.expires_at.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_COLOR[order.status]}`}>
                      {order.status}
                    </span>
                    <Link
                      href={`/admin/order/${order.id}`}
                      className="text-[12px] px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
