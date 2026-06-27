'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Theme {
  id: string
  name: string
  event_categories: string[]
  style_tag: string
  type: string
  preview_url: string | null
}

interface Props {
  themes: Theme[]
}

const acaraFilters = [
  { label: 'Semua', value: '' },
  { label: 'Wedding', value: 'wedding' },
  { label: 'Ulang tahun', value: 'birthday' },
  { label: 'Aqiqah & khitan', value: 'aqiqah' },
  { label: 'Tunangan', value: 'tunangan' },
  { label: 'Wisuda', value: 'wisuda' },
]

const gayaFilters = [
  { label: 'Semua gaya', value: '' },
  { label: 'Eksklusif', value: 'exclusive' },
  { label: 'Elegan', value: 'elegan' },
  { label: 'Minimalis', value: 'minimalis' },
  { label: 'Islami', value: 'islami' },
  { label: 'Anime & kartun', value: 'anime-kartun' },
  { label: 'Modern', value: 'modern' },
  { label: 'Floral', value: 'floral' },
]

const gradients: Record<string, string> = {
  elegan: 'linear-gradient(135deg,#F7F0E8,#EDE0D0)',
  minimalis: 'linear-gradient(135deg,#EEF2F0,#DDE8E2)',
  'anime-kartun': 'linear-gradient(135deg,#1A1A2E,#2D2B55)',
  islami: 'linear-gradient(135deg,#F0F7F0,#DCF0DC)',
  modern: 'linear-gradient(135deg,#FFF5E8,#FFE8CC)',
  floral: 'linear-gradient(135deg,#FEF0F5,#F8D7E8)',
  'tradisional-adat': 'linear-gradient(135deg,#FDF8F0,#F5E8D0)',
  olahraga: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
}

const textColors: Record<string, { text: string; sub: string }> = {
  elegan: { text: '#8B6845', sub: '#C9A882' },
  minimalis: { text: '#2D5A45', sub: '#6BAE92' },
  'anime-kartun': { text: '#B8A9E8', sub: '#8B7DD4' },
  islami: { text: '#2D5A2D', sub: '#6BAE6B' },
  modern: { text: '#B85A1A', sub: '#E8896A' },
  floral: { text: '#9B4F72', sub: '#D489A8' },
  'tradisional-adat': { text: '#7A5A1A', sub: '#B8943F' },
  olahraga: { text: '#1D4ED8', sub: '#60A5FA' },
}

const categoryLabels: Record<string, string> = {
  wedding: 'Wedding',
  birthday: 'Ulang tahun',
  aqiqah: 'Aqiqah',
  khitan: 'Khitan',
  tunangan: 'Tunangan',
  wisuda: 'Wisuda',
  tasyakuran: 'Tasyakuran',
}

const startingPrice: Record<string, string> = {
  standard: 'Rp 79rb',
  exclusive: 'Rp 149rb',
}

export default function KatalogGrid({ themes }: Props) {
  const [acara, setAcara] = useState('')
  const [gaya, setGaya] = useState('')
  const [acaraOpen, setAcaraOpen] = useState(false)
  const [gayaOpen, setGayaOpen] = useState(false)

  const filtered = themes.filter((t) => {
    const acaraMatch = !acara || t.event_categories.includes(acara)
    const gayaMatch =
      !gaya || (gaya === 'exclusive' ? t.type === 'exclusive' : t.style_tag === gaya)
    return acaraMatch && gayaMatch
  })

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-[20px] md:text-[28px] font-medium text-neutral-900 tracking-tight mb-1.5">
          Katalog tema undangan
        </h1>
        <p className="text-[12px] md:text-[14px] text-neutral-500">
          {themes.length} tema tersedia — pilih dan preview sebelum beli.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        {/* Mobile dropdowns */}
        <div className="flex gap-2 md:hidden">
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
              <i className={`ti ti-chevron-down text-[12px] transition-transform duration-200 ${acaraOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {acaraOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 py-1.5">
                {acaraFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setAcara(f.value); setAcaraOpen(false) }}
                    className={`w-full text-left text-[12px] px-4 py-2.5 flex items-center gap-2 ${
                      acara === f.value ? 'bg-[#EEF0F9] text-[#2D4080] font-medium' : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {acara === f.value && <i className="ti ti-check text-[11px] text-[#4A5FA8]" aria-hidden="true" />}
                    <span className={acara === f.value ? '' : 'pl-3.75'}>{f.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
              <i className={`ti ti-chevron-down text-[12px] transition-transform duration-200 ${gayaOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
            {gayaOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg z-20 py-1.5">
                {gayaFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setGaya(f.value); setGayaOpen(false) }}
                    className={`w-full text-left text-[12px] px-4 py-2.5 flex items-center gap-2 ${
                      gaya === f.value
                        ? f.value === 'exclusive'
                          ? 'bg-[#FDF4E8] text-[#7A5A1A] font-medium'
                          : 'bg-[#EEF0F9] text-[#2D4080] font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {gaya === f.value && (
                      <i className={`ti ti-check text-[11px] ${f.value === 'exclusive' ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`} aria-hidden="true" />
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
            <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-medium">Acara</span>
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
            <span className="text-[11px] text-neutral-400 uppercase tracking-widest font-medium">Gaya</span>
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
          <p className="text-[12px] text-neutral-400 mb-5">Menampilkan {filtered.length} tema</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((theme) => {
              const isExclusive = theme.type === 'exclusive'
              const colors = textColors[theme.style_tag] ?? { text: '#4A5FA8', sub: '#8B9ED4' }
              const bg = gradients[theme.style_tag] ?? 'linear-gradient(135deg,#F3F5FB,#E8EAF5)'
              const catLabel = theme.event_categories
                .map((c) => categoryLabels[c] ?? c)
                .slice(0, 2)
                .join(', ')

              return (
                <div
                  key={theme.id}
                  className={`border rounded-xl overflow-hidden bg-white transition-colors ${
                    isExclusive
                      ? 'border-[#E8C98A] hover:border-[#C9A55A]'
                      : 'border-neutral-200 hover:border-[#8B9ED4]'
                  }`}
                >
                  <div
                    className="h-48 flex items-center justify-center relative"
                    style={{ background: theme.preview_url ? undefined : bg }}
                  >
                    {theme.preview_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${theme.preview_url}?f_auto,q_auto,w_400`}
                        alt={theme.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center px-4">
                        <p className="text-[15px] font-medium mb-1" style={{ color: colors.text }}>
                          {theme.name}
                        </p>
                        <p className="text-[12px]" style={{ color: colors.sub }}>
                          {catLabel}
                        </p>
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isExclusive
                          ? 'bg-[#E8C98A] text-[#7A5A1A]'
                          : 'bg-[#4A5FA8] text-white'
                      }`}
                    >
                      {isExclusive ? 'Eksklusif' : 'Standar'}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-[14px] font-medium text-neutral-800 mb-0.5">{theme.name}</p>
                    <p className="text-[12px] text-neutral-400 mb-4">
                      {catLabel} · {theme.style_tag}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-neutral-500">
                        Mulai{' '}
                        <strong className="text-neutral-800">
                          {startingPrice[theme.type] ?? 'Rp 79rb'}
                        </strong>
                      </span>
                      <Link
                        href={`/checkout/${theme.id}`}
                        className="text-[12px] px-4 py-1.5 rounded-lg bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors"
                      >
                        Pilih tema
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
