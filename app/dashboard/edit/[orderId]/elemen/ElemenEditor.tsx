'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import UploadZone from '@/components/upload/UploadZone'
import { useUpload } from '@/hooks/useUpload'
import { useInvitation } from '@/hooks/useInvitation'
import { musicLibrary } from '@/lib/music'
import type { InvitationData } from '@/types/invitation'

interface LoveStoryItem {
  photo: string
  caption: string
  date: string
}

interface Props {
  orderId: string
  pkg: string
  slug: string
  initialContent: InvitationData
}

const GALLERY_LIMIT: Record<string, number | null> = {
  trial: 2, basic: 10, pro: 30, studio: null,
}
const LOVESTORY_LIMIT: Record<string, number | null> = {
  trial: 0, basic: 0, pro: 10, studio: 20,
}

export default function ElemenEditor({ orderId, pkg, slug, initialContent }: Props) {
  const { upload, uploading, error: uploadError, clearError } = useUpload(orderId)
  const { save, saving, savedAt, error: saveError } = useInvitation(orderId)

  const [coverPhoto, setCoverPhoto] = useState(initialContent.cover_photo ?? '')
  const [gallery, setGallery] = useState<string[]>(initialContent.gallery ?? [])
  const [loveStory, setLoveStory] = useState<LoveStoryItem[]>(initialContent.love_story ?? [])
  const [musicId, setMusicId] = useState(initialContent.music_id ?? 'music_001')
  const [qrisUrl, setQrisUrl] = useState(initialContent.angpao?.qris_url ?? '')

  const isTrial = pkg === 'trial'
  const isPro = pkg === 'pro' || pkg === 'studio'
  const galleryLimit = GALLERY_LIMIT[pkg]
  const loveStoryLimit = LOVESTORY_LIMIT[pkg]

  // ── Cover ──────────────────────────────────────────────────────────────────
  async function handleCoverUpload(file: File) {
    clearError()
    const url = await upload(file, 'cover')
    if (!url) return
    setCoverPhoto(url)
    await save({ cover_photo: url })
  }

  // ── Gallery ────────────────────────────────────────────────────────────────
  async function handleGalleryUpload(file: File) {
    clearError()
    const url = await upload(file, 'gallery')
    if (!url) return
    const next = [...gallery, url]
    setGallery(next)
    await save({ gallery: next })
  }

  function removeGalleryItem(index: number) {
    const next = gallery.filter((_, i) => i !== index)
    setGallery(next)
    save({ gallery: next })
  }

  // ── Music ──────────────────────────────────────────────────────────────────
  async function handleMusicChange(id: string) {
    setMusicId(id)
    await save({ music_id: id })
  }

  // ── QRIS ──────────────────────────────────────────────────────────────────
  async function handleQrisUpload(file: File) {
    clearError()
    const url = await upload(file, 'qris')
    if (!url) return
    setQrisUrl(url)
    await save({ angpao: { ...initialContent.angpao, qris_url: url } })
  }

  // ── Love Story ─────────────────────────────────────────────────────────────
  async function handleLoveStoryUpload(file: File) {
    clearError()
    const url = await upload(file, 'lovestory')
    if (!url) return
    const next: LoveStoryItem[] = [...loveStory, { photo: url, caption: '', date: '' }]
    setLoveStory(next)
    await save({ love_story: next })
  }

  function updateLoveStoryItem(index: number, field: 'caption' | 'date', value: string) {
    const next = loveStory.map((item, i) => i === index ? { ...item, [field]: value } : item)
    setLoveStory(next)
    save({ love_story: next })
  }

  function removeLoveStoryItem(index: number) {
    const next = loveStory.filter((_, i) => i !== index)
    setLoveStory(next)
    save({ love_story: next })
  }

  const error = uploadError ?? saveError

  return (
    <div className="space-y-4 max-w-2xl">

      {/* Global error / save feedback */}
      {error && (
        <div className="flex items-center gap-2 text-[12px] text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
          <i className="ti ti-alert-circle shrink-0" />
          {error}
        </div>
      )}
      {savedAt && !error && (
        <div className="flex items-center gap-2 text-[12px] text-green-600 bg-green-50 border border-green-100 px-4 py-3 rounded-xl">
          <i className="ti ti-circle-check shrink-0" />
          Tersimpan · {savedAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      {/* ── Foto Cover ─────────────────────────────────────────────────────── */}
      <Section title="Foto Cover" desc="Foto utama yang tampil di halaman pertama undangan.">
        <UploadZone
          currentUrl={coverPhoto || undefined}
          onFile={handleCoverUpload}
          uploading={uploading}
          label="Upload foto cover"
          hint="JPG, PNG, WEBP · Maks. 5MB"
        />
        {coverPhoto && (
          <button
            onClick={() => { setCoverPhoto(''); save({ cover_photo: '' }) }}
            className="mt-2 text-[11px] text-red-400 hover:text-red-600 transition-colors"
          >
            Hapus foto cover
          </button>
        )}
      </Section>

      {/* ── Galeri Foto ────────────────────────────────────────────────────── */}
      <Section
        title="Galeri Foto"
        badge={galleryLimit !== null ? `Maks. ${galleryLimit} foto` : undefined}
        desc={
          isTrial
            ? 'Uji coba: upload hingga 2 foto galeri.'
            : `Paket ${pkg}: hingga ${galleryLimit ?? 'tidak terbatas'} foto.`
        }
      >
        {gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {gallery.map((url, i) => (
              <div key={url} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={url} alt={`Galeri ${i + 1}`} fill className="object-cover" />
                <button
                  onClick={() => removeGalleryItem(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  title="Hapus foto"
                >
                  <i className="ti ti-x text-[11px]" />
                </button>
              </div>
            ))}
          </div>
        )}
        {(galleryLimit === null || gallery.length < (galleryLimit ?? Infinity)) && (
          <UploadZone
            onFile={handleGalleryUpload}
            uploading={uploading}
            label="Tambah foto galeri"
            hint="JPG, PNG, WEBP · Maks. 5MB"
          />
        )}
        {galleryLimit !== null && gallery.length >= galleryLimit && (
          <p className="text-[12px] text-neutral-400 text-center py-4">
            Batas galeri tercapai ({galleryLimit} foto).{' '}
            <Link href="/harga" className="text-[#4A5FA8] hover:underline">Upgrade paket</Link>
          </p>
        )}
      </Section>

      {/* ── Musik Latar ────────────────────────────────────────────────────── */}
      <Section
        title="Musik Latar"
        badge={isTrial ? 'Basic+' : undefined}
        desc="Pilih musik latar dari library kami untuk mengiringi undangan."
        locked={isTrial}
      >
        {isTrial ? (
          <LockedCTA />
        ) : (
          <div className="space-y-1.5">
            {musicLibrary.map((track) => (
              <button
                key={track.id}
                onClick={() => handleMusicChange(track.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-colors text-left ${
                  musicId === track.id
                    ? 'border-[#4A5FA8] bg-[#EEF0F9]'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  musicId === track.id ? 'bg-[#4A5FA8]' : 'bg-neutral-100'
                }`}>
                  <i className={`ti ti-music text-[13px] ${musicId === track.id ? 'text-white' : 'text-neutral-400'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] font-medium truncate ${musicId === track.id ? 'text-[#4A5FA8]' : 'text-neutral-700'}`}>
                    {track.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate">{track.artist}</p>
                </div>
                {musicId === track.id && (
                  <i className="ti ti-circle-check text-[16px] text-[#4A5FA8] shrink-0" />
                )}
              </button>
            ))}
            {saving && <p className="text-[11px] text-neutral-400 text-right">Menyimpan...</p>}
          </div>
        )}
      </Section>

      {/* ── QRIS Digital ────────────────────────────────────────────────────── */}
      <Section
        title="QRIS Digital"
        badge={isTrial ? 'Basic+' : undefined}
        desc="Upload foto QRIS untuk menerima hadiah digital dari tamu."
        locked={isTrial}
      >
        {isTrial ? (
          <LockedCTA />
        ) : (
          <>
            <UploadZone
              currentUrl={qrisUrl || undefined}
              onFile={handleQrisUpload}
              uploading={uploading}
              label="Upload foto QRIS"
              hint="JPG, PNG, WEBP · Maks. 5MB · Pastikan angka terlihat jelas"
            />
            {qrisUrl && (
              <button
                onClick={() => {
                  setQrisUrl('')
                  save({ angpao: { ...initialContent.angpao, qris_url: '' } })
                }}
                className="mt-2 text-[11px] text-red-400 hover:text-red-600 transition-colors"
              >
                Hapus QRIS
              </button>
            )}
          </>
        )}
      </Section>

      {/* ── Love Story ─────────────────────────────────────────────────────── */}
      {isPro && (
        <Section
          title="Love Story"
          badge={loveStoryLimit !== null ? `Maks. ${loveStoryLimit} foto` : undefined}
          desc="Ceritakan momen spesial dengan foto dan keterangan singkat."
        >
          {loveStory.map((item, i) => (
            <div key={i} className="border border-neutral-200 rounded-xl p-4 space-y-3 mb-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                {item.photo && (
                  <Image src={item.photo} alt={`Love story ${i + 1}`} fill className="object-cover" />
                )}
              </div>
              <input
                type="text"
                placeholder="Keterangan momen..."
                value={item.caption}
                onChange={(e) => updateLoveStoryItem(i, 'caption', e.target.value)}
                onBlur={() => save({ love_story: loveStory })}
                className="w-full px-3 py-2 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
              />
              <input
                type="date"
                value={item.date}
                onChange={(e) => updateLoveStoryItem(i, 'date', e.target.value)}
                className="w-full px-3 py-2 text-[13px] rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]/30 focus:border-[#4A5FA8] transition-colors"
              />
              <button
                onClick={() => removeLoveStoryItem(i)}
                className="text-[11px] text-red-400 hover:text-red-600 transition-colors"
              >
                Hapus momen ini
              </button>
            </div>
          ))}
          {(loveStoryLimit === null || loveStory.length < (loveStoryLimit ?? Infinity)) && (
            <UploadZone
              onFile={handleLoveStoryUpload}
              uploading={uploading}
              label="Tambah momen love story"
              hint="JPG, PNG, WEBP · Maks. 5MB"
            />
          )}
          {loveStoryLimit !== null && loveStory.length >= loveStoryLimit && (
            <p className="text-[12px] text-neutral-400 text-center py-4">
              Batas love story tercapai ({loveStoryLimit} foto).
            </p>
          )}
        </Section>
      )}

    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Section({
  title,
  badge,
  desc,
  locked,
  children,
}: {
  title: string
  badge?: string
  desc?: string
  locked?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`bg-white rounded-2xl border border-neutral-100 p-5 ${locked ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-[13px] font-semibold text-neutral-700">{title}</h3>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-medium shrink-0">
            {badge}
          </span>
        )}
      </div>
      {desc && <p className="text-[12px] text-neutral-400 mb-4">{desc}</p>}
      {children}
    </div>
  )
}

function LockedCTA() {
  return (
    <div className="text-center py-4">
      <p className="text-[12px] text-neutral-400 mb-3">Fitur ini tersedia di paket berbayar.</p>
      <Link href="/harga" className="text-[12px] px-4 py-2 rounded-xl bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors">
        Lihat paket
      </Link>
    </div>
  )
}
