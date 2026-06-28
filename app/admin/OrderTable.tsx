'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  slug: string
  package: string
  status: string
  assist_status: string
  expires_at: string | null
  created_at: string
  user: { name: string | null; email: string; phone_wa: string }
  theme: { name: string }
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending', active: 'Aktif', expired: 'Expired',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  active: 'bg-green-50 text-green-600 border-green-100',
  expired: 'bg-neutral-100 text-neutral-400 border-neutral-200',
}
const ASSIST_LABEL: Record<string, string> = {
  idle: '—', waiting_admin: 'Menunggu', in_progress: 'Dikerjakan',
  waiting_review: 'Review', done: 'Selesai',
}
const ASSIST_COLOR: Record<string, string> = {
  idle: 'text-neutral-300',
  waiting_admin: 'text-amber-500 font-medium',
  in_progress: 'text-blue-500 font-medium',
  waiting_review: 'text-purple-500 font-medium',
  done: 'text-green-500',
}
const PKG_LABEL: Record<string, string> = {
  trial: 'Trial', basic: 'Basic', pro: 'Pro', studio: 'Studio',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function OrderTable({ orders }: { orders: Order[] }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPkg, setFilterPkg] = useState('all')
  const [filterAssist, setFilterAssist] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = orders.filter((o) => {
    if (filterStatus !== 'all' && o.status !== filterStatus) return false
    if (filterPkg !== 'all' && o.package !== filterPkg) return false
    if (filterAssist !== 'all' && o.assist_status !== filterAssist) return false
    if (search) {
      const q = search.toLowerCase()
      if (
        !o.user.name?.toLowerCase().includes(q) &&
        !o.user.email.toLowerCase().includes(q) &&
        !o.slug.toLowerCase().includes(q)
      ) return false
    }
    return true
  })

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari nama / email / slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 text-[13px] border border-neutral-200 rounded-xl focus:outline-none focus:border-[#4A5FA8] bg-white w-64"
        />
        <Select value={filterStatus} onChange={setFilterStatus} options={[
          ['all', 'Semua status'], ['pending', 'Pending'], ['active', 'Aktif'], ['expired', 'Expired'],
        ]} />
        <Select value={filterPkg} onChange={setFilterPkg} options={[
          ['all', 'Semua paket'], ['trial', 'Trial'], ['basic', 'Basic'], ['pro', 'Pro'], ['studio', 'Studio'],
        ]} />
        <Select value={filterAssist} onChange={setFilterAssist} options={[
          ['all', 'Semua assist'], ['idle', 'Idle'], ['waiting_admin', 'Menunggu'],
          ['in_progress', 'Dikerjakan'], ['waiting_review', 'Review'], ['done', 'Selesai'],
        ]} />
      </div>

      <p className="text-[11px] text-neutral-400 mb-3">{filtered.length} order ditampilkan</p>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-[11px] text-neutral-400 uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Tema</th>
              <th className="px-4 py-3 font-medium">Paket</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assist</th>
              <th className="px-4 py-3 font-medium">Expired</th>
              <th className="px-4 py-3 font-medium">Dibuat</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-neutral-400 text-[12px]">
                  Tidak ada order yang sesuai filter
                </td>
              </tr>
            )}
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-neutral-700">{order.user.name ?? '—'}</p>
                  <p className="text-[11px] text-neutral-400">{order.user.email}</p>
                </td>
                <td className="px-4 py-3 text-neutral-600">{order.theme.name}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    order.package === 'studio' ? 'bg-purple-50 text-purple-600' :
                    order.package === 'pro' ? 'bg-blue-50 text-blue-600' :
                    order.package === 'basic' ? 'bg-neutral-100 text-neutral-600' :
                    'bg-neutral-50 text-neutral-400'
                  }`}>
                    {PKG_LABEL[order.package]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_COLOR[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </td>
                <td className={`px-4 py-3 text-[12px] ${ASSIST_COLOR[order.assist_status]}`}>
                  {ASSIST_LABEL[order.assist_status]}
                </td>
                <td className="px-4 py-3 text-neutral-400 text-[12px]">
                  {order.expires_at ? formatDate(order.expires_at) : '—'}
                </td>
                <td className="px-4 py-3 text-neutral-400 text-[12px]">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/order/${order.id}`}
                    className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Select({
  value, onChange, options,
}: {
  value: string
  onChange: (v: string) => void
  options: [string, string][]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 text-[13px] border border-neutral-200 rounded-xl focus:outline-none focus:border-[#4A5FA8] bg-white"
    >
      {options.map(([val, label]) => (
        <option key={val} value={val}>{label}</option>
      ))}
    </select>
  )
}
