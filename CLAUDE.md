# CLAUDE.md — Konteks Otomatis untuk Claude Code
# Proyek: Invizoku

> File ini dibaca otomatis setiap sesi baru. Berisi orientasi cepat proyek.
> Untuk detail lengkap: baca PROJECT.md. Untuk status task: baca PROGRESS.md.

---

## INI PROYEK APA?

**Invizoku** — website penjualan undangan digital untuk pasar Indonesia (B2C).
Dibangun solo oleh satu developer dengan bantuan AI.

**Fitur utama yang membedakan dari kompetitor:**
- Checkout otomatis (tanpa WA manual)
- Self-edit undangan via dashboard
- Jalur "terima beres" — dibantu admin
- Uji coba gratis sebelum beli

---

## STACK TEKNOLOGI

```
Framework   : Next.js 15 App Router + TypeScript + Tailwind CSS
ORM         : Prisma
Auth        : NextAuth.js v5
Validasi    : Zod
Database    : Neon (PostgreSQL serverless)
Media       : Cloudinary (foto saja, maks 5MB, JPG/PNG/WEBP)
Payment     : Midtrans (gunakan Sandbox saat development)
Notif WA    : Fonnte
Email       : Resend (hanya verifikasi email & reset password)
Deploy      : Vercel
Cron        : Vercel Cron (jam 02.00 WIB / 19.00 UTC)
```

---

## STRUKTUR FOLDER UTAMA

```
app/
├── (marketing)/     # Landing page, katalog tema, harga — publik
├── (auth)/          # Login, register, forgot/reset password, verify email
├── profil/          # Edit profil, keamanan, preferensi notifikasi
├── checkout/        # Alur beli: pilih paket → payment → success
├── dashboard/       # Area user: edit undangan, kelola tamu, terima beres
├── admin/           # Area admin: kelola order, tema, user
├── undangan/[slug]/ # Output undangan untuk tamu (ISR)
├── api/             # Route handlers semua endpoint
├── sitemap.ts
├── robots.ts
└── og/route.tsx     # Dynamic OG image
```

---

## PAKET YANG DIJUAL

| Paket    | Harga    | Masa Aktif | Terima Beres |
|----------|----------|------------|--------------|
| Trial    | Gratis   | Tanpa batas| ✗ (tidak bisa disebar, watermark) |
| Basic    | Rp 79rb  | 6 bulan    | ✗            |
| Pro      | Rp 149rb | 6 bulan    | ✓ (1x revisi)|
| Studio   | Rp 199rb | 1 tahun    | ✓ (3x revisi, prioritas) |

**Aturan penting:**
- Trial hanya untuk user yang belum pernah beli paket apapun
- Upgrade bisa, downgrade hanya untuk order berikutnya
- Expired → 404, data ditahan 30 hari lalu dihapus permanen

---

## ATURAN PENTING YANG TIDAK BOLEH DILUPAKAN

1. **Verifikasi signature Midtrans WAJIB** di setiap webhook request:
   ```typescript
   SHA512(order_id + status_code + gross_amount + MIDTRANS_SERVER_KEY)
   ```
   Tolak 403 jika tidak cocok. Detail implementasi di PROJECT.md bagian 10.

2. **Nomor WA user wajib diisi saat register** — semua notifikasi bergantung ini.

3. **ISR halaman undangan** — selalu panggil `revalidatePath('/undangan/[slug]')`
   setiap kali konten undangan diupdate atau perpanjangan berhasil.

4. **Perpanjangan masa aktif** — hitung dari `expires_at` lama, bukan `now()`.

5. **Cloudinary URL** — selalu tambahkan `f_auto,q_auto` di semua URL media.

6. **Paket trial** — cek riwayat order user sebelum aktifkan, hanya boleh sekali.

7. **QR Code check-in tamu** — DITUNDA pasca-launch, jangan implementasi dulu.

8. **Harga upgrade antar paket** — belum final, buat sebagai config tersendiri.

9. **Musik latar** — library bawaan sebagai static asset di `public/music/`, bukan upload user.

10. **Rate limiting** — wajib ada di `/api/rsvp` dan `/api/ucapan` (rawan spam).

---

## CARA KERJA SISTEM TAMU

```
/undangan/[slug]              → Link generik (tanpa nama)
/undangan/[slug]?nama=Budi    → Mode simpel (nama dari URL, tanpa DB)
/undangan/[slug]?token=abc123 → Mode lengkap (nama dari DB, RSVP tracking aktif)
```

RSVP hanya aktif di mode token. Satu halaman mendeteksi mode otomatis.

---

## CARA KERJA WEBHOOK MIDTRANS

Baca `metadata.payment_type` untuk bedakan jenis transaksi:
- `"new_order"` → buat order baru, set `expires_at`
- `"renewal"` → update `expires_at` dari nilai lama + durasi paket
- `"upgrade"` → update `package` + hitung ulang `expires_at` dari tanggal upgrade

---

## NOTIFIKASI (SEMUA VIA FONNTE WA)

**Aktif by default:** pembayaran berhasil, undangan publish, terima beres selesai,
H-14 & H-1 sebelum expired, perpanjangan berhasil, notif ke admin.

**Default OFF (user bisa aktifkan):** notif per RSVP tamu, notif per ucapan tamu.

Email via Resend: hanya untuk verifikasi akun & reset password.

---

## STATUS DEVELOPMENT SAAT INI

Baca **PROGRESS.md** untuk status lengkap semua task per fase.

Untuk memulai atau melanjutkan task:
1. Buka `PROGRESS.md`
2. Cari task dengan status `[ ]` atau `[~]` di fase terendah yang belum selesai
3. Baca bagian relevan di `PROJECT.md` sebelum mulai coding
4. Update `PROGRESS.md` setelah selesai ([ ] → [x])

---

## ENVIRONMENT VARIABLES YANG DIBUTUHKAN

Lihat template lengkap di **PROJECT.md bagian 16**.
Pastikan `.env.local` sudah ada sebelum menjalankan development server.

---

## PERINTAH DEVELOPMENT

```bash
npm run dev          # Jalankan development server
npx prisma studio    # Buka Prisma GUI untuk inspect database
npx prisma migrate dev --name <nama>  # Buat migrasi baru
npx prisma generate  # Generate Prisma client setelah ubah schema
```

---

*Untuk detail lengkap apapun → PROJECT.md*
*Untuk status task → PROGRESS.md*
