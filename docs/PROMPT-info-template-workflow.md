Ada hal penting yang perlu kamu ketahui tentang bagaimana template undangan akan masuk ke project ini.

Template undangan TIDAK akan dibuat langsung di dalam project ini. Saya mendelegasikan pembuatan template undangan ke developer lain yang akan mengerjakan dalam format HTML/CSS/JS biasa — bukan TSX.

---

CARA KERJANYA:

Developer tersebut akan deliver setiap tema dalam struktur folder seperti ini:

```
nama-tema/
├── index.html    ← struktur visual undangan
├── style.css     ← semua styling
├── script.js     ← animasi, countdown, interaksi
├── preview.jpg   ← screenshot untuk katalog
└── assets/
    ├── cover.jpg
    ├── foto-1.jpg
    └── musik.mp3
```

Di dalam script.js mereka, semua data undangan terpusat dalam satu object DATA di baris paling atas:

```javascript
const DATA = {
  guest_name: "...",
  bride: { name: "...", parents: "..." },
  groom: { name: "...", parents: "..." },
  akad: { date: "...", time: "...", venue: "...", address: "...", maps_url: "..." },
  resepsi: { date: "...", time: "...", venue: "...", address: "...", maps_url: "..." },
  countdown_target: "2026-02-14T08:00:00",
  cover_photo: "assets/cover.jpg",
  gallery: ["assets/foto-1.jpg", "assets/foto-2.jpg"],
  love_story: [{ photo: "...", caption: "...", date: "..." }],
  music: "assets/musik.mp3",
  youtube_url: "",
  angpao: {
    rekening: [{ bank: "...", no: "...", name: "..." }],
    qris_url: "assets/qris.jpg",
    address: "..."
  },
  show_watermark: false
}
```

Struktur DATA ini sudah disesuaikan dengan skema JSONB di tabel invitations (lihat PROJECT.md bagian 4 dan 5).

---

IMPLIKASI UNTUK DEVELOPMENT SEKARANG:

Saat membangun arsitektur tema (bagian 6 di PROJECT.md), pastikan sistem dirancang untuk menerima file HTML eksternal ini dengan mudah. Yang perlu disiapkan:

1. Interface TypeScript InvitationData harus mencerminkan persis struktur object DATA di atas — semua field opsional kecuali guest_name, karena tidak semua kategori tema punya field yang sama.

2. ThemeShell setiap tema nantinya adalah hasil konversi dari index.html + style.css milik developer. Jangan hardcode apapun di ThemeShell yang seharusnya datang dari data.

3. ThemeContent components (Countdown, Gallery, RSVP, GuestBook, Maps, MusicPlayer, Angpao) harus sudah siap sebagai komponen standalone yang tinggal di-import oleh ThemeShell manapun — karena semua tema memakai komponen yang sama untuk bagian-bagian ini.

4. Registry di components/themes/index.ts harus mudah ditambah entri baru setiap kali ada tema baru yang selesai dikonversi dari HTML.

5. Field show_watermark di data menentukan apakah watermark Invizoku ditampilkan — ini untuk paket trial. Komponen Watermark harus sudah ada dan siap dipakai oleh semua ThemeShell.

6. Kondisi show/hide berikut harus dihandle di level ThemeShell, bukan di database:
   - love_story: sembunyikan section jika array kosong atau null
   - youtube_url: sembunyikan section jika string kosong
   - angpao.rekening: sembunyikan jika array kosong
   - angpao.qris_url: sembunyikan jika string kosong
   - angpao.address: sembunyikan jika string kosong

---

YANG TIDAK PERLU DIKERJAKAN SEKARANG:

Jangan buat ThemeShell untuk tema manapun dulu — itu menunggu file HTML dari developer. Yang perlu dikerjakan sekarang adalah menyiapkan fondasi agar saat file HTML datang, proses konversi ke TSX bisa berjalan cepat dan mulus.

Lanjutkan task sesuai urutan di PROGRESS.md.
