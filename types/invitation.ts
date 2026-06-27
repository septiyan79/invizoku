// ─── JSONB content schemas — mengacu ke DATA CONTOH/data-contoh.js ──────────

export interface WeddingContent {
  bride: { name: string; parents: string }
  groom: { name: string; parents: string }
  akad: { date: string; time: string; venue: string; address: string; maps_url: string }
  resepsi: { date: string; time: string; venue: string; address: string; maps_url: string }
  countdown_target: string  // ISO 8601 — biasanya tanggal & jam akad
  cover_photo: string
  gallery: string[]         // URL Cloudinary; jumlah max sesuai paket
  love_story: { photo: string; caption: string; date: string }[]  // kosong = sembunyikan
  music_id: string          // id dari lib/music.ts
  youtube_url: string       // kosong = sembunyikan
  angpao: {
    rekening: { bank: string; no: string; name: string }[]  // kosong = sembunyikan
    qris_url: string        // kosong = sembunyikan
    address: string         // kosong = sembunyikan
  }
}

export interface BirthdayContent {
  celebrant_name: string    // nama yang berulang tahun
  age: number
  event: { date: string; time: string; venue: string; address: string; maps_url: string }
  countdown_target: string
  cover_photo: string
  gallery: string[]
  love_story: []            // selalu kosong untuk ulang tahun
  music_id: string
  youtube_url: string       // kosong = sembunyikan
  angpao: {
    rekening: { bank: string; no: string; name: string }[]
    qris_url: string
    address: string
  }
}

export interface AqiqahContent {
  child_name: string
  child_gender: 'laki-laki' | 'perempuan'
  event_type: 'aqiqah' | 'khitan'
  parents: string
  event: { date: string; time: string; venue: string; address: string; maps_url: string }
  countdown_target: string
  cover_photo: string
  gallery: string[]
  love_story: []            // selalu kosong
  music_id: string
  youtube_url: string       // kosong = sembunyikan
  angpao: {
    rekening: { bank: string; no: string; name: string }[]
    qris_url: string
    address: string
  }
}

export type InvitationContent = WeddingContent | BirthdayContent | AqiqahContent

// ─── Package & mode ─────────────────────────────────────────────────────────

export type PackageType = 'trial' | 'basic' | 'pro' | 'studio'
export type GuestMode = 'generic' | 'simple' | 'token'

// ─── ThemeProps — props standar semua ThemeShell component ──────────────────

export interface ThemeProps {
  content: InvitationContent
  pkg: PackageType
  slug: string
  orderId: string
  // guest info — diisi client-side dari URL params
  guestName?: string
  guestToken?: string
}
