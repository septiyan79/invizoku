'use client'

import { useState } from 'react'

interface Props {
  orderId: string
  currentStatus: string
  pkg: string
  revisionCount: number
  userPhoneWa: string
  userName: string | null
}

const TRANSITIONS: Record<string, { label: string; next: string }[]> = {
  idle: [],
  waiting_admin: [{ label: 'Mulai kerjakan', next: 'in_progress' }],
  in_progress: [{ label: 'Selesai dikerjakan', next: 'waiting_review' }],
  waiting_review: [{ label: 'Kerjakan ulang (revisi)', next: 'in_progress' }],
  done: [],
}

export default function AssistManager({ orderId, currentStatus, pkg, revisionCount, userPhoneWa, userName }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const maxRevision = pkg === 'studio' ? 3 : 1
  const transitions = TRANSITIONS[status] ?? []

  async function handleTransition(next: string) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/order/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assist_status: next }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Gagal mengubah status')
        return
      }
      setStatus(next)
    } finally {
      setLoading(false)
    }
  }

  if (transitions.length === 0 && status !== 'done') {
    return <p className="text-[12px] text-neutral-400">Tidak ada aksi yang tersedia untuk status ini.</p>
  }

  if (status === 'done') {
    return (
      <p className="text-[12px] text-green-600 flex items-center gap-1.5">
        <i className="ti ti-circle-check" />
        Pengerjaan selesai. Revisi terpakai: {revisionCount}/{maxRevision}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-[12px] text-red-500">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {transitions.map((t) => (
          <button
            key={t.next}
            onClick={() => handleTransition(t.next)}
            disabled={loading}
            className={`text-[12px] px-4 py-2 rounded-xl transition-colors disabled:opacity-60 ${
              t.next === 'waiting_review'
                ? 'bg-[#4A5FA8] text-white hover:bg-[#2D4080]'
                : 'border border-neutral-200 text-neutral-700 hover:border-[#4A5FA8] hover:text-[#4A5FA8]'
            }`}
          >
            {loading ? 'Menyimpan...' : t.label}
          </button>
        ))}
      </div>

      {status === 'in_progress' && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-[12px] text-amber-700">
          <p className="font-medium mb-1">SLA: selesai dalam 3×24 jam sejak mulai dikerjakan.</p>
          <a
            href={`https://wa.me/${userPhoneWa?.replace(/^0/, '62')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Hubungi {userName ?? 'user'} via WA
          </a>
        </div>
      )}
    </div>
  )
}
