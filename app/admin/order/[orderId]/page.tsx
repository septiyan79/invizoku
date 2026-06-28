import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import AssistManager from './AssistManager'

interface PageProps {
  params: Promise<{ orderId: string }>
}

const PKG_LABEL: Record<string, string> = {
  trial: 'Trial', basic: 'Basic', pro: 'Pro', studio: 'Studio',
}
const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', active: 'Aktif', expired: 'Expired',
}
const ASSIST_LABEL: Record<string, string> = {
  idle: 'Idle', waiting_admin: 'Menunggu Admin', in_progress: 'Sedang Dikerjakan',
  waiting_review: 'Menunggu Review User', done: 'Selesai',
}

function formatDate(d: Date | null) {
  if (!d) return '—'
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminOrderPage({ params }: PageProps) {
  const { orderId } = await params

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { id: true, name: true, email: true, phone_wa: true } },
      theme: { select: { name: true } },
      invitation: { select: { published_at: true } },
    },
  })

  if (!order) notFound()

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors mb-5"
      >
        <i className="ti ti-arrow-left text-[13px]" />
        Semua order
      </Link>

      <h1 className="text-[20px] font-semibold text-neutral-800 mb-6">Detail Order</h1>

      <div className="space-y-4">
        {/* Info order */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h2 className="text-[13px] font-semibold text-neutral-700 mb-4 pb-3 border-b border-neutral-100">
            Informasi Order
          </h2>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
            <Row label="ID Order" value={order.id} mono />
            <Row label="Slug" value={order.slug} mono />
            <Row label="Tema" value={order.theme.name} />
            <Row label="Paket" value={PKG_LABEL[order.package]} />
            <Row label="Status" value={STATUS_LABEL[order.status]} />
            <Row label="Expired" value={formatDate(order.expires_at)} />
            <Row label="Dibuat" value={formatDate(order.created_at)} />
            <Row label="Dipublikasi" value={formatDate(order.invitation?.published_at ?? null)} />
          </dl>
        </div>

        {/* Info user */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <h2 className="text-[13px] font-semibold text-neutral-700 mb-4 pb-3 border-b border-neutral-100">
            User
          </h2>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
            <Row label="Nama" value={order.user.name ?? '—'} />
            <Row label="Email" value={order.user.email} />
            <Row label="Nomor WA" value={order.user.phone_wa} />
          </dl>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/admin/users/${order.user.id}`}
              className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
            >
              Lihat profil user
            </Link>
            <a
              href={`https://wa.me/${order.user.phone_wa?.replace(/^0/, '62')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              <i className="ti ti-brand-whatsapp mr-1" />
              Hubungi WA
            </a>
            <a
              href={`/undangan/${order.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-neutral-400 transition-colors"
            >
              <i className="ti ti-external-link mr-1" />
              Lihat undangan
            </a>
          </div>
        </div>

        {/* Terima Beres */}
        {(order.package === 'pro' || order.package === 'studio') && (
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="text-[13px] font-semibold text-neutral-700 mb-1">Terima Beres</h2>
            <p className="text-[12px] text-neutral-400 mb-4">
              Status saat ini: <span className="font-medium text-neutral-600">{ASSIST_LABEL[order.assist_status]}</span>
              {' · '}Revisi terpakai: {order.revision_count}/{order.package === 'studio' ? 3 : 1}
            </p>
            <AssistManager
              orderId={order.id}
              currentStatus={order.assist_status}
              pkg={order.package}
              revisionCount={order.revision_count}
              userPhoneWa={order.user.phone_wa}
              userName={order.user.name}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <>
      <dt className="text-neutral-400">{label}</dt>
      <dd className={`text-neutral-700 ${mono ? 'font-mono text-[11px]' : ''}`}>{value}</dd>
    </>
  )
}
