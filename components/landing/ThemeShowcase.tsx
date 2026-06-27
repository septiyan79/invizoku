'use client'

import { useState } from 'react'
import Link from 'next/link'

type Theme = {
  name: string
  category: string
  cat: string
  price: string
  exclusive: boolean
  badge?: string
  previewBg: string
  previewText: string
  previewSub: string
  previewTextColor: string
  previewSubColor: string
}

const themes: Theme[] = [
  {
    name: 'Wedding Elegance',
    category: 'Wedding · Standar',
    cat: 'wedding',
    price: 'Rp 79rb',
    exclusive: false,
    badge: 'Terpopuler',
    previewBg: 'linear-gradient(135deg,#F7F0E8,#EDE0D0)',
    previewText: 'Budi & Ani',
    previewSub: 'Sabtu, 14 Februari 2026',
    previewTextColor: '#8B6845',
    previewSubColor: '#C9A882',
  },
  {
    name: 'Garden Minimalist',
    category: 'Wedding · Standar',
    cat: 'wedding',
    price: 'Rp 79rb',
    exclusive: false,
    badge: 'Baru',
    previewBg: 'linear-gradient(135deg,#EEF2F0,#DDE8E2)',
    previewText: 'Reza & Dina',
    previewSub: '14 · 02 · 2026',
    previewTextColor: '#2D5A45',
    previewSubColor: '#6BAE92',
  },
  {
    name: 'Sakura Anime',
    category: 'Wedding · Eksklusif',
    cat: 'exclusive wedding',
    price: 'Rp 149rb',
    exclusive: true,
    badge: 'Eksklusif',
    previewBg: 'linear-gradient(135deg,#1A1A2E,#2D2B55)',
    previewText: '桜 · Sakura Wedding',
    previewSub: 'アニメスタイル',
    previewTextColor: '#B8A9E8',
    previewSubColor: '#8B7DD4',
  },
  {
    name: 'Birthday Fiesta',
    category: 'Ulang tahun · Standar',
    cat: 'birthday',
    price: 'Rp 79rb',
    exclusive: false,
    previewBg: 'linear-gradient(135deg,#FFF5E8,#FFE8CC)',
    previewText: 'Happy 25th!',
    previewSub: 'Sabtu, 20 Maret 2026',
    previewTextColor: '#B85A1A',
    previewSubColor: '#E8896A',
  },
  {
    name: 'Gamer Birthday',
    category: 'Ulang tahun · Eksklusif',
    cat: 'exclusive birthday',
    price: 'Rp 149rb',
    exclusive: true,
    badge: 'Eksklusif',
    previewBg: 'linear-gradient(135deg,#0D1B2A,#1B3A5C)',
    previewText: 'LEVEL UP!',
    previewSub: 'Player 1 turns 20',
    previewTextColor: '#7DD3FC',
    previewSubColor: '#38BDF8',
  },
  {
    name: 'Aqiqah Islami',
    category: 'Aqiqah & khitan · Standar',
    cat: 'aqiqah',
    price: 'Rp 79rb',
    exclusive: false,
    previewBg: 'linear-gradient(135deg,#F0F7F0,#DCF0DC)',
    previewText: 'Aqiqah Muhammad Rafif',
    previewSub: 'Ahad, 5 April 2026',
    previewTextColor: '#2D5A2D',
    previewSubColor: '#6BAE6B',
  },
]

const filters = [
  { label: 'Semua', value: 'semua', gold: false },
  { label: 'Wedding', value: 'wedding', gold: false },
  { label: 'Ulang tahun', value: 'birthday', gold: false },
  { label: 'Aqiqah & khitan', value: 'aqiqah', gold: false },
  { label: 'Eksklusif', value: 'exclusive', gold: true },
]

export default function ThemeShowcase() {
  const [active, setActive] = useState('semua')
  const filtered = active === 'semua' ? themes : themes.filter((t) => t.cat.includes(active))

  return (
    <section className="px-8 py-20 bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#C9A55A] bg-[#FDF4E8] border border-[#E8C98A] px-3 py-1 rounded-full mb-4">
            <i className="ti ti-template text-sm" aria-hidden="true" />
            Koleksi tema
          </div>
          <h2 className="text-[28px] font-medium text-neutral-900 tracking-tight mb-2">
            Temukan tema yang <em className="not-italic text-[#4A5FA8]">kamu banget</em>
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed">
            Dari elegan klasik hingga anime — semua bisa di-preview sebelum beli.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActive(f.value)}
              className={`text-[12px] px-4 py-1.5 rounded-full border transition-all ${
                active === f.value
                  ? f.gold
                    ? 'bg-[#E8C98A] border-[#C9A55A] text-[#7A5A1A] font-medium'
                    : 'bg-[#4A5FA8] border-[#4A5FA8] text-white font-medium'
                  : 'border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8]'
              }`}
            >
              {f.value === 'exclusive' && (
                <i className="ti ti-sparkles mr-1 text-[11px]" aria-hidden="true" />
              )}
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {filtered.map((theme) => (
            <div
              key={theme.name}
              className={`border rounded-xl overflow-hidden bg-white transition-colors ${
                theme.exclusive
                  ? 'border-[#E8C98A] hover:border-[#C9A55A]'
                  : 'border-neutral-200 hover:border-[#8B9ED4]'
              }`}
            >
              <div
                className="h-40 flex items-center justify-center relative"
                style={{ background: theme.previewBg }}
              >
                <div className="text-center px-4">
                  <p className="text-[14px] font-medium mb-1" style={{ color: theme.previewTextColor }}>
                    {theme.previewText}
                  </p>
                  <p className="text-[11px]" style={{ color: theme.previewSubColor }}>
                    {theme.previewSub}
                  </p>
                </div>
                {theme.badge && (
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      theme.exclusive
                        ? 'bg-[#E8C98A] text-[#7A5A1A]'
                        : theme.badge === 'Baru'
                        ? 'bg-[#4A5FA8] text-white'
                        : 'bg-[#E1F5EE] text-[#085041]'
                    }`}
                  >
                    {theme.exclusive && (
                      <i className="ti ti-sparkles mr-0.5 text-[10px]" aria-hidden="true" />
                    )}
                    {theme.badge}
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <p className="text-[13px] font-medium text-neutral-800 mb-1">{theme.name}</p>
                <p className="text-[11px] text-neutral-400 mb-3 flex items-center gap-1">
                  <i
                    className={`${theme.exclusive ? 'ti ti-sparkles text-[#C9A55A]' : 'ti ti-heart text-neutral-400'} text-[11px]`}
                    aria-hidden="true"
                  />
                  {theme.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-neutral-500">
                    Mulai <strong className="text-neutral-800">{theme.price}</strong>
                  </span>
                  <Link
                    href="/katalog"
                    className="text-[11px] px-3 py-1 rounded-lg border border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors flex items-center gap-1"
                  >
                    <i className="ti ti-eye text-[11px]" aria-hidden="true" />
                    Preview
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-[12px] text-neutral-400 mb-4">
            Menampilkan {filtered.length} dari 50+ tema tersedia
          </p>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-[13px] text-[#4A5FA8] border border-[#4A5FA8] px-6 py-2.5 rounded-lg hover:bg-[#EEF0F9] transition-colors"
          >
            <i className="ti ti-layout-grid" aria-hidden="true" />
            Lihat semua tema
          </Link>
        </div>
      </div>
    </section>
  )
}
