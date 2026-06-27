# Prompt: Konversi Template HTML → ThemeShell TSX

Gunakan prompt ini saat mendapat file HTML tema baru dari developer eksternal.

---

## CARA PAKAI

1. Taruh folder tema dari developer di `TEMA-HTML/nama-tema/`
2. Buka sesi Claude Code baru
3. Paste prompt di bawah ke Claude, lalu tambahkan nama tema yang akan dikonversi

---

## PROMPT

```
Saya ingin mengkonversi template tema undangan HTML ke dalam ThemeShell TSX untuk project Invizoku.

File HTML ada di: TEMA-HTML/[NAMA-TEMA]/
Target output: components/themes/[NAMA-COMPONENT]/index.tsx

Sebelum mulai, baca dulu:
1. docs/PROJECT.md bagian 6 — arsitektur komponen tema dan interface InvitationData
2. components/themes/WeddingElegant/index.tsx — contoh ThemeShell yang sudah jadi
3. File HTML yang akan dikonversi: TEMA-HTML/[NAMA-TEMA]/index.html, style.css, script.js

Aturan konversi:
- Semua data undangan dari object DATA di script.js → diganti dengan props `content: InvitationData`
- Akses field pakai optional chaining: content.bride?.name, content.akad?.date, dst.
- Countdown → import Countdown dari @/components/theme-content/Countdown
- Galeri foto → import Gallery dari @/components/theme-content/Gallery
- RSVP → import RSVP dari @/components/theme-content/RSVP
- Buku tamu → import GuestBook dari @/components/theme-content/GuestBook
- Maps → import Maps dari @/components/theme-content/Maps
- Musik → import MusicPlayer dari @/components/theme-content/MusicPlayer
- Angpao → import Angpao dari @/components/theme-content/Angpao
- Watermark (trial) → import Watermark dari @/components/theme-content/Watermark, tampilkan jika pkg === 'trial'
- Semua URL Cloudinary: tambahkan `?f_auto,q_auto` di akhir
- show_watermark di DATA → diganti dengan `pkg === 'trial'`
- guest_name dari DATA → dari searchParams.get('nama') di client component
- music dari DATA (path file) → diganti music_id referensi lib/music.ts
- show/hide section: love_story (array kosong), youtube_url (string kosong), angpao sub-fields (kosong)
- Fitur per paket: pkg === 'trial', pkg !== 'trial', pkg === 'pro' || pkg === 'studio'

Setelah ThemeShell selesai:
1. Buat juga components/themes/[NAMA-COMPONENT]/schema.ts dengan default content
2. Daftarkan di components/themes/index.ts registry
3. Update docs/PROGRESS.md — tandai tema sebagai selesai
```

---

## REFERENSI CEPAT — FITUR PER PAKET

| Fitur                  | Trial | Basic | Pro | Studio |
|------------------------|-------|-------|-----|--------|
| Musik, Maps, Countdown | ✗     | ✓     | ✓   | ✓      |
| RSVP, Buku tamu        | ✗     | ✓     | ✓   | ✓      |
| Angpao                 | ✗     | ✓     | ✓   | ✓      |
| Galeri foto            | 2*    | 10    | 30  | ∞      |
| Love story             | ✗     | ✗     | ✓   | ✓      |
| Embed YouTube          | ✗     | ✗     | ✓   | ✓      |
| Watermark              | ✓     | ✗     | ✗   | ✗      |

*Trial: galeri tampil tapi dibatasi 2 foto (batas di editor, bukan di ThemeShell)

## REFERENSI CEPAT — POLA KODE

```typescript
// Cek paket
const isPaid = pkg !== 'trial'
const isPro  = pkg === 'pro' || pkg === 'studio'

// Guest name dari URL
const guestName = searchParams.get('nama') ?? undefined  // 'use client' + useSearchParams()

// Show/hide berdasarkan data
const showLoveStory = isPro && c.love_story && c.love_story.length > 0
const showYoutube   = isPro && !!c.youtube_url

// Akses optional field
c.bride?.name
c.akad?.date
c.resepsi?.maps_url

// Cloudinary URL
`${c.cover_photo}?f_auto,q_auto`
```
