'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

const allThemes = [
  {
    name: 'Wedding Elegance',
    category: 'Wedding · Standar',
    cats: ['wedding'],
    gaya: 'elegan',
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
    cats: ['wedding'],
    gaya: 'minimalis',
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
    cats: ['wedding'],
    gaya: 'anime-kartun',
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
    cats: ['birthday'],
    gaya: 'modern',
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
    cats: ['birthday'],
    gaya: 'anime-kartun',
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
    cats: ['aqiqah', 'khitan'],
    gaya: 'islami',
    price: 'Rp 79rb',
    exclusive: false,
    previewBg: 'linear-gradient(135deg,#F0F7F0,#DCF0DC)',
    previewText: 'Aqiqah Muhammad Rafif',
    previewSub: 'Ahad, 5 April 2026',
    previewTextColor: '#2D5A2D',
    previewSubColor: '#6BAE6B',
  },
]

const acaraFilters = [
  { label: 'Semua', value: '' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Ulang tahun', value: 'birthday' },
  { label: 'Aqiqah & khitan', value: 'aqiqah' },
]

const gayaFilters = [
  { label: 'Semua gaya', value: '' },
  { label: 'Eksklusif', value: 'exclusive' },
  { label: 'Elegan', value: 'elegan' },
  { label: 'Minimalis', value: 'minimalis' },
  { label: 'Islami', value: 'islami' },
  { label: 'Anime & kartun', value: 'anime-kartun' },
  { label: 'Modern', value: 'modern' },
]

export default function KatalogPage() {
  const [acara, setAcara] = useState('')
  const [gaya, setGaya] = useState('')
  const [acaraOpen, setAcaraOpen] = useState(false)
  const [gayaOpen, setGayaOpen] = useState(false)

  const filtered = allThemes.filter((t) => {
    const acaraMatch = !acara || t.cats.includes(acara)
    const gayaMatch = !gaya || (gaya === 'exclusive' ? t.exclusive : t.gaya === gaya)
    return acaraMatch && gayaMatch
  })

  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-[20px] md:text-[28px] font-medium text-neutral-900 tracking-tight mb-1.5">
            Katalog tema undangan
          </h1>
          <p className="text-[12px] md:text-[14px] text-neutral-500">
            {allThemes.length} tema tersedia — pilih dan preview sebelum beli.
          </p>
        </div>

        {/* Filters — dropdown on mobile, pills on desktop */}
        <div className="mb-8">
          {/* Mobile custom dropdowns */}
          <div className="flex gap-2 md:hidden">
            {/* Acara dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => { setAcaraOpen((v) => !v); setGayaOpen(false) }}
                className={`w-full flex items-center justify-between text-[13px] px-3 py-2 rounded-lg border transition-colors ${
                  acara
                    ? 'border-[#4A5FA8] bg-[#EEF0F9] text-[#2D4080] font-medium'
                    : 'border-neutral-200 bg-white text-neutral-500'
                }`}
              >
                <span>{acaraFilters.find((f) => f.value === acara)?.label ?? 'Semua'}</span>
                <i
                  className={`ti ti-chevron-down text-[12px] transition-transform duration-200 ${acaraOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {acaraOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg shadow-neutral-100 z-20 py-1.5 overflow-hidden">
                  {acaraFilters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setAcara(f.value); setAcaraOpen(false) }}
                      className={`w-full text-left text-[12px] px-4 py-2.5 transition-colors flex items-center gap-2 ${
                        acara === f.value
                          ? 'bg-[#EEF0F9] text-[#2D4080] font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {acara === f.value && (
                        <i className="ti ti-check text-[11px] text-[#4A5FA8]" aria-hidden="true" />
                      )}
                      <span className={acara === f.value ? '' : 'pl-3.75'}>{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Gaya dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => { setGayaOpen((v) => !v); setAcaraOpen(false) }}
                className={`w-full flex items-center justify-between text-[13px] px-3 py-2 rounded-lg border transition-colors ${
                  gaya
                    ? gaya === 'exclusive'
                      ? 'border-[#C9A55A] bg-[#FDF4E8] text-[#7A5A1A] font-medium'
                      : 'border-[#4A5FA8] bg-[#EEF0F9] text-[#2D4080] font-medium'
                    : 'border-neutral-200 bg-white text-neutral-500'
                }`}
              >
                <span>{gayaFilters.find((f) => f.value === gaya)?.label ?? 'Semua gaya'}</span>
                <i
                  className={`ti ti-chevron-down text-[12px] transition-transform duration-200 ${gayaOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {gayaOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg shadow-neutral-100 z-20 py-1.5 overflow-hidden">
                  {gayaFilters.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setGaya(f.value); setGayaOpen(false) }}
                      className={`w-full text-left text-[12px] px-4 py-2.5 transition-colors flex items-center gap-2 ${
                        gaya === f.value
                          ? f.value === 'exclusive'
                            ? 'bg-[#FDF4E8] text-[#7A5A1A] font-medium'
                            : 'bg-[#EEF0F9] text-[#2D4080] font-medium'
                          : 'text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {gaya === f.value && (
                        <i
                          className={`ti ti-check text-[11px] ${f.value === 'exclusive' ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`}
                          aria-hidden="true"
                        />
                      )}
                      <span className={gaya === f.value ? '' : 'pl-3.75'}>{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop pills */}
          <div className="hidden md:flex flex-wrap gap-6">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-medium">
                Acara
              </span>
              {acaraFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setAcara(f.value)}
                  className={`text-[12px] px-4 py-1.5 rounded-full border transition-all ${
                    acara === f.value
                      ? 'bg-[#4A5FA8] border-[#4A5FA8] text-white font-medium'
                      : 'border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-medium">
                Gaya
              </span>
              {gayaFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setGaya(f.value)}
                  className={`text-[12px] px-4 py-1.5 rounded-full border transition-all ${
                    gaya === f.value
                      ? f.value === 'exclusive'
                        ? 'bg-[#E8C98A] border-[#C9A55A] text-[#7A5A1A] font-medium'
                        : 'bg-[#4A5FA8] border-[#4A5FA8] text-white font-medium'
                      : 'border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <i className="ti ti-search-off text-4xl mb-3 block" aria-hidden="true" />
            <p className="text-[14px]">Tidak ada tema untuk filter ini.</p>
          </div>
        ) : (
          <>
            <p className="text-[12px] text-neutral-400 mb-5">
              Menampilkan {filtered.length} tema
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                    className="h-48 flex items-center justify-center relative"
                    style={{ background: theme.previewBg }}
                  >
                    <div className="text-center px-4">
                      <p
                        className="text-[15px] font-medium mb-1"
                        style={{ color: theme.previewTextColor }}
                      >
                        {theme.previewText}
                      </p>
                      <p className="text-[12px]" style={{ color: theme.previewSubColor }}>
                        {theme.previewSub}
                      </p>
                    </div>
                    {theme.badge && (
                      <span
                        className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          theme.exclusive
                            ? 'bg-[#E8C98A] text-[#7A5A1A]'
                            : theme.badge === 'Baru'
                            ? 'bg-[#4A5FA8] text-white'
                            : 'bg-[#E1F5EE] text-[#085041]'
                        }`}
                      >
                        {theme.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-[14px] font-medium text-neutral-800 mb-1">{theme.name}</p>
                    <p className="text-[12px] text-neutral-400 mb-4">{theme.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-neutral-500">
                        Mulai <strong className="text-neutral-800">{theme.price}</strong>
                      </span>
                      <Link
                        href="/register"
                        className="text-[12px] px-4 py-1.5 rounded-lg bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
                      >
                        Pilih tema
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}
