'use client'

import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import { PACKAGES } from '@/lib/packages'

interface Props {
  themeId: string
  themeName: string
  themeCategory: string
  isTrialEligible: boolean
}

type PaidKey = 'basic' | 'pro' | 'studio'

const FEATURES: Record<PaidKey, string[]> = {
  basic: ['10 foto galeri', 'Musik latar', 'RSVP & buku tamu', 'Angpao digital', '6 bulan aktif'],
  pro: ['30 foto galeri', 'Love story', 'Embed YouTube', 'Terima beres 1x', '6 bulan aktif'],
  studio: ['Foto unlimited', 'Love story 20 item', 'Terima beres 3x', 'Prioritas antrian', '1 tahun aktif'],
}

const TAGLINE: Record<PaidKey, string> = {
  basic: 'Self-edit mandiri · 10 foto · 6 bulan',
  pro: 'Terima beres 1x · 30 foto · 6 bulan',
  studio: 'Terima beres 3x · foto unlimited · 1 tahun',
}

const PKG_LABEL: Record<PaidKey, string> = {
  basic: 'Basic',
  pro: 'Pro',
  studio: 'Studio',
}

function randomSlug() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const r = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `undangan-${r}`
}

export default function CheckoutForm({ themeId, themeName, themeCategory, isTrialEligible }: Props) {
  const router = useRouter()
  const id = useId()
  const [pkg, setPkg] = useState<PaidKey>('basic')
  const [slug, setSlug] = useState(randomSlug)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [trialLoading, setTrialLoading] = useState(false)

  const slugError =
    slug.length > 0 && !/^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/.test(slug)
      ? 'Hanya huruf kecil, angka, dan tanda hubung. Min 3, maks 50.'
      : ''

  async function handleTrial() {
    setTrialLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId, package: 'trial', slug: randomSlug() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Terjadi kesalahan.'); return }
      router.push(`/checkout/success?orderId=${data.orderId}`)
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setTrialLoading(false)
    }
  }

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
      if (!res.ok) { setError(data.error ?? 'Terjadi kesalahan.'); return }
      router.push(
        `/checkout/payment?token=${encodeURIComponent(data.snapToken)}&orderId=${data.orderId}&clientKey=${encodeURIComponent(data.clientKey ?? '')}`
      )
    } catch {
      setError('Gagal terhubung ke server. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const isStudio = pkg === 'studio'
  const accentColor = isStudio ? '#C9A55A' : '#4A5FA8'
  const price = PACKAGES[pkg].label

  return (
    <form onSubmit={handleSubmit}>
      <div className="md:grid md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_320px] md:gap-8 lg:gap-10">

        {/* ── KIRI ─────────────────────────────────────────────────────── */}
        <div>
          {/* Banner uji coba gratis */}
          {isTrialEligible && (
            <div className="mb-6 flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50">
              <div>
                <p className="text-[13px] font-medium text-neutral-700">Mau coba dulu?</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Preview gratis · ada watermark · tidak bisa disebar ke tamu
                </p>
              </div>
              <button
                type="button"
                onClick={handleTrial}
                disabled={trialLoading}
                className="shrink-0 text-[12px] px-3.5 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors disabled:opacity-50"
              >
                {trialLoading ? 'Memproses...' : 'Coba gratis →'}
              </button>
            </div>
          )}

          <p className="text-[13px] font-medium text-neutral-700 mb-3">Pilih paket</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(['basic', 'pro', 'studio'] as PaidKey[]).map((p) => {
              const isSelected = pkg === p
              const isGold = p === 'studio'
              const cardPrice = PACKAGES[p].label

              return (
                <label
                  key={p}
                  className={`flex items-start gap-3 md:gap-2.5 p-4 md:p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? isGold
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
                    className="mt-0.5 shrink-0 accent-[#4A5FA8]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 md:block">
                      <span className="text-[13px] font-medium text-neutral-800">
                        {PKG_LABEL[p]}
                      </span>
                      <span
                        className={`text-[13px] font-semibold md:block md:mt-0.5 ${isGold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`}
                      >
                        {cardPrice}
                      </span>
                    </div>

                    {/* Mobile: feature list */}
                    <ul className="mt-1.5 space-y-0.5 md:hidden">
                      {FEATURES[p].map((f) => (
                        <li key={f} className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                          <i
                            className={`ti ti-check text-[10px] shrink-0 ${
                              isSelected
                                ? isGold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'
                                : 'text-neutral-300'
                            }`}
                            aria-hidden="true"
                          />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Desktop: tagline singkat */}
                    <p className="hidden md:block text-[11px] text-neutral-400 mt-1 leading-snug">
                      {TAGLINE[p]}
                    </p>
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* ── KANAN: sidebar ───────────────────────────────────────────── */}
        <div className="mt-6 md:mt-0 md:sticky md:top-20 md:self-start space-y-4">
          {/* Tema dipilih */}
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-neutral-100">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#EEF0F9] shrink-0">
              <i className="ti ti-template text-[18px] text-[#4A5FA8]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-neutral-800 truncate">{themeName}</p>
              <p className="text-[11px] text-neutral-400 mt-0.5 truncate">{themeCategory}</p>
            </div>
          </div>

          {/* Detail paket yang dipilih — berubah dinamis */}
          <div
            className="hidden md:block rounded-xl border p-4 transition-colors"
            style={{
              borderColor: isStudio ? '#E8C98A' : '#C7D0ED',
              background: isStudio ? '#FEFBF5' : '#F6F7FC',
            }}
          >
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-[13px] font-semibold text-neutral-800">{PKG_LABEL[pkg]}</span>
              <span className="text-[14px] font-bold" style={{ color: accentColor }}>{price}</span>
            </div>
            <ul className="space-y-1.5">
              {FEATURES[pkg].map((f) => (
                <li key={f} className="flex items-center gap-2 text-[12px] text-neutral-600">
                  <i
                    className="ti ti-check text-[11px] shrink-0"
                    style={{ color: accentColor }}
                    aria-hidden="true"
                  />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* URL undangan */}
          <div>
            <label htmlFor={`${id}-slug`} className="text-[13px] font-medium text-neutral-700 mb-1.5 block">
              URL undangan
            </label>
            <div className="border border-neutral-200 rounded-xl overflow-hidden focus-within:border-[#4A5FA8] transition-colors bg-white">
              <span className="block px-3 pt-2.5 text-[11px] text-neutral-400">
                invizoku.com/undangan/
              </span>
              <input
                id={`${id}-slug`}
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="block w-full px-3 pb-2.5 pt-0.5 text-[13px] text-neutral-800 outline-none bg-white"
                placeholder="nama-kamu-2026"
                required
              />
            </div>
            {slugError ? (
              <p className="text-[11px] text-red-500 mt-1">{slugError}</p>
            ) : (
              <p className="text-[11px] text-neutral-400 mt-1">Bisa diubah nanti dari dashboard.</p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="text-[12px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            type="submit"
            disabled={loading || !!slugError}
            className="w-full py-3 rounded-xl text-[14px] font-medium text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: accentColor }}
          >
            {loading ? 'Memproses...' : `Lanjut bayar ${price}`}
          </button>

          <p className="text-center text-[11px] text-neutral-400">
            <i className="ti ti-lock text-[11px] mr-1" aria-hidden="true" />
            Pembayaran aman via Midtrans
          </p>
        </div>
      </div>
    </form>
  )
}
