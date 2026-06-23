# PROJECT.md — Dokumentasi Proyek Invizoku
> **Invizoku** — Website Penjualan Undangan Digital

> Dokumen ini adalah referensi utama untuk development. Baca seluruh dokumen sebelum memulai coding. Setiap keputusan arsitektur di sini sudah final dan disetujui.

---

## 1. GAMBARAN PROYEK

Website penjualan undangan digital berbasis Next.js yang memungkinkan user membeli, mengedit, dan menyebarkan undangan digital secara mandiri (self-edit) atau dengan bantuan admin (terima beres). Target pasar adalah end user langsung (B2C) di Indonesia.

**Keunggulan utama vs kompetitor:**
- Checkout otomatis tanpa proses manual via WhatsApp
- Live preview undangan sebelum bayar
- Dua jalur pengerjaan: self-edit mandiri atau terima beres dibantu admin
- Sistem uji coba gratis sebelum beli

---

## 2. STACK TEKNOLOGI

```
Frontend & Framework : Next.js 15 (App Router) + TypeScript + Tailwind CSS
ORM                  : Prisma
Auth                 : NextAuth.js v5
Validasi             : Zod
State Management     : Zustand
Form                 : React Hook Form
Database             : Neon (PostgreSQL serverless)
Media Storage        : Cloudinary (foto saja, maks. 5MB/file, format JPG/PNG/WEBP)
Payment Gateway      : Midtrans (Sandbox untuk development, Production untuk live)
Notifikasi WA        : Fonnte
Email                : Resend (hanya untuk verifikasi email & reset password)
Deployment           : Vercel
Cron Job             : Vercel Cron
```

---

## 3. STRUKTUR FOLDER

```
app/
├── (marketing)/               # Website publik — tidak perlu auth
│   ├── page.tsx               # Landing page
│   ├── katalog/
│   │   └── page.tsx           # Katalog semua tema undangan
│   └── harga/
│       └── page.tsx           # Halaman paket & harga
│
├── (auth)/                    # Autentikasi
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   └── verify-email/page.tsx
│
├── profil/                    # Area user yang login
│   ├── layout.tsx             # Guard: wajib login
│   ├── page.tsx               # Edit profil (nama, foto, no. HP WA)
│   ├── keamanan/page.tsx      # Ganti password, kelola sesi
│   └── notifikasi/page.tsx    # Preferensi notifikasi WA
│
├── checkout/                  # Alur pembelian
│   ├── [temaId]/page.tsx      # Pilih paket, isi data pemesan
│   ├── payment/page.tsx       # Redirect ke Midtrans
│   └── success/page.tsx       # Konfirmasi pembayaran berhasil
│
├── dashboard/                 # Area user setelah beli
│   ├── layout.tsx             # Guard: wajib login + punya order aktif
│   ├── page.tsx               # Ringkasan undangan user
│   ├── edit/[orderId]/
│   │   ├── page.tsx           # Form isian data dasar acara
│   │   └── elemen/page.tsx    # Editor elemen (foto, musik, angpao, dsb)
│   ├── tamu/[orderId]/
│   │   └── page.tsx           # Kelola daftar tamu & status RSVP
│   └── bantuan/[orderId]/
│       └── page.tsx           # Form minta bantuan admin (terima beres)
│
├── admin/                     # Area admin internal
│   ├── layout.tsx             # Guard: wajib login + role admin
│   ├── page.tsx               # Overview semua order masuk
│   ├── order/[orderId]/
│   │   └── page.tsx           # Edit undangan atas nama user
│   ├── tema/
│   │   └── page.tsx           # Kelola & tambah koleksi tema
│   └── users/
│       ├── page.tsx           # Daftar semua user, cari & filter
│       └── [userId]/page.tsx  # Detail user, riwayat order, suspend akun
│
├── undangan/[slug]/           # Output undangan untuk tamu (ISR)
│   └── page.tsx               # Render tema + data dari DB
│
├── api/                       # Route handlers
│   ├── checkout/route.ts      # Buat order, generate Midtrans token
│   ├── webhook/
│   │   └── midtrans/route.ts  # Terima callback pembayaran
│   ├── undangan/
│   │   └── [orderId]/route.ts # GET & PATCH data undangan
│   ├── rsvp/route.ts          # Tamu submit RSVP
│   ├── ucapan/route.ts        # Tamu kirim ucapan buku tamu
│   ├── bantuan/route.ts       # Buat tiket terima beres
│   ├── profil/route.ts        # GET & PATCH profil user
│   ├── auth/
│   │   ├── verify-email/route.ts
│   │   └── reset-password/route.ts
│   └── upgrade/route.ts       # Proses upgrade paket
│
├── sitemap.ts                 # Auto-generate sitemap.xml
├── robots.ts                  # Atur crawl rules Google
└── og/route.tsx               # Dynamic OG image generator
```

---

## 4. SKEMA DATABASE (POSTGRESQL)

### Tabel `users`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
email           VARCHAR UNIQUE NOT NULL
name            VARCHAR NOT NULL
phone_wa        VARCHAR NOT NULL        -- nomor WA wajib diisi saat register
role            ENUM('user', 'admin') DEFAULT 'user'
email_verified  BOOLEAN DEFAULT false
notif_rsvp      BOOLEAN DEFAULT false   -- notif WA per RSVP tamu (default off)
notif_ucapan    BOOLEAN DEFAULT false   -- notif WA per ucapan tamu (default off)
created_at      TIMESTAMP DEFAULT now()
```

### Tabel `themes`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
name            VARCHAR NOT NULL
category        VARCHAR NOT NULL        -- 'wedding', 'birthday', 'aqiqah', dll
type            ENUM('standard', 'exclusive') DEFAULT 'standard'
component_key   VARCHAR NOT NULL        -- nama React component, e.g. 'WeddingElegant'
preview_url     VARCHAR                 -- thumbnail untuk katalog (Cloudinary)
og_url          VARCHAR                 -- OG image untuk share (Cloudinary)
is_active       BOOLEAN DEFAULT true
created_at      TIMESTAMP DEFAULT now()
```

### Tabel `orders`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
user_id         UUID REFERENCES users(id)
theme_id        UUID REFERENCES themes(id)
package         ENUM('trial', 'basic', 'pro', 'studio') NOT NULL
status          ENUM('pending', 'active', 'expired') DEFAULT 'pending'
payment_id      VARCHAR                 -- transaction ID dari Midtrans
slug            VARCHAR UNIQUE NOT NULL -- URL undangan, e.g. 'pernikahan-budi-ani'
assist_status   ENUM('idle', 'waiting_admin', 'in_progress', 'waiting_review', 'done') DEFAULT 'idle'
revision_count  INT DEFAULT 0           -- jumlah revisi yang sudah dipakai
expires_at      TIMESTAMP               -- null untuk paket trial
created_at      TIMESTAMP DEFAULT now()
upgraded_from   ENUM('trial', 'basic', 'pro') -- paket sebelum upgrade, nullable
upgraded_at     TIMESTAMP               -- waktu upgrade, nullable
```

### Tabel `invitations`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_id        UUID REFERENCES orders(id) UNIQUE
content         JSONB NOT NULL          -- data undangan, struktur berbeda per tema
published_at    TIMESTAMP               -- null jika belum dipublikasi
updated_at      TIMESTAMP DEFAULT now()
```

### Tabel `guests`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_id        UUID REFERENCES orders(id)
name            VARCHAR NOT NULL
token           VARCHAR UNIQUE NOT NULL -- untuk link personal /undangan/[slug]?token=xxx
rsvp_status     ENUM('pending', 'hadir', 'tidak') DEFAULT 'pending'
rsvp_at         TIMESTAMP               -- waktu submit RSVP
created_at      TIMESTAMP DEFAULT now()
-- catatan: field checked_in_at (untuk QR check-in) ditambahkan pasca-launch
```

### Tabel `messages`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_id        UUID REFERENCES orders(id)
guest_name      VARCHAR NOT NULL
content         TEXT NOT NULL
created_at      TIMESTAMP DEFAULT now()
```

### Tabel `assist_tickets`
```sql
id              UUID PRIMARY KEY DEFAULT gen_random_uuid()
order_id        UUID REFERENCES orders(id)
notes           TEXT                    -- catatan dari user ke admin
status          ENUM('open', 'in_progress', 'waiting_review', 'closed') DEFAULT 'open'
revision_note   TEXT                    -- catatan revisi dari user
created_at      TIMESTAMP DEFAULT now()
updated_at      TIMESTAMP DEFAULT now()
```

---

## 5. SKEMA JSONB PER KATEGORI TEMA

Field `content` di tabel `invitations` berisi JSONB yang strukturnya berbeda per kategori tema. Ini memungkinkan penambahan tema baru tanpa migrasi schema.

### Tema Wedding
```json
{
  "bride": { "name": "", "parents": "" },
  "groom": { "name": "", "parents": "" },
  "akad": { "date": "", "time": "", "venue": "", "address": "", "maps_url": "" },
  "resepsi": { "date": "", "time": "", "venue": "", "address": "", "maps_url": "" },
  "gallery": ["cloudinary_url_1", "cloudinary_url_2"],
  "cover_photo": "cloudinary_url",
  "love_story": [{ "photo": "", "caption": "", "date": "" }],
  "music_id": "music_001",
  "youtube_url": "",
  "angpao": { "rekening": [{ "bank": "", "no": "", "name": "" }], "qris_url": "", "address": "" }
}
```

### Tema Ulang Tahun
```json
{
  "name": "",
  "age": 0,
  "event": { "date": "", "time": "", "venue": "", "address": "", "maps_url": "" },
  "gallery": [],
  "cover_photo": "",
  "music_id": "music_001",
  "youtube_url": "",
  "angpao": { "rekening": [], "qris_url": "", "address": "" }
}
```

### Tema Aqiqah / Khitan
```json
{
  "child_name": "",
  "parents": "",
  "event": { "date": "", "time": "", "venue": "", "address": "", "maps_url": "" },
  "gallery": [],
  "cover_photo": "",
  "music_id": "music_001",
  "angpao": { "rekening": [], "qris_url": "", "address": "" }
}
```

> Untuk tema eksklusif (anime, kartun), struktur JSONB mengikuti kategori acara yang relevan — hanya tampilan React component-nya yang berbeda.

---

## 6. ARSITEKTUR KOMPONEN TEMA UNDANGAN

### Prinsip pemisahan komponen

```
ThemeShell     → Layout, animasi, warna, font — BERBEDA tiap tema
ThemeContent   → RSVP, galeri, countdown, buku tamu — SAMA semua tema, di-inject ke shell
```

### Struktur folder tema
```
components/
├── themes/
│   ├── index.ts                  # Registry: map component_key → React component
│   ├── WeddingElegant/
│   │   ├── index.tsx             # ThemeShell
│   │   └── schema.ts             # Definisi field JSONB untuk tema ini
│   ├── WeddingMinimalist/
│   ├── WeddingAnime/
│   └── BirthdayFun/
└── theme-content/
    ├── Countdown.tsx
    ├── Gallery.tsx
    ├── RSVP.tsx
    ├── GuestBook.tsx
    ├── Maps.tsx
    ├── MusicPlayer.tsx
    └── Angpao.tsx
```

### Dynamic import tema (lazy loading)
```typescript
// components/themes/index.ts
const themeRegistry: Record<string, () => Promise<{ default: React.ComponentType<ThemeProps> }>> = {
  WeddingElegant:    () => import('./WeddingElegant'),
  WeddingMinimalist: () => import('./WeddingMinimalist'),
  BirthdayFun:       () => import('./BirthdayFun'),
}

export function getThemeComponent(componentKey: string) {
  return themeRegistry[componentKey] ?? null
}
```

### Custom hooks
```
hooks/
├── useInvitation.ts    # Fetch & update data undangan
├── useCountdown.ts     # Hitung mundur ke hari H
├── useUpload.ts        # Upload foto ke Cloudinary
├── useGuests.ts        # Kelola daftar tamu & RSVP
└── useAssist.ts        # Kelola status terima beres
```

---

## 7. SISTEM PAKET & FITUR

### Ringkasan paket

| Paket     | Harga    | Masa Aktif | Terima Beres | Target User             |
|-----------|----------|------------|--------------|-------------------------|
| Uji Coba  | Gratis   | Tanpa batas| ✗            | Sebelum pernah beli     |
| Basic     | Rp 79rb  | 6 bulan    | ✗            | Self-edit mandiri       |
| Pro       | Rp 149rb | 6 bulan    | 1x (1 revisi)| Self-edit + bantuan     |
| Studio    | Rp 199rb | 1 tahun    | ✓ (3 revisi) | Full terima beres       |

### Fitur per paket

| Fitur                        | Trial | Basic | Pro   | Studio |
|------------------------------|-------|-------|-------|--------|
| Akses tema standar           | 3–5   | Semua | Semua | Semua  |
| Akses tema eksklusif         | ✗     | ✗     | ✓     | ✓      |
| Galeri foto                  | 2     | 10    | 30    | ∞      |
| Love story                   | ✗     | ✗     | 10    | 20     |
| Embed video YouTube          | ✗     | ✗     | ✓     | ✓      |
| RSVP & buku tamu             | ✗     | ✓     | ✓     | ✓      |
| Balas ucapan tamu            | ✗     | ✗     | ✓     | ✓      |
| Angpao digital               | ✗     | ✓     | ✓     | ✓      |
| Musik latar (library)        | ✗     | ✓     | ✓     | ✓      |
| Maps, Countdown, Save Cal    | ✗     | ✓     | ✓     | ✓      |
| Mode tamu simpel (URL nama)  | ✗     | ✓     | ✓     | ✓      |
| Mode tamu lengkap (token DB) | ✗     | ✓     | ✓     | ✓      |
| Link bisa disebar            | ✗     | ✓     | ✓     | ✓      |
| Watermark logo               | ✓     | ✗     | ✗     | ✗      |
| Terima beres admin           | ✗     | ✗     | ✓     | ✓      |
| Revisi terima beres          | ✗     | ✗     | 1x    | 3x     |
| Prioritas antrian admin      | ✗     | ✗     | ✗     | ✓      |
| SLA admin                    | ✗     | ✗     | 3x24j | Prioritas |
| Notifikasi WA                | ✗     | ✓     | ✓     | ✓      |
| Perpanjang masa aktif        | ✗     | ✓     | ✓     | ✓      |

### Aturan upgrade/downgrade
- Upgrade tersedia: Trial → Basic/Pro/Studio, Basic → Pro/Studio, Pro → Studio
- Harga upgrade: harga khusus (bukan selisih, bukan harga penuh) — ditentukan kemudian
- Masa aktif setelah upgrade: dihitung ulang dari tanggal upgrade sesuai paket baru
- Downgrade: tidak bisa untuk order berjalan, hanya berlaku untuk order berikutnya
- Di webhook Midtrans: gunakan `metadata.payment_type = "upgrade"` + `metadata.order_id`

---

## 8. SISTEM TAMU UNDANGAN

### Dua mode akses undangan

```
/undangan/[slug]              → Link generik tanpa nama tamu
/undangan/[slug]?nama=Budi    → Mode simpel: nama dari query param URL
/undangan/[slug]?token=abc123 → Mode lengkap: nama dari database (tabel guests)
```

Satu halaman yang sama mendeteksi otomatis mode mana yang dipakai. RSVP tracking hanya aktif di mode token (mode lengkap), karena mode simpel tidak menyimpan identitas tamu.

---

## 9. SISTEM EXPIRY & CLEANUP

### Alur expiry
1. Saat order aktif: `expires_at = now() + 6 bulan` (Basic/Pro) atau `+ 1 tahun` (Studio)
2. Cron job harian jam **02.00 WIB** (19.00 UTC) via Vercel Cron
3. Cron cek semua order dengan `expires_at <= now()` dan status `active`
4. Kirim notifikasi WA ke user di H-14 dan H-1 sebelum expired
5. Saat expired: status order → `expired`, halaman undangan → 404
6. Cleanup media Cloudinary saat status berubah ke expired
7. Data di database ditahan **30 hari** setelah expired, lalu dihapus permanen
8. Slug dibebaskan kembali setelah data dihapus

### Perpanjangan masa aktif
- Dihitung dari `expires_at` lama (bukan dari `now()`), agar sisa masa aktif tidak hilang
- Di webhook: `payment_type = "renewal"`, `order_id` di metadata
- Jika order sudah expired, status dikembalikan ke `active` saat perpanjangan berhasil

---

## 10. INTEGRASI MIDTRANS

### Konfigurasi environment
```env
# Development (Sandbox)
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=false

# Production
MIDTRANS_SERVER_KEY=Mid-server-xxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxx
MIDTRANS_IS_PRODUCTION=true
```

### Verifikasi signature webhook (WAJIB — jangan skip)
```typescript
import crypto from 'crypto'

export async function POST(req: Request) {
  const body = await req.json()

  const hash = crypto
    .createHash('sha512')
    .update(
      body.order_id +
      body.status_code +
      body.gross_amount +
      process.env.MIDTRANS_SERVER_KEY
    )
    .digest('hex')

  if (hash !== body.signature_key) {
    return new Response('Forbidden', { status: 403 })
  }

  // Lanjut proses berdasarkan payment_type di metadata
  const { payment_type, order_id } = body.metadata

  if (payment_type === 'renewal') {
    // Update expires_at dari expires_at lama + durasi paket
  } else if (payment_type === 'upgrade') {
    // Update package + expires_at dari tanggal upgrade
  } else {
    // Order baru: set status active, set expires_at
  }
}
```

### Biaya Midtrans (dibebankan ke user sebagai "biaya admin")
- Virtual Account semua bank: Rp 4.000/transaksi
- QRIS: 0,7% dari nilai transaksi
- Semua biaya + PPN 11% dari fee

---

## 11. ALUR TERIMA BERES

### Status flow
```
idle → waiting_admin → in_progress → waiting_review → done
                                   ↑ (revisi)       ↓
                                   └────────────────┘
```

### Aturan
- SLA admin: **3x24 jam** sejak status berubah ke `in_progress`
- SLA warning: cron harian kirim notif WA ke admin jika order belum selesai setelah 2x24 jam
- Jatah revisi: Pro = 1x, Studio = 3x — ditampilkan di UI ("sisa revisi: X dari Y")
- Prioritas antrian: Studio selalu didahulukan dari Pro
- Review: user ACC atau minta revisi langsung di dashboard (tanpa WA manual)
- Setelah ACC: `assist_status = done`, undangan otomatis aktif & bisa disebar

### Notifikasi terima beres
| Event                              | Ke     |
|------------------------------------|--------|
| User submit permintaan terima beres| Admin  |
| Admin selesai mengerjakan          | User   |
| User minta revisi                  | Admin  |
| SLA warning (2x24 jam belum done)  | Admin  |

---

## 12. SISTEM NOTIFIKASI

Semua notifikasi via **Fonnte (WhatsApp)**. Email via **Resend** hanya untuk verifikasi akun dan reset password.

### Nomor WA user wajib diisi saat register (field required).

### Daftar notifikasi

| Event                          | Ke    | Default  |
|--------------------------------|-------|----------|
| Pembayaran berhasil            | User  | Aktif    |
| Undangan berhasil dipublikasi  | User  | Aktif    |
| Admin selesai terima beres     | User  | Aktif    |
| Undangan H-14 sebelum expired  | User  | Aktif    |
| Undangan H-1 sebelum expired   | User  | Aktif    |
| Perpanjangan berhasil          | User  | Aktif    |
| Tamu submit RSVP               | User  | **Off**  |
| Tamu kirim ucapan              | User  | **Off**  |
| User submit terima beres       | Admin | Aktif    |
| User minta revisi              | Admin | Aktif    |
| SLA warning 2x24 jam           | Admin | Aktif    |

User bisa toggle notifikasi RSVP & ucapan di halaman `/profil/notifikasi`.

---

## 13. MANAJEMEN MEDIA CLOUDINARY

### Struktur folder
```
undangan/
├── orders/
│   └── {orderId}/
│       ├── cover.jpg
│       ├── qris.jpg
│       └── gallery/
│           ├── img_001.jpg
│           └── img_002.jpg
│       └── lovestory/        (Pro & Studio)
│           └── img_001.jpg
└── themes/
    └── {themeId}/
        ├── preview.jpg       (thumbnail katalog)
        └── og.jpg            (OG image share)
```

### Aturan upload
- Format: JPG, PNG, WEBP
- Ukuran maks: **5MB per file** — semua paket
- Transformasi otomatis: tambahkan `f_auto,q_auto` di semua URL Cloudinary
- Cleanup: hapus semua file di `orders/{orderId}/` saat order expired

### Batas foto per paket
| Jenis foto     | Trial | Basic | Pro   | Studio   |
|----------------|-------|-------|-------|----------|
| Cover / hero   | 1     | 1     | 1     | 1        |
| QR QRIS        | ✗     | 1     | 1     | 1        |
| Galeri         | 2     | 10    | 30    | Unlimited|
| Love story     | ✗     | ✗     | 10    | 20       |

---

## 14. SEO

### Halaman yang harus diindeks Google
- `/` — Landing page
- `/katalog` — Katalog tema
- `/katalog/[slug]` — Detail tema (target long-tail keyword)
- `/harga` — Halaman paket & harga

### Halaman yang harus `noindex`
- `/undangan/*` — Data pribadi user
- `/dashboard/*` — Area private
- `/admin/*` — Area internal
- `/checkout/*` — Alur transaksi
- `/profil/*` — Data pribadi
- `/login`, `/register`, dll

### File wajib
- `app/sitemap.ts` — Daftarkan semua halaman publik
- `app/robots.ts` — Blokir crawl area private
- `app/og/route.tsx` — Dynamic OG image via `@vercel/og`

### Structured data
- Landing page: `WebSite` schema
- Halaman tema: `Product` schema
- Halaman harga: `Offer` + `FAQ` schema

---

## 15. KEAMANAN

### Middleware & route guards
- `/dashboard/*` — Cek session NextAuth, redirect ke `/login?callbackUrl=...` jika belum login
- `/admin/*` — Cek session + `role === 'admin'`, redirect ke `/` jika bukan admin
- Setelah login dari checkout: gunakan `callbackUrl` di NextAuth untuk kembali ke halaman checkout

### Webhook Midtrans
- **Selalu verifikasi signature SHA-512** sebelum proses apapun (lihat bagian 10)
- Tolak dengan status 403 jika signature tidak cocok
- Log semua percobaan request yang gagal verifikasi

### Upload file
- Validasi tipe file di server (bukan hanya di client)
- Validasi ukuran maks 5MB di server
- Hanya izinkan JPG, PNG, WEBP

### Rate limiting
- API `/api/rsvp` dan `/api/ucapan` — implementasi rate limiting (rawan spam dari tamu)

---

## 16. VARIABEL ENVIRONMENT

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Midtrans
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Fonnte (WhatsApp)
FONNTE_API_KEY=
FONNTE_SENDER_NUMBER=

# Resend (Email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 17. CATATAN PENTING UNTUK DEVELOPER

1. **Jangan skip verifikasi signature Midtrans** — ini critical security, bukan opsional
2. **Nomor WA user wajib diisi saat register** — semua notifikasi bergantung pada ini
3. **ISR untuk halaman undangan** — gunakan `revalidatePath('/undangan/[slug]')` setiap kali konten undangan diupdate atau perpanjangan berhasil
4. **JSONB content fleksibel per tema** — jangan hardcode struktur data di luar schema tema masing-masing
5. **Masa aktif perpanjangan** — hitung dari `expires_at` lama, bukan dari `now()`
6. **Cloudinary URL** — selalu tambahkan transformasi `f_auto,q_auto` untuk performa optimal
7. **Paket trial** — hanya bisa didapat sekali, cek `orders` history sebelum beri akses trial
8. **QR Code check-in** — fitur ini ditunda pasca-launch, jangan implementasi dulu. Field `checked_in_at` di tabel `guests` akan ditambahkan nanti via migrasi
9. **Harga upgrade antar paket** — belum final, buat config tersendiri yang mudah diubah tanpa deploy ulang
10. **Musik latar** — library bawaan, file audio disimpan sebagai static asset, bukan di Cloudinary

---

## 18. DESAIN LANDING PAGE

### Keputusan desain yang sudah final

**Layout hero:** Opsi C — Editorial grid
- Kiri: headline + checklist fitur
- Kanan: grid card 2 kolom, 5 card fitur utama
- Bottom bar: avatar stack + jumlah user + rating

**Palet warna: Twilight Gold**

| Peran       | Hex       | Penggunaan                                     |
|-------------|-----------|------------------------------------------------|
| Brand blue  | `#4A5FA8` | CTA utama, icon, teks aksen "tanpa ribet"      |
| Brand dark  | `#2D4080` | Hover state brand primary                      |
| Brand light | `#EEF0F9` | Background badge, card highlight               |
| Brand mid   | `#8B9ED4` | Border aksen, elemen sekunder                  |
| Gold        | `#E8C98A` | Tombol sekunder, card premium, aksen           |
| Gold dark   | `#C9A55A` | Hover gold, teks aksen "selamanya", logo titik |
| BG utama    | `#FDF8F2` | Background halaman                             |
| BG gold     | `#FDF4E8` | Background card terima beres dan eyebrow       |

**Tipografi:**
- Font: system font stack (tidak perlu Google Fonts)
- Heading: font-weight 500, letter-spacing negatif
- Body: font-size 14px, line-height 1.7

**Logo:** invizoku. — huruf "zo" warna #4A5FA8, titik warna #C9A55A

**Navbar:** Link: Katalog tema, Harga, Masuk — CTA: "Coba gratis" bg #4A5FA8

**Hero headline:** "Undangan digital tanpa ribet, berkesan selamanya"
- "tanpa ribet" → warna #4A5FA8
- "selamanya" → warna #C9A55A

**CTA hero:**
- Primer: "Coba gratis" → bg #4A5FA8, teks putih
- Sekunder: "Lihat demo" → bg #E8C98A, teks #7A5A1A

**Checklist fitur:** 4 poin, ikon ti-check warna #4A5FA8

**Grid card kanan (5 card):**
- Self-edit → ti-edit, biru
- Terima beres → ti-tools, gold, border gold, badge "Pro & Studio"
- Kelola tamu → ti-users, biru
- 50+ tema → ti-template, biru
- Checkout otomatis → ti-shopping-cart, span 2 kolom, badge "Pertama di Indonesia"

**Bottom bar:**
- Kiri: avatar stack biru & gold + "Dipercaya 10.000+ pasangan di Indonesia"
- Kanan: bintang emas + "4.9 / 5 dari 2.300+ ulasan"

### Urutan implementasi section landing page
1. Hero section — sudah dirancang, kerjakan pertama
2. Cara kerja — 3 langkah: pilih tema, isi data, sebar
3. Showcase tema — galeri dengan filter kategori
4. Paket & harga — tabel 4 paket (Trial, Basic, Pro, Studio)
5. Testimoni — ulasan pasangan
6. CTA final
7. Footer
