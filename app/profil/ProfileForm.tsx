'use client'

import { useState } from 'react'

interface Props {
  name: string
  email: string
  phoneWa: string
}

export default function ProfileForm({ name, email, phoneWa }: Props) {
  const [form, setForm] = useState({ name, phone_wa: phoneWa })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setStatus('idle')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/profil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Terjadi kesalahan')
        setStatus('error')
      } else {
        setStatus('ok')
      }
    } catch {
      setErrorMsg('Koneksi bermasalah')
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6">
      <h2 className="text-[15px] font-medium text-neutral-800 mb-5">Informasi Profil</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email — readonly */}
        <div>
          <label className="block text-[12px] text-neutral-500 mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-400 cursor-not-allowed"
          />
          <p className="text-[11px] text-neutral-400 mt-1">Email tidak bisa diubah</p>
        </div>

        {/* Nama */}
        <div>
          <label htmlFor="name" className="block text-[12px] text-neutral-500 mb-1.5">
            Nama lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            required
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
          />
        </div>

        {/* Nomor WA */}
        <div>
          <label htmlFor="phone_wa" className="block text-[12px] text-neutral-500 mb-1.5">
            Nomor WhatsApp
          </label>
          <input
            id="phone_wa"
            name="phone_wa"
            type="tel"
            value={form.phone_wa}
            onChange={onChange}
            required
            placeholder="08123456789"
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
          />
          <p className="text-[11px] text-neutral-400 mt-1">
            Digunakan untuk notifikasi RSVP dan pengingat masa aktif
          </p>
        </div>

        {/* Feedback */}
        {status === 'ok' && (
          <p className="text-[12px] text-green-600 flex items-center gap-1.5">
            <i className="ti ti-circle-check" aria-hidden="true" />
            Profil berhasil disimpan
          </p>
        )}
        {status === 'error' && (
          <p className="text-[12px] text-red-500 flex items-center gap-1.5">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-[#4A5FA8] text-white text-[13px] font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
        >
          {saving ? 'Menyimpan...' : 'Simpan perubahan'}
        </button>
      </form>
    </div>
  )
}
