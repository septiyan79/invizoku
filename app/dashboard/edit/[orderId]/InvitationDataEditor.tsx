'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useInvitation } from '@/hooks/useInvitation'
import InvitationPreview, { type InvitationPreviewHandle } from '@/components/InvitationPreview'
import type { InvitationData } from '@/types/invitation'

interface Props {
  orderId: string
  slug: string
  pkg: string
  content: InvitationData
  eventCategories: string[]
  publishedAt: string | null
}

// ── Reusable form primitives ─────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5">
      <h3 className="text-[13px] font-semibold text-neutral-700 mb-4 pb-3 border-b border-neutral-100">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[12px] font-medium text-neutral-600 block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-neutral-400 mt-1">{hint}</p>}
    </div>
  )
}

const inputCls =
  'w-full px-3 py-2.5 text-[13px] text-neutral-800 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#4A5FA8] transition-colors bg-white placeholder:text-neutral-300'

function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputCls}
    />
  )
}

// ── Event section (Akad / Resepsi / Event) ───────────────────────────────────

function EventFields({
  value,
  onChange,
}: {
  value: { date: string; time: string; venue: string; address: string; maps_url: string }
  onChange: (field: string, v: string) => void
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tanggal">
          <Input
            value={value.date}
            onChange={(v) => onChange('date', v)}
            placeholder="Sabtu, 14 Februari 2026"
          />
        </Field>
        <Field label="Waktu">
          <Input
            value={value.time}
            onChange={(v) => onChange('time', v)}
            placeholder="08.00 WIB"
          />
        </Field>
      </div>
      <Field label="Nama tempat">
        <Input
          value={value.venue}
          onChange={(v) => onChange('venue', v)}
          placeholder="Masjid Al-Ikhlas"
        />
      </Field>
      <Field label="Alamat lengkap">
        <Input
          value={value.address}
          onChange={(v) => onChange('address', v)}
          placeholder="Jl. Sudirman No. 1, Jakarta Pusat"
        />
      </Field>
      <Field label="Link Google Maps" hint="Salin link dari Google Maps → Share → Copy link">
        <Input
          value={value.maps_url}
          onChange={(v) => onChange('maps_url', v)}
          placeholder="https://maps.google.com/..."
        />
      </Field>
    </>
  )
}

// ── Main editor ──────────────────────────────────────────────────────────────

export default function InvitationDataEditor({
  orderId,
  slug,
  pkg,
  content,
  eventCategories,
  publishedAt,
}: Props) {
  const [data, setData] = useState<InvitationData>(content)
  const [publishing, setPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(!!publishedAt)
  const previewRef = useRef<InvitationPreviewHandle>(null)
  const { save, saving, savedAt, error } = useInvitation(orderId)

  const isWedding = eventCategories.some((c) => ['wedding', 'tunangan'].includes(c))
  const isBirthday = eventCategories.includes('birthday')
  const isPaid = pkg !== 'trial'

  function set<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  function setNested<K extends keyof InvitationData>(key: K, field: string, value: string) {
    setData((prev) => ({
      ...prev,
      [key]: { ...(prev[key] as Record<string, string> ?? {}), [field]: value },
    }))
  }

  async function handleSave() {
    await save(data)
    previewRef.current?.reload()
  }

  async function handlePublish() {
    setPublishing(true)
    try {
      await save(data)
      const res = await fetch(`/api/undangan/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: true }),
      })
      if (res.ok) setIsPublished(true)
      previewRef.current?.reload()
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="md:grid md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_400px] md:gap-6 lg:gap-8 md:items-start">

      {/* ── LEFT: Form ──────────────────────────────────────────────────────── */}
      <div>
        {/* Tab nav */}
        <div className="flex gap-1 mb-6">
          <span className="text-[13px] px-4 py-2 rounded-xl bg-[#4A5FA8] text-white font-medium">
            Data Acara
          </span>
          <Link
            href={`/dashboard/edit/${orderId}/elemen`}
            className="text-[13px] px-4 py-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            Foto & Elemen
          </Link>
        </div>

        {/* Form sections */}
        <div className="space-y-4">
          {/* ── WEDDING ── */}
          {isWedding && (
            <>
              <Section title="Mempelai Wanita">
                <Field label="Nama lengkap">
                  <Input
                    value={data.bride?.name ?? ''}
                    onChange={(v) => setNested('bride', 'name', v)}
                    placeholder="Siti Aisyah"
                  />
                </Field>
                <Field label="Putri dari">
                  <Input
                    value={data.bride?.parents ?? ''}
                    onChange={(v) => setNested('bride', 'parents', v)}
                    placeholder="Bapak Ahmad & Ibu Fatimah"
                  />
                </Field>
              </Section>

              <Section title="Mempelai Pria">
                <Field label="Nama lengkap">
                  <Input
                    value={data.groom?.name ?? ''}
                    onChange={(v) => setNested('groom', 'name', v)}
                    placeholder="Muhammad Rizki"
                  />
                </Field>
                <Field label="Putra dari">
                  <Input
                    value={data.groom?.parents ?? ''}
                    onChange={(v) => setNested('groom', 'parents', v)}
                    placeholder="Bapak Hasan & Ibu Maryam"
                  />
                </Field>
              </Section>

              <Section title="Akad Nikah">
                <EventFields
                  value={data.akad ?? { date: '', time: '', venue: '', address: '', maps_url: '' }}
                  onChange={(field, v) => setNested('akad', field, v)}
                />
              </Section>

              <Section title="Resepsi">
                <EventFields
                  value={data.resepsi ?? { date: '', time: '', venue: '', address: '', maps_url: '' }}
                  onChange={(field, v) => setNested('resepsi', field, v)}
                />
              </Section>
            </>
          )}

          {/* ── BIRTHDAY ── */}
          {isBirthday && (
            <>
              <Section title="Info Ulang Tahun">
                <Field label="Nama">
                  <Input
                    value={data.name ?? ''}
                    onChange={(v) => set('name', v)}
                    placeholder="Budi Santoso"
                  />
                </Field>
                <Field label="Usia ke-">
                  <input
                    type="number"
                    value={data.age ?? ''}
                    onChange={(e) => set('age', Number(e.target.value))}
                    min={1}
                    max={150}
                    className={inputCls}
                  />
                </Field>
              </Section>
              <Section title="Detail Acara">
                <EventFields
                  value={data.event ?? { date: '', time: '', venue: '', address: '', maps_url: '' }}
                  onChange={(field, v) => setNested('event', field, v)}
                />
              </Section>
            </>
          )}

          {/* ── AQIQAH / KHITAN ── */}
          {!isWedding && !isBirthday && (
            <>
              <Section title="Info Anak">
                <Field label="Nama anak">
                  <Input
                    value={data.child_name ?? ''}
                    onChange={(v) => set('child_name', v)}
                    placeholder="Muhammad Faris"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Jenis kelamin">
                    <select
                      value={data.child_gender ?? 'laki-laki'}
                      onChange={(e) => set('child_gender', e.target.value as 'laki-laki' | 'perempuan')}
                      className={inputCls}
                    >
                      <option value="laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                  </Field>
                  <Field label="Jenis acara">
                    <select
                      value={data.event_type ?? 'aqiqah'}
                      onChange={(e) => set('event_type', e.target.value as 'aqiqah' | 'khitan')}
                      className={inputCls}
                    >
                      <option value="aqiqah">Aqiqah</option>
                      <option value="khitan">Khitan</option>
                    </select>
                  </Field>
                </div>
                <Field label="Nama orang tua">
                  <Input
                    value={data.parents ?? ''}
                    onChange={(v) => set('parents', v)}
                    placeholder="Bapak Hasan & Ibu Maryam"
                  />
                </Field>
              </Section>
              <Section title="Detail Acara">
                <EventFields
                  value={data.event ?? { date: '', time: '', venue: '', address: '', maps_url: '' }}
                  onChange={(field, v) => setNested('event', field, v)}
                />
              </Section>
            </>
          )}

          {/* ── COUNTDOWN ── */}
          <Section title="Hitung Mundur">
            <Field
              label="Tanggal & waktu acara"
              hint="Digunakan untuk hitung mundur di undangan. Isi sesuai hari-H."
            >
              <input
                type="datetime-local"
                value={data.countdown_target?.slice(0, 16) ?? ''}
                onChange={(e) => set('countdown_target', e.target.value + ':00')}
                className={inputCls}
              />
            </Field>
          </Section>

          {/* ── SAVE / PUBLISH BAR ── */}
          <div className="sticky bottom-4 z-10">
            <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-4 shadow-lg shadow-neutral-200/60">
              <div className="min-w-0">
                {saving || publishing ? (
                  <p className="text-[12px] text-neutral-400">Menyimpan...</p>
                ) : error ? (
                  <p className="text-[12px] text-red-500 truncate">{error}</p>
                ) : savedAt ? (
                  <p className="text-[12px] text-green-600">
                    Tersimpan ·{' '}
                    {savedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                ) : (
                  <p className="text-[12px] text-neutral-400">Belum ada perubahan disimpan</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {/* Preview link — only visible on mobile; desktop has iframe */}
                <Link
                  href={`/undangan/${slug}`}
                  target="_blank"
                  className="md:hidden flex items-center gap-1.5 text-[12px] px-3 py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                >
                  <i className="ti ti-external-link text-[13px]" aria-hidden="true" />
                  Preview
                </Link>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-[12px] px-4 py-2 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors disabled:opacity-60"
                >
                  Simpan
                </button>
                {isPaid && !isPublished && (
                  <button
                    onClick={handlePublish}
                    disabled={saving || publishing}
                    className="text-[12px] px-4 py-2 rounded-xl bg-[#C9A55A] text-white hover:bg-[#A8843A] transition-colors disabled:opacity-60"
                  >
                    Publish
                  </button>
                )}
                {isPaid && isPublished && (
                  <span className="flex items-center gap-1 text-[11px] text-green-600 px-3 py-2 bg-green-50 rounded-xl border border-green-100">
                    <i className="ti ti-check text-[12px]" aria-hidden="true" />
                    Dipublikasi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Live Preview ─────────────────────────────────────────────── */}
      <InvitationPreview ref={previewRef} slug={slug} hint="Klik Simpan untuk memperbarui" />

    </div>
  )
}
