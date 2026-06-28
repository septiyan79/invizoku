'use client'

import { useState } from 'react'

interface Props {
  notifRsvp: boolean
  notifUcapan: boolean
}

export default function NotifForm({ notifRsvp, notifUcapan }: Props) {
  const [form, setForm] = useState({ notif_rsvp: notifRsvp, notif_ucapan: notifUcapan })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')

  async function toggle(field: 'notif_rsvp' | 'notif_ucapan') {
    const next = { ...form, [field]: !form[field] }
    setForm(next)
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: next[field] }),
      })
      setStatus(res.ok ? 'ok' : 'error')
      if (!res.ok) setForm(form) // rollback
    } catch {
      setStatus('error')
      setForm(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6">
      <h2 className="text-[15px] font-medium text-neutral-800 mb-1">Preferensi Notifikasi</h2>
      <p className="text-[12px] text-neutral-400 mb-5">
        Notifikasi dikirim via WhatsApp ke nomor yang terdaftar.
      </p>

      {/* Notifikasi selalu aktif */}
      <div className="mb-4">
        <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-3">
          Selalu aktif
        </p>
        <div className="space-y-2.5">
          {[
            'Pembayaran berhasil dikonfirmasi',
            'Undangan berhasil dipublikasi',
            'Pengingat H-14 sebelum masa aktif habis',
            'Pengingat H-1 sebelum masa aktif habis',
            'Perpanjangan masa aktif berhasil',
          ].map((label) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-neutral-50 last:border-0">
              <span className="text-[13px] text-neutral-600">{label}</span>
              <span className="text-[11px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Aktif</span>
            </div>
          ))}
        </div>
      </div>

      {/* Notifikasi bisa di-toggle */}
      <div>
        <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide mb-3">
          Bisa diatur
        </p>
        <div className="space-y-0">
          <ToggleRow
            label="Tamu submit RSVP"
            description="Dapat notif setiap tamu konfirmasi kehadiran"
            checked={form.notif_rsvp}
            disabled={saving}
            onChange={() => toggle('notif_rsvp')}
          />
          <ToggleRow
            label="Tamu kirim ucapan"
            description="Dapat notif setiap tamu menulis pesan di buku tamu"
            checked={form.notif_ucapan}
            disabled={saving}
            onChange={() => toggle('notif_ucapan')}
          />
        </div>
      </div>

      {status === 'ok' && (
        <p className="text-[12px] text-green-600 flex items-center gap-1.5 mt-4">
          <i className="ti ti-circle-check" aria-hidden="true" />
          Preferensi disimpan
        </p>
      )}
      {status === 'error' && (
        <p className="text-[12px] text-red-500 flex items-center gap-1.5 mt-4">
          <i className="ti ti-alert-circle" aria-hidden="true" />
          Gagal menyimpan, coba lagi
        </p>
      )}
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-[13px] text-neutral-700">{label}</p>
        <p className="text-[11px] text-neutral-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        disabled={disabled}
        className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4A5FA8]/50 disabled:opacity-50 ${
          checked ? 'bg-[#4A5FA8]' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
