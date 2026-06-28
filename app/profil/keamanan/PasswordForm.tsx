'use client'

import { useState } from 'react'

export default function PasswordForm() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setStatus('idle')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.new_password !== form.confirm) {
      setErrorMsg('Konfirmasi password tidak sama')
      setStatus('error')
      return
    }
    setSaving(true)
    setStatus('idle')
    try {
      const res = await fetch('/api/profil/keamanan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: form.current_password,
          new_password: form.new_password,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Terjadi kesalahan')
        setStatus('error')
      } else {
        setStatus('ok')
        setForm({ current_password: '', new_password: '', confirm: '' })
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
      <h2 className="text-[15px] font-medium text-neutral-800 mb-5">Ganti Password</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="current_password" className="block text-[12px] text-neutral-500 mb-1.5">
            Password saat ini
          </label>
          <input
            id="current_password"
            name="current_password"
            type="password"
            value={form.current_password}
            onChange={onChange}
            required
            autoComplete="current-password"
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
          />
        </div>

        <div>
          <label htmlFor="new_password" className="block text-[12px] text-neutral-500 mb-1.5">
            Password baru
          </label>
          <input
            id="new_password"
            name="new_password"
            type="password"
            value={form.new_password}
            onChange={onChange}
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
          />
          <p className="text-[11px] text-neutral-400 mt-1">Minimal 8 karakter</p>
        </div>

        <div>
          <label htmlFor="confirm" className="block text-[12px] text-neutral-500 mb-1.5">
            Konfirmasi password baru
          </label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            value={form.confirm}
            onChange={onChange}
            required
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
          />
        </div>

        {status === 'ok' && (
          <p className="text-[12px] text-green-600 flex items-center gap-1.5">
            <i className="ti ti-circle-check" aria-hidden="true" />
            Password berhasil diubah
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
          {saving ? 'Menyimpan...' : 'Ganti password'}
        </button>
      </form>
    </div>
  )
}
