'use client'

import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import { PACKAGES } from '@/lib/packages'

interface Props {
  themeId: string
  themeName: string
  isTrialEligible: boolean
}

type PackageKey = 'trial' | 'basic' | 'pro' | 'studio'

const FEATURES: Record<PackageKey, string[]> = {
  trial: ['Preview undangan', 'Tanpa batas waktu', 'Watermark Invizoku', 'Tidak bisa disebar'],
  basic: ['10 foto galeri', 'Musik latar', 'RSVP & buku tamu', 'Angpao digital', '6 bulan aktif'],
  pro: ['30 foto galeri', 'Love story', 'Embed YouTube', 'Terima beres 1x', '6 bulan aktif'],
  studio: ['Foto unlimited', 'Love story 20 item', 'Terima beres 3x', 'Prioritas antrian', '1 tahun aktif'],
}

function randomSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const r = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `undangan-${r}`
}

export default function CheckoutForm({ themeId, themeName, isTrialEligible }: Props) {
  const router = useRouter()
  const id = useId()
  const [pkg, setPkg] = useState<PackageKey>('basic')
  const [slug, setSlug] = useState(randomSlug)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const slugError =
    slug.length > 0 && !/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug)
      ? 'Hanya huruf kecil, angka, dan tanda hubung. Min 3, maks 50 karakter.'
      : ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (slugError) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId, package: pkg, slug }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Terjadi kesalahan.')
        return
      }

      if (data.type === 'trial') {
        router.push(`/checkout/success?orderId=${data.orderId}`)
      } else {
        router.push(
          `/checkout/payment?token=${encodeURIComponent(data.snapToken)}&orderId=${data.orderId}&clientKey=${encodeURIComponent(data.clientKey ?? '')}`
        )
      }
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const packages: PackageKey[] = isTrialEligible
    ? ['trial', 'basic', 'pro', 'studio']
    : ['basic', 'pro', 'studio']

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Pilih paket */}
      <div>
        <p className="text-[13px] font-medium text-neutral-700 mb-3">Pilih paket</p>
        <div className="space-y-2.5">
          {packages.map((p) => {
            const isSelected = pkg === p
            const price = p === 'trial' ? 'Gratis' : PACKAGES[p as keyof typeof PACKAGES].label
            const isExclusive = p === 'studio'
            return (
              <label
                key={p}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? isExclusive
                      ? 'border-[#C9A55A] bg-[#FEFBF5]'
                      : 'border-[#4A5FA8] bg-[#F3F5FB]'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name={`${id}-package`}
                  value={p}
                  checked={isSelected}
                  onChange={() => setPkg(p)}
                  className="mt-0.5 accent-[#4A5FA8]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[13px] font-medium text-neutral-800 capitalize">
                      {p === 'trial' ? 'Uji Coba' : p.charAt(0).toUpperCase() + p.slice(1)}
                    </span>
                    <span
                      className={`text-[13px] font-semibold ${isExclusive ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`}
                    >
                      {price}
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {FEATURES[p].map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                        <i
                          className={`ti ti-check text-[10px] ${isSelected ? (isExclusive ? 'text-[#C9A55A]' : 'text-[#4A5FA8]') : 'text-neutral-300'}`}
                          aria-hidden="true"
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      {/* URL undangan */}
      <div>
        <label htmlFor={`${id}-slug`} className="text-[13px] font-medium text-neutral-700 mb-1.5 block">
          URL undangan
        </label>
        <div className="flex items-center gap-0 border border-neutral-200 rounded-xl overflow-hidden focus-within:border-[#4A5FA8] transition-colors bg-white">
          <span className="px-3 py-2.5 text-[12px] text-neutral-400 bg-neutral-50 border-r border-neutral-200 shrink-0">
            invizoku.com/undangan/
          </span>
          <input
            id={`${id}-slug`}
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            className="flex-1 px-3 py-2.5 text-[13px] text-neutral-800 outline-none bg-white"
            placeholder="nama-kamu-2026"
            required
          />
        </div>
        {slugError ? (
          <p className="text-[11px] text-red-500 mt-1">{slugError}</p>
        ) : (
          <p className="text-[11px] text-neutral-400 mt-1">
            Bisa diubah nanti. Hanya huruf kecil, angka, dan tanda hubung.
          </p>
        )}
      </div>

      {/* Ringkasan & error */}
      {error && (
        <div className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="border-t border-neutral-100 pt-4">
        <div className="flex items-center justify-between mb-4 text-[13px]">
          <span className="text-neutral-500">
            {pkg === 'trial' ? 'Uji Coba' : pkg.charAt(0).toUpperCase() + pkg.slice(1)} — {themeName}
          </span>
          <span className="font-semibold text-neutral-800">
            {pkg === 'trial' ? 'Gratis' : PACKAGES[pkg as keyof typeof PACKAGES].label}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading || !!slugError}
          className="w-full py-3 rounded-xl text-[14px] font-medium text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: loading || slugError ? undefined : '#4A5FA8', backgroundColor: loading || slugError ? '#9CA3AF' : '#4A5FA8' }}
        >
          {loading
            ? 'Memproses...'
            : pkg === 'trial'
            ? 'Mulai uji coba gratis'
            : `Lanjut bayar ${PACKAGES[pkg as keyof typeof PACKAGES].label}`}
        </button>

        {pkg !== 'trial' && (
          <p className="text-center text-[11px] text-neutral-400 mt-3">
            Diarahkan ke halaman pembayaran Midtrans yang aman
          </p>
        )}
      </div>
    </form>
  )
}
