// ─── Unified JSONB content schema — satu interface untuk semua kategori tema ──
// Field kategori spesifik dibuat optional; ThemeShell menggunakan field yang relevan.

export interface InvitationData {
  // ── Wedding ──
  bride?: { name: string; parents: string }
  groom?: { name: string; parents: string }
  akad?: { date: string; time: string; venue: string; address: string; maps_url: string }
  resepsi?: { date: string; time: string; venue: string; address: string; maps_url: string }

  // ── Birthday ──
  name?: string  // nama yang berulang tahun
  age?: number

  // ── Aqiqah / Khitan ──
  child_name?: string
  child_gender?: 'laki-laki' | 'perempuan'
  event_type?: 'aqiqah' | 'khitan'
  parents?: string

  // ── Birthday, Aqiqah, Khitan ──
  event?: { date: string; time: string; venue: string; address: string; maps_url: string }

  // ── Common — semua kategori ──
  countdown_target: string
  cover_photo: string
  gallery: string[]
  love_story: { photo: string; caption: string; date: string }[]
  music_id: string
  youtube_url: string
  angpao: {
    rekening: { bank: string; no: string; name: string }[]
    qris_url: string
    address: string
  }
}

// ─── Package & mode ─────────────────────────────────────────────────────────

export type PackageType = 'trial' | 'basic' | 'pro' | 'studio'
export type GuestMode = 'generic' | 'simple' | 'token'

// ─── ThemeProps — props standar semua ThemeShell component ──────────────────

export interface ThemeProps {
  content: InvitationData
  pkg: PackageType
  slug: string
  orderId: string
  guestName?: string
  guestToken?: string
}
