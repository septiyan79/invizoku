# PROGRESS.md — Tracking Development Invizoku

> Update file ini setiap kali menyelesaikan satu task. Tandai dengan [x] jika selesai, [ ] jika belum, [~] jika sedang dikerjakan.

---

## STATUS PROYEK

**Fase saat ini:** Fase 1 — Setup & Fondasi
**Terakhir diupdate:** 2026-06-24
**Developer:** Solo developer

---

## FASE 1 — SETUP & FONDASI

### 1.1 Inisialisasi Project
- [x] Buat project Next.js 15 dengan TypeScript dan Tailwind CSS (Next.js 16.2.9, React 19)
- [x] Setup ESLint + Prettier (dengan prettier-plugin-tailwindcss)
- [x] Setup struktur folder sesuai PROJECT.md bagian 3
- [x] Buat file `.env.local` dari template di PROJECT.md bagian 16
- [ ] Push ke repository Git (repo lokal siap, remote belum dikonfigurasi)

### 1.2 Database
- [ ] Buat akun dan project di Neon (manual — isi DATABASE_URL & DATABASE_URL_UNPOOLED di .env.local)
- [x] Inisialisasi Prisma (schema dibuat manual, v7.8.0)
- [x] Buat schema Prisma sesuai PROJECT.md bagian 4 (+ field password di users, + component_key unique di themes)
- [ ] Jalankan migrasi pertama (`npm run db:migrate -- --name init`)
- [ ] Seed data awal: admin user, tema-tema awal (`npm run db:seed`)

### 1.3 Autentikasi
- [ ] Install dan konfigurasi NextAuth.js v5
- [ ] Setup credentials provider (email + password)
- [ ] Buat halaman `/login`
- [ ] Buat halaman `/register` (dengan field nomor WA wajib)
- [ ] Buat halaman `/forgot-password`
- [ ] Buat halaman `/reset-password`
- [ ] Buat halaman `/verify-email`
- [ ] Setup Resend untuk kirim email verifikasi & reset password
- [ ] Implementasi middleware route guard (dashboard, admin)

### 1.4 Setup Integrasi Eksternal
- [ ] Buat akun Cloudinary, simpan credentials ke `.env`
- [ ] Buat akun Midtrans Sandbox, simpan credentials ke `.env`
- [ ] Buat akun Fonnte, simpan API key ke `.env`
- [ ] Buat akun Resend, verifikasi domain, simpan API key ke `.env`
- [ ] Test koneksi semua integrasi

---

## FASE 2 — WEBSITE PUBLIK (MARKETING)

### 2.1 Landing Page (`/`)
- [ ] Layout dan navigation publik
- [ ] Hero section dengan CTA
- [ ] Section fitur unggulan
- [ ] Section paket & harga (ringkasan)
- [ ] Section testimoni (placeholder dulu)
- [ ] Section FAQ
- [ ] Footer
- [ ] Meta tags & structured data (WebSite schema)

### 2.2 Katalog Tema (`/katalog`)
- [ ] Halaman daftar semua tema
- [ ] Filter per kategori (wedding, ulang tahun, aqiqah, dll)
- [ ] Filter per tipe (standar, eksklusif)
- [ ] Card tema dengan preview image
- [ ] Tombol "Lihat Preview" dan "Pilih Tema"
- [ ] Meta tags per kategori

### 2.3 Halaman Harga (`/harga`)
- [ ] Tabel perbandingan 4 paket (Trial, Basic, Pro, Studio)
- [ ] Highlight paket "Paling Laku" (Pro)
- [ ] CTA per paket
- [ ] Structured data (Offer + FAQ schema)

### 2.4 SEO & File Pendukung
- [ ] `app/sitemap.ts` — auto-generate sitemap
- [ ] `app/robots.ts` — blokir crawl area private
- [ ] `app/og/route.tsx` — dynamic OG image generator
- [ ] Favicon dan metadata global

---

## FASE 3 — SISTEM TEMA UNDANGAN

### 3.1 Infrastruktur Tema
- [ ] Buat `components/themes/index.ts` — registry tema
- [ ] Definisi TypeScript interface `ThemeProps`
- [ ] Buat `components/theme-content/` — komponen reusable:
  - [ ] `Countdown.tsx`
  - [ ] `Gallery.tsx`
  - [ ] `RSVP.tsx`
  - [ ] `GuestBook.tsx`
  - [ ] `Maps.tsx`
  - [ ] `MusicPlayer.tsx`
  - [ ] `Angpao.tsx`
- [ ] Custom hooks:
  - [ ] `useCountdown.ts`
  - [ ] `useInvitation.ts`
  - [ ] `useUpload.ts`
  - [ ] `useGuests.ts`
  - [ ] `useAssist.ts`

### 3.2 Library Musik
- [ ] Siapkan 10–20 file audio bebas royalti
- [ ] Simpan sebagai static asset di `public/music/`
- [ ] Buat config daftar musik (id, judul, artis, url)

### 3.3 Tema Wedding Standar (prioritas pertama)
- [ ] Buat tema `WeddingElegant` — ThemeShell + schema JSONB
- [ ] Buat tema `WeddingMinimalist`
- [ ] Test render dengan data dummy

### 3.4 Tema Lainnya
- [ ] Tema ulang tahun standar
- [ ] Tema aqiqah/khitan standar
- [ ] Tema wedding eksklusif (anime/kartun) — Pro & Studio
- [ ] Tambah tema sesuai kebutuhan

### 3.5 Halaman Output Undangan (`/undangan/[slug]`)
- [ ] ISR setup dengan `revalidatePath`
- [ ] Deteksi mode akses: generik / simpel (?nama=) / lengkap (?token=)
- [ ] Render ThemeShell + ThemeContent dinamis berdasarkan `component_key`
- [ ] Watermark untuk paket trial
- [ ] Halaman 404 untuk undangan expired atau tidak ditemukan
- [ ] OG meta tags untuk preview WhatsApp

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
[Tanggal] - [Catatan]
```

---

## FITUR DITUNDA (PASCA-LAUNCH)

- [ ] QR Code check-in tamu di venue (butuh tambah field `checked_in_at` di tabel `guests`)
- [ ] Dashboard reseller / multi-klien
- [ ] Harga upgrade antar paket (finalisasi angka)
- [ ] Migrasi Fonnte ke WhatsApp Cloud API resmi Meta (saat traffic besar)
