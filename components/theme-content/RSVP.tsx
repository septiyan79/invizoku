'use client'

import { useState } from 'react'

interface RSVPProps {
  orderId: string
  guestToken?: string
  guestName?: string
  accentColor?: string
  className?: string
}

export default function RSVP({ orderId, guestToken, guestName, accentColor = '#4A5FA8', className = '' }: RSVPProps) {
  const [status, setStatus] = useState<'hadir' | 'tidak' | ''>('')
  const [name, setName] = useState(guestName ?? '')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!name.trim() || !status) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, token: guestToken, name: name.trim(), status, notes }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Gagal mengirim')
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="text-3xl mb-3">{status === 'hadir' ? '🎉' : '🙏'}</div>
        <p className="font-medium text-neutral-800">
          {status === 'hadir' ? 'Terima kasih, kami tunggu kehadiranmu!' : 'Terima kasih atas responnya.'}
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-1.5">
          Nama
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          className="w-full text-[14px] px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-400"
          readOnly={!!guestToken && !!guestName}
        />
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-2">
          Kehadiran
        </label>
        <div className="flex gap-3">
          {(['hadir', 'tidak'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] border transition-all ${
                status === s
                  ? 'border-transparent text-white font-medium'
                  : 'border-neutral-200 text-neutral-500 bg-white'
              }`}
              style={status === s ? { background: accentColor } : {}}
            >
              {s === 'hadir' ? '✓ Hadir' : '✗ Tidak hadir'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-widest text-neutral-400 mb-1.5">
          Catatan (opsional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ucapan, jumlah tamu, dll."
          rows={3}
          className="w-full text-[13px] px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-400 resize-none"
        />
      </div>

      {error && <p className="text-[12px] text-red-500">{error}</p>}

      <button
        onClick={submit}
        disabled={!name.trim() || !status || loading}
        className="w-full py-3 rounded-xl text-[13px] font-medium text-white transition-opacity disabled:opacity-40"
        style={{ background: accentColor }}
      >
        {loading ? 'Mengirim...' : 'Kirim konfirmasi'}
      </button>
    </div>
  )
}
