# PROGRESS.md — Tracking Development Invizoku

> Update file ini setiap kali menyelesaikan satu task. Tandai dengan [x] jika selesai, [ ] jika belum, [~] jika sedang dikerjakan.

---

## STATUS PROYEK

**Fase saat ini:** Fase 3 — Sistem Tema Undangan
**Terakhir diupdate:** 2026-06-27 (sesi 4)
**Developer:** Solo developer

---

## FASE 1 — SETUP & FONDASI

### 1.1 Inisialisasi Project
- [x] Buat project Next.js 15 dengan TypeScript dan Tailwind CSS (Next.js 16.2.9, React 19)
- [x] Setup ESLint + Prettier (dengan prettier-plugin-tailwindcss)
- [x] Setup struktur folder sesuai PROJECT.md bagian 3
- [x] Buat file `.env.local` dari template di PROJECT.md bagian 16
- [x] Push ke repository Git (github.com/septiyan79/invizoku)

### 1.2 Database
- [x] Buat akun dan project di Neon
- [x] Inisialisasi Prisma (v5.22.0 — downgrade dari v7 karena breaking change besar)
- [x] Buat schema Prisma sesuai PROJECT.md bagian 4 (+ password di users, + event_categories/style_tag di themes)
- [x] Jalankan migrasi pertama (20260624125153_init)
- [x] Seed data awal: 1 admin user + 6 starter theme

### 1.3 Autentikasi
- [x] Install dan konfigurasi NextAuth.js v5 (beta.31, JWT sessions, split config Edge/Node)
- [x] Setup credentials provider (email + password) — `auth.ts` + `auth.config.ts`
- [x] Buat halaman `/login`
- [x] Buat halaman `/register` (dengan field nomor WA wajib)
- [x] Buat halaman `/forgot-password`
- [x] Buat halaman `/reset-password`
- [x] Buat halaman `/verify-email`
- [x] Setup Resend untuk kirim email verifikasi & reset password (`lib/mail.ts`)
- [x] Implementasi middleware route guard (dashboard, admin, profil, checkout)
- [x] API routes: `/api/register`, `/api/auth/verify-email`, `/api/auth/forgot-password`, `/api/auth/reset-password`
- [x] Token JWT via `jose` dengan invalidasi token reset password (ph = 8 char terakhir hash)
- [x] NEXTAUTH_SECRET sudah di-generate dan diisi di `.env.local`

### 1.4 Setup Integrasi Eksternal
- [x] Buat akun Cloudinary, simpan credentials ke `.env`
- [x] Buat akun Midtrans Sandbox, simpan credentials ke `.env`
- [ ] Fonnte — ditunda, menunggu nomor WA baru aktif
- [x] Resend akun sudah ada, API key sudah diisi (`onboarding@resend.dev` untuk dev)
- [ ] Resend domain verification — ditunda, menunggu pembelian domain
- [x] Test koneksi Resend (email verifikasi & reset password berfungsi)

---

## FASE 2 — WEBSITE PUBLIK (MARKETING) ✅

### 2.1 Landing Page (`/`) ✅
- [x] Layout dan navigation publik (Navbar sticky + scroll border)
- [x] Hero section dengan CTA
- [x] Section cara kerja (HowItWorks)
- [x] Section showcase tema (ThemeShowcase)
- [x] Section paket & harga (Pricing — 4 paket dengan fitur & FAQ)
- [x] Section kenapa Invizoku (SocialProof — stats + why cards + local tags)
- [x] CTA final + Footer
- [x] Mobile responsive semua komponen
- [x] Navbar hamburger menu untuk mobile
- [x] Pricing cards horizontal scroll + snap di mobile

### 2.2 Katalog Tema (`/katalog`) ✅
- [x] Halaman daftar semua tema dengan grid
- [x] Filter per kategori acara (wedding, ulang tahun, aqiqah)
- [x] Filter per gaya (elegan, minimalis, islami, anime, eksklusif, dll)
- [x] Card tema dengan preview visual (gradient placeholder)
- [x] Tombol "Pilih tema" → /register
- [x] Filter: custom dropdown bertemakan brand di mobile, pill buttons di desktop

### 2.3 Halaman Harga (`/harga`) ✅
- [x] Tabel perbandingan 4 paket (Trial, Basic, Pro, Studio)
- [x] Highlight paket "Paling banyak dipilih" (Pro)
- [x] CTA per paket + trust badges + FAQ
- [x] Mobile: horizontal scroll cards

### 2.4 SEO & File Pendukung
- [ ] `app/sitemap.ts` — auto-generate sitemap
- [ ] `app/robots.ts` — blokir crawl area private
- [ ] `app/og/route.tsx` — dynamic OG image generator
- [ ] Favicon dan metadata global

---

## FASE 3 — SISTEM TEMA UNDANGAN

### 3.1 Infrastruktur Tema ✅
- [x] `types/invitation.ts` — InvitationData unified interface (semua field optional kecuali common), ThemeProps (sesuai PROMPT-info-template-workflow.md)
- [x] `components/themes/index.ts` — registry tema dengan dynamic import
- [x] `lib/music.ts` — config daftar musik (MusicTrack, musicLibrary, getMusicById)
- [x] `hooks/useCountdown.ts` — countdown ke target date
- [x] `hooks/useInvitation.ts` — save content ke /api/undangan/[orderId]
- [x] `components/theme-content/Countdown.tsx`
- [x] `components/theme-content/Gallery.tsx` — grid + lightbox
- [x] `components/theme-content/Maps.tsx` — Google Maps iframe
- [x] `components/theme-content/MusicPlayer.tsx` — floating button play/pause
- [x] `components/theme-content/Angpao.tsx` — rekening, QRIS, alamat kado
- [x] `components/theme-content/RSVP.tsx` — form hadir/tidak, submit ke /api/rsvp
- [x] `components/theme-content/GuestBook.tsx` — kirim & tampilkan ucapan
- [x] `components/theme-content/Watermark.tsx` — standalone, dipakai semua ThemeShell jika pkg === 'trial'
- [ ] `hooks/useUpload.ts` — upload foto ke Cloudinary (dibutuhkan saat editor)
- [ ] `hooks/useGuests.ts` — kelola daftar tamu (dibutuhkan saat dashboard)
- [ ] `hooks/useAssist.ts` — status terima beres (dibutuhkan saat dashboard)

### 3.2 Library Musik
- [x] `lib/music.ts` — config 8 track (id, judul, artis, url)
- [ ] Siapkan file audio `.mp3` bebas royalti di `public/music/` (manual — tidak bisa di-generate otomatis)

### 3.3 Tema Wedding Standar
- [x] `WeddingElegant` — ThemeShell contoh/referensi (dibuat sebelum HTML dari developer tiba, berfungsi sebagai panduan konversi HTML→TSX)
- [x] `WeddingElegant/schema.ts` — default content InvitationData sesuai DATA_WEDDING dari data-contoh.js
- [ ] `WeddingMinimalist` — menunggu HTML dari developer eksternal
- [ ] `WeddingRustic` — menunggu HTML dari developer eksternal

> **Catatan:** Sesuai PROMPT-info-template-workflow.md, ThemeShell baru TIDAK dibuat sampai file HTML dari developer eksternal diterima. WeddingElegant yang ada adalah contoh implementasi yang menunjukkan pola konversi.

### 3.4 Tema Lainnya
- [ ] `BirthdayFun` — tema ulang tahun standar
- [ ] `AqiqahSakura` — tema aqiqah/khitan
- [ ] `WeddingAnime` — tema eksklusif Pro & Studio

### 3.5 Halaman Output Undangan (`/undangan/[slug]`) ✅
- [x] ISR dengan `export const revalidate = 3600`
- [x] Dynamic import tema via registry + `next/dynamic`
- [x] Deteksi guest name dari `?nama=` param (client-side di ThemeShell)
- [x] Deteksi guest token dari `?token=` param (client-side di ThemeShell)
- [x] Watermark untuk paket trial (di ThemeShell)
- [x] 404 jika order tidak ada, expired, atau belum punya invitation
- [x] `noindex` robots meta — data pribadi tidak diindeks Google

---

## FASE 4 — CHECKOUT & PEMBAYARAN

### 4.1 Alur Checkout
- [ ] Halaman `checkout/[temaId]` — pilih paket + isi data pemesan
- [ ] Redirect ke login jika belum auth (simpan `callbackUrl`)
- [ ] Generate Midtrans payment token via `/api/checkout`
- [ ] Halaman `checkout/payment` — render Midtrans payment UI
- [ ] Halaman `checkout/success` — konfirmasi berhasil

### 4.2 Webhook Midtrans (`/api/webhook/midtrans`)
- [ ] Verifikasi signature SHA-512 (WAJIB, lihat PROJECT.md bagian 10)
- [ ] Handle `payment_type = "new_order"` — aktifkan order baru
- [ ] Handle `payment_type = "renewal"` — perpanjang masa aktif
- [ ] Handle `payment_type = "upgrade"` — upgrade paket
- [ ] Kirim notifikasi WA ke user via Fonnte setelah pembayaran berhasil

### 4.3 Paket Uji Coba (Trial)
- [ ] Cek apakah user pernah beli paket berbayar sebelumnya
- [ ] Jika belum pernah: aktifkan trial otomatis setelah register
- [ ] Buat order trial tanpa payment
- [ ] Batasi fitur sesuai ketentuan paket trial

---

## FASE 5 — DASHBOARD USER

### 5.1 Layout & Navigasi Dashboard
- [ ] Layout dashboard dengan sidebar navigasi
- [ ] Guard: redirect ke login jika belum auth

### 5.2 Halaman Utama Dashboard (`/dashboard`)
- [ ] Ringkasan status undangan (aktif/expired/trial)
- [ ] Info masa aktif + countdown expired
- [ ] Tombol aksi cepat (edit, lihat undangan, kelola tamu)
- [ ] Banner upgrade jika masih trial atau Basic

### 5.3 Editor Undangan (`/dashboard/edit/[orderId]`)
- [ ] Form isian data dasar sesuai schema JSONB tema
- [ ] Tab "Elemen" untuk upload foto, pilih musik, setting angpao
- [ ] Upload foto ke Cloudinary dengan validasi (tipe, ukuran, jumlah sesuai paket)
- [ ] Preview real-time perubahan
- [ ] Tombol "Publish" undangan
- [ ] Auto-revalidate ISR setelah save

### 5.4 Manajemen Tamu (`/dashboard/tamu/[orderId]`)
- [ ] Input daftar tamu (nama)
- [ ] Generate token unik per tamu
- [ ] Tampilkan link personal per tamu (`/undangan/[slug]?token=xxx`)
- [ ] Generate QR Code per tamu
- [ ] Lihat status RSVP per tamu
- [ ] Export daftar tamu + status RSVP

### 5.5 Halaman Bantuan Admin (`/dashboard/bantuan/[orderId]`)
- [ ] Form upload data + catatan ke admin (hanya Pro & Studio)
- [ ] Tampilkan status pengerjaan admin secara real-time
- [ ] Tombol "ACC" atau "Minta Revisi" saat status `waiting_review`
- [ ] Tampilkan sisa jatah revisi ("sisa revisi: X dari Y")
- [ ] Notifikasi saat admin selesai mengerjakan

### 5.6 Profil User
- [ ] Edit nama, nomor WA (`/profil`)
- [ ] Ganti password (`/profil/keamanan`)
- [ ] Toggle notifikasi RSVP & ucapan (`/profil/notifikasi`)

---

## FASE 6 — DASHBOARD ADMIN

### 6.1 Overview Order (`/admin`)
- [ ] Tabel semua order: status, paket, user, tanggal
- [ ] Filter: status, paket, assist_status
- [ ] Badge khusus untuk order yang butuh perhatian (SLA warning, waiting_review)
- [ ] Urutan Studio (prioritas) di atas Pro untuk antrian terima beres

### 6.2 Editor Order Admin (`/admin/order/[orderId]`)
- [ ] Edit semua field undangan atas nama user
- [ ] Upload foto atas nama user
- [ ] Tombol "Selesai Dikerjakan" → ubah `assist_status` ke `waiting_review`
- [ ] Kirim notifikasi WA ke user otomatis

### 6.3 Kelola Tema (`/admin/tema`)
- [ ] Tambah tema baru (nama, kategori, tipe, component_key, upload preview)
- [ ] Aktifkan / nonaktifkan tema
- [ ] Edit metadata tema

### 6.4 Kelola User (`/admin/users`)
- [ ] Daftar semua user dengan pencarian
- [ ] Detail user: profil + riwayat order
- [ ] Suspend / aktifkan akun user

---

## FASE 7 — SISTEM EXPIRY & CRON

### 7.1 Vercel Cron Job (jam 02.00 WIB / 19.00 UTC)
- [ ] Setup Vercel Cron di `vercel.json`
- [ ] Cek order dengan `expires_at <= now() + 14 hari` → kirim notif H-14
- [ ] Cek order dengan `expires_at <= now() + 1 hari` → kirim notif H-1
- [ ] Cek order yang sudah expired → ubah status ke `expired`
- [ ] Cleanup media Cloudinary untuk order expired
- [ ] Cek tiket terima beres yang sudah 2x24 jam belum selesai → kirim warning ke admin
- [ ] Hapus permanen data order yang sudah 30 hari sejak expired

### 7.2 Halaman 404 Undangan Expired
- [ ] Cek `status === 'expired'` di `undangan/[slug]/page.tsx`
- [ ] Return `notFound()` dari Next.js

---

## FASE 8 — SEO & PERFORMA

- [ ] Audit semua halaman publik: meta title, description, OG image
- [ ] Test dynamic OG image generator
- [ ] Submit sitemap ke Google Search Console
- [ ] Lighthouse audit: target score > 90 untuk halaman undangan
- [ ] Test ISR: pastikan halaman undangan update setelah edit

---

## FASE 9 — TESTING & LAUNCH

### 9.1 Testing
- [ ] Test full flow pembelian di Midtrans Sandbox
- [ ] Test webhook dengan berbagai skenario (new_order, renewal, upgrade)
- [ ] Test verifikasi signature webhook
- [ ] Test notifikasi Fonnte WA
- [ ] Test expiry dan cleanup Cloudinary
- [ ] Test semua mode akses undangan (generik, simpel, lengkap)
- [ ] Test di mobile (prioritas — target user Indonesia)
- [ ] Test edge case: upgrade dari trial, downgrade, perpanjang setelah expired

### 9.2 Pre-launch Checklist
- [ ] Ganti Midtrans Sandbox ke Production
- [ ] Setup domain dan DNS
- [ ] Verifikasi domain di Resend
- [ ] Setup nomor WA khusus untuk Fonnte (bukan nomor pribadi)
- [ ] Set semua environment variables di Vercel production
- [ ] Final review robots.txt dan sitemap
- [ ] Backup prosedur database

---

## CATATAN DEVELOPER

> Gunakan bagian ini untuk mencatat keputusan teknis yang dibuat selama development, bug yang ditemukan, atau hal-hal yang perlu diingat.

```
2026-06-24 - Prisma 7 memiliki breaking change besar (hapus url/directUrl dari schema, wajib prisma.config.ts + driver adapter). Solusi: downgrade ke Prisma 5.22.0.
2026-06-24 - dotenv-cli diinstall untuk load .env.local ke semua perintah prisma CLI (Prisma 7 juga hapus --env-file flag).
2026-06-24 - Fase 1.3: NextAuth split config (auth.config.ts untuk Edge middleware, auth.ts untuk Node.js dengan Prisma). Token reset password menggunakan 8 char terakhir bcrypt hash sebagai invalidation marker — tidak butuh tabel DB terpisah.
2026-06-24 - Folder path dengan [brackets] di PowerShell perlu .NET IO method: [System.IO.File]::WriteAllText(). PS treats [] as regex wildcard.
2026-06-25 - Next.js 16.2.9 wajib Turbopack → laptop hang RAM. Solusi: downgrade ke Next.js 15.5.19 (webpack default, --no-turbopack tidak diperlukan).
2026-06-25 - Next.js 16 deprecated middleware.ts, gunakan proxy.ts. Setelah downgrade ke v15, kembali ke middleware.ts biasa.
2026-06-25 - Resend: sender domain invizoku.com belum diverifikasi. Gunakan onboarding@resend.dev saat development. Ganti setelah domain dibeli.
2026-06-27 - Tailwind CSS v4: class arbitrary value seperti max-w-[200px] ditulis max-w-50, flex-shrink-0 → shrink-0, pl-[15px] → pl-3.75.
2026-06-27 - Tabler Icons: pakai CSS webfont approach (@tabler/icons-webfont), bukan React components. Import di app/layout.tsx, render via <i className="ti ti-*">.
2026-06-27 - Sesuai PROMPT-info-template-workflow.md: InvitationData dibuat sebagai satu unified interface (semua field optional kecuali common fields). WeddingContent/BirthdayContent/AqiqahContent dihapus dan digabung. ThemeShell baru tunggu HTML dari developer eksternal.
```

---

## FITUR DITUNDA (PASCA-LAUNCH)

- [ ] QR Code check-in tamu di venue (butuh tambah field `checked_in_at` di tabel `guests`)
- [ ] Dashboard reseller / multi-klien
- [ ] Harga upgrade antar paket (finalisasi angka)
- [ ] Migrasi Fonnte ke WhatsApp Cloud API resmi Meta (saat traffic besar)
