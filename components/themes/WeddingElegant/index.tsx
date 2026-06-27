'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import type { ThemeProps } from '@/types/invitation'
import Countdown from '@/components/theme-content/Countdown'
import Gallery from '@/components/theme-content/Gallery'
import Maps from '@/components/theme-content/Maps'
import MusicPlayer from '@/components/theme-content/MusicPlayer'
import Angpao from '@/components/theme-content/Angpao'
import RSVP from '@/components/theme-content/RSVP'
import GuestBook from '@/components/theme-content/GuestBook'
import Watermark from '@/components/theme-content/Watermark'

// Warna tema WeddingElegant
const C = {
  bg: '#FDF8F2',
  bgGold: '#FDF4E8',
  cream: '#F5EDE0',
  text: '#2C1A0E',
  textMuted: '#8B6845',
  gold: '#C9A55A',
  goldLight: '#E8C98A',
  border: '#E8D8C0',
}

function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 justify-center ${className}`}>
      <div className="h-px flex-1" style={{ background: C.border }} />
      <span style={{ color: C.goldLight }} className="text-lg">❧</span>
      <div className="h-px flex-1" style={{ background: C.border }} />
    </div>
  )
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-6">
      {sub && (
        <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: C.textMuted }}>
          {sub}
        </p>
      )}
      <h2 className="text-[22px] font-medium" style={{ color: C.text, fontFamily: 'Georgia, serif' }}>
        {children}
      </h2>
      <Ornament className="mt-4 max-w-xs mx-auto" />
    </div>
  )
}

export default function WeddingElegant({ content, pkg, slug, orderId }: ThemeProps) {
  const searchParams = useSearchParams()
  const guestName = searchParams.get('nama') ?? undefined

  const c = content
  const isPaid = pkg !== 'trial'
  const isPro = pkg === 'pro' || pkg === 'studio'
  const showLoveStory = isPro && c.love_story && c.love_story.length > 0
  const showYoutube = isPro && !!c.youtube_url

  return (
    <div className="min-h-screen font-sans" style={{ background: C.bg, color: C.text }}>
      {/* Music player — Basic+ */}
      {isPaid && c.music_id && <MusicPlayer musicId={c.music_id} />}

      {/* Watermark — Trial */}
      {!isPaid && <Watermark />}

      {/* ── COVER ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center"
        style={{ background: `linear-gradient(to bottom, ${C.cream}, ${C.bg})` }}
      >
        {c.cover_photo ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={`${c.cover_photo}?f_auto,q_auto`}
              alt="Cover"
              fill
              className="object-cover opacity-20"
              priority
              sizes="100vw"
            />
          </div>
        ) : null}

        <div className="relative z-10 max-w-sm mx-auto">
          {guestName && (
            <p className="text-[12px] uppercase tracking-[0.25em] mb-8" style={{ color: C.textMuted }}>
              Kepada Yth. {guestName}
            </p>
          )}

          <p className="text-[11px] uppercase tracking-[0.3em] mb-6" style={{ color: C.textMuted }}>
            Bismillahirrahmanirrahim
          </p>

          <p className="text-[13px] mb-8 leading-relaxed" style={{ color: C.textMuted }}>
            Dengan memohon rahmat dan ridho Allah SWT, kami mengundang kehadiran Bapak/Ibu/Saudara/i
            dalam acara pernikahan kami
          </p>

          <div className="mb-2">
            <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.textMuted }}>
              {c.bride?.parents}
            </p>
            <h1
              className="text-[38px] leading-tight font-medium"
              style={{ color: C.text, fontFamily: 'Georgia, serif' }}
            >
              {c.bride?.name}
            </h1>
          </div>

          <p className="text-2xl my-2" style={{ color: C.goldLight }}>✦</p>

          <div className="mb-8">
            <h1
              className="text-[38px] leading-tight font-medium"
              style={{ color: C.text, fontFamily: 'Georgia, serif' }}
            >
              {c.groom?.name}
            </h1>
            <p className="text-[11px] uppercase tracking-widest mt-1" style={{ color: C.textMuted }}>
              {c.groom?.parents}
            </p>
          </div>

          <div
            className="inline-flex items-center gap-3 text-[12px] px-5 py-2 rounded-full"
            style={{ background: C.bgGold, border: `1px solid ${C.border}`, color: C.textMuted }}
          >
            <i className="ti ti-calendar" style={{ color: C.gold }} aria-hidden="true" />
            {c.akad?.date}
          </div>

          <div className="mt-12">
            <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: C.textMuted }}>
              Menuju hari bahagia
            </p>
            <Countdown targetDate={c.countdown_target} />
          </div>
        </div>

        <button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
          onClick={() => document.getElementById('section-akad')?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="Scroll ke bawah"
        >
          <i className="ti ti-chevron-down text-2xl" style={{ color: C.gold }} aria-hidden="true" />
        </button>
      </section>

      {/* ── AKAD ── */}
      <section id="section-akad" className="px-6 py-16 max-w-lg mx-auto">
        <SectionTitle sub="Akad Nikah">Ijab Qabul</SectionTitle>
        <div className="text-center space-y-1 mb-6">
          <p className="font-medium" style={{ fontFamily: 'Georgia, serif' }}>{c.akad?.venue}</p>
          <p className="text-[13px]" style={{ color: C.textMuted }}>{c.akad?.address}</p>
          <p
            className="inline-flex items-center gap-1.5 text-[12px] mt-2 px-3 py-1 rounded-full"
            style={{ background: C.bgGold, color: C.textMuted }}
          >
            <i className="ti ti-clock text-[12px]" style={{ color: C.gold }} aria-hidden="true" />
            {c.akad?.date} · {c.akad?.time}
          </p>
        </div>
        {c.akad?.maps_url && <Maps mapsUrl={c.akad.maps_url} />}
      </section>

      <Ornament className="px-10 mb-0" />

      {/* ── RESEPSI ── */}
      <section className="px-6 py-16 max-w-lg mx-auto">
        <SectionTitle sub="Resepsi">Walimatul Ursy</SectionTitle>
        <div className="text-center space-y-1 mb-6">
          <p className="font-medium" style={{ fontFamily: 'Georgia, serif' }}>{c.resepsi?.venue}</p>
          <p className="text-[13px]" style={{ color: C.textMuted }}>{c.resepsi?.address}</p>
          <p
            className="inline-flex items-center gap-1.5 text-[12px] mt-2 px-3 py-1 rounded-full"
            style={{ background: C.bgGold, color: C.textMuted }}
          >
            <i className="ti ti-clock text-[12px]" style={{ color: C.gold }} aria-hidden="true" />
            {c.resepsi?.date} · {c.resepsi?.time}
          </p>
        </div>
        {c.resepsi?.maps_url && <Maps mapsUrl={c.resepsi.maps_url} />}
      </section>

      {/* ── GALERI ── */}
      {c.gallery && c.gallery.length > 0 && (
        <section className="px-6 py-16" style={{ background: C.cream }}>
          <div className="max-w-lg mx-auto">
            <SectionTitle sub="Galeri">Momen Bersama</SectionTitle>
            <Gallery photos={c.gallery} />
          </div>
        </section>
      )}

      {/* ── LOVE STORY — Pro & Studio ── */}
      {showLoveStory && (
        <section className="px-6 py-16 max-w-lg mx-auto">
          <SectionTitle sub="Perjalanan Kami">Love Story</SectionTitle>
          <div className="space-y-8">
            {c.love_story.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: C.gold }} />
                  {i < c.love_story.length - 1 && (
                    <div className="w-px flex-1 mt-2" style={{ background: C.border }} />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-[11px] uppercase tracking-widest mb-1" style={{ color: C.textMuted }}>
                    {item.date}
                  </p>
                  <p className="text-[14px] mb-3" style={{ color: C.text }}>{item.caption}</p>
                  {item.photo && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                      <Image
                        src={`${item.photo}?f_auto,q_auto`}
                        alt={item.caption}
                        fill
                        className="object-cover"
                        sizes="(max-width: 500px) 90vw, 500px"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── YOUTUBE — Pro & Studio ── */}
      {showYoutube && (
        <section className="px-6 py-16" style={{ background: C.cream }}>
          <div className="max-w-lg mx-auto">
            <SectionTitle sub="Video">Momen Spesial</SectionTitle>
            <div className="rounded-xl overflow-hidden aspect-video">
              <iframe
                src={c.youtube_url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video undangan"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── RSVP — Basic+ ── */}
      {isPaid && (
        <section className="px-6 py-16 max-w-lg mx-auto">
          <SectionTitle sub="Konfirmasi Kehadiran">RSVP</SectionTitle>
          <RSVP
            orderId={orderId}
            guestToken={searchParams.get('token') ?? undefined}
            guestName={guestName}
            accentColor={C.gold}
          />
        </section>
      )}

      {/* ── ANGPAO ── */}
      {isPaid && (
        <section className="px-6 py-16" style={{ background: C.cream }}>
          <div className="max-w-lg mx-auto">
            <SectionTitle sub="Hadiah Digital">Angpao</SectionTitle>
            <Angpao
              rekening={c.angpao.rekening}
              qrisUrl={c.angpao.qris_url}
              address={c.angpao.address}
            />
          </div>
        </section>
      )}

      {/* ── UCAPAN — Basic+ ── */}
      {isPaid && (
        <section className="px-6 py-16 max-w-lg mx-auto">
          <SectionTitle sub="Buku Tamu">Ucapan & Doa</SectionTitle>
          <GuestBook orderId={orderId} accentColor={C.gold} />
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer
        className="py-10 text-center text-[12px]"
        style={{ background: C.cream, color: C.textMuted }}
      >
        <p className="text-[11px] mb-1 uppercase tracking-[0.3em]">With love</p>
        <p className="text-[18px] font-medium mb-4" style={{ fontFamily: 'Georgia, serif', color: C.text }}>
          {c.bride?.name} & {c.groom?.name}
        </p>
        <Ornament className="max-w-37.5 mx-auto mb-4" />
        <p style={{ color: C.textMuted }}>
          Dibuat dengan{' '}
          <a href="https://invizoku.com" className="hover:underline" style={{ color: C.gold }}>
            Invizoku
          </a>
        </p>
      </footer>
    </div>
  )
}
