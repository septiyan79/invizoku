// ================================================================
// DATA-CONTOH.JS — Invizoku Template Developer
// ================================================================
// File ini berisi contoh data untuk setiap kategori tema undangan.
// Gunakan sebagai referensi saat membuat template HTML.
//
// CARA PAKAI:
// 1. Copy salah satu object DATA di bawah sesuai kategori temamu
// 2. Tempel di bagian PALING ATAS script.js milikmu
// 3. Ganti nilai-nilainya dengan data dummy yang masuk akal
// 4. Pastikan semua field yang ada di sini bisa ditampilkan di HTML
// ================================================================


// ================================================================
// KATEGORI 1: WEDDING (Pernikahan & Tunangan)
// ================================================================
// Gunakan untuk tema: wedding elegan, wedding minimalis,
// wedding anime, wedding tradisional, dsb.

const DATA_WEDDING = {

  // Nama tamu — ditampilkan di bagian pembuka undangan
  guest_name: "Bapak/Ibu/Saudara/i Tamu Undangan",

  // Info mempelai wanita
  bride: {
    name: "Anisa Putri Rahayu",
    parents: "Putri dari Bapak Hendra Wijaya & Ibu Sari Indah"
  },

  // Info mempelai pria
  groom: {
    name: "Budi Santoso Pratama",
    parents: "Putra dari Bapak Agus Santoso & Ibu Dewi Lestari"
  },

  // Info akad nikah
  akad: {
    date: "Sabtu, 14 Februari 2026",
    time: "08.00 WIB",
    venue: "Masjid Al-Ikhlas",
    address: "Jl. Sudirman No. 10, Tanah Abang, Jakarta Pusat",
    maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8455!3d-6.2088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzEuNyJTIDEwNsKwNTAnNDMuOCJF!5e0!3m2!1sid!2sid!4v1234567890"
  },

  // Info resepsi
  resepsi: {
    date: "Sabtu, 14 Februari 2026",
    time: "11.00 – 14.00 WIB",
    venue: "Grand Ballroom Hotel Mulia Jakarta",
    address: "Jl. Gatot Subroto Kav. 2-3, Kuningan, Jakarta Selatan",
    maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8200!3d-6.2350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMDYuMCJTIDEwNsKwNDknMTIuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
  },

  // Target countdown — format ISO 8601
  // Biasanya diisi dengan tanggal & jam akad
  countdown_target: "2026-02-14T08:00:00",

  // Foto cover utama
  cover_photo: "assets/cover.jpg",

  // Galeri foto
  // Jumlah foto tergantung paket:
  // Basic = maks 10, Pro = maks 30, Studio = unlimited
  gallery: [
    "assets/foto-1.jpg",
    "assets/foto-2.jpg",
    "assets/foto-3.jpg",
    "assets/foto-4.jpg"
  ],

  // Love story — HANYA untuk paket Pro & Studio
  // PENTING: Jika array ini KOSONG ([]), SEMBUNYIKAN section love story
  // Jika berisi data, TAMPILKAN section love story
  love_story: [
    {
      photo: "assets/foto-1.jpg",
      caption: "Pertama kali bertemu di kampus",
      date: "Januari 2020"
    },
    {
      photo: "assets/foto-2.jpg",
      caption: "Liburan pertama bersama",
      date: "Juni 2020"
    },
    {
      photo: "assets/foto-3.jpg",
      caption: "Resmi jadian",
      date: "14 Februari 2021"
    }
  ],

  // Musik latar — path ke file audio di folder assets/
  music: "assets/musik.mp3",

  // Video YouTube — HANYA untuk paket Pro & Studio
  // PENTING: Jika string ini KOSONG (""), SEMBUNYIKAN section video
  // Gunakan format embed URL (bukan URL biasa)
  youtube_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",

  // Angpao digital — tampil di semua paket
  angpao: {

    // Daftar rekening bank — bisa lebih dari satu
    // Jika array kosong ([]), sembunyikan sub-section rekening
    rekening: [
      {
        bank: "BCA",
        no: "1234567890",
        name: "Anisa Putri Rahayu"
      },
      {
        bank: "Bank Mandiri",
        no: "0987654321",
        name: "Budi Santoso Pratama"
      }
    ],

    // Foto QR code QRIS — path ke file gambar
    // Jika string kosong (""), sembunyikan sub-section QRIS
    qris_url: "assets/qris.jpg",

    // Alamat pengiriman kado fisik
    // Jika string kosong (""), sembunyikan sub-section alamat kado
    address: "Jl. Mawar Indah No. 5, RT 03/RW 02, Kebayoran Baru, Jakarta Selatan 12180"
  },

  // Watermark Invizoku
  // true  = tampilkan badge watermark di pojok bawah (paket trial)
  // false = sembunyikan watermark (paket berbayar)
  show_watermark: true

}


// ================================================================
// KATEGORI 2: ULANG TAHUN
// ================================================================
// Gunakan untuk tema: birthday fun, birthday elegant,
// birthday gamer, birthday cartoon, dsb.

const DATA_BIRTHDAY = {

  guest_name: "Bapak/Ibu/Saudara/i Tamu Undangan",

  // Info yang berulang tahun
  celebrant_name: "Rizky Aditya Pratama",
  age: 25, // tampilkan atau sembunyikan sesuai desain tema

  // Info acara
  event: {
    date: "Sabtu, 20 Maret 2026",
    time: "18.00 – 21.00 WIB",
    venue: "The Rooftop Lounge",
    address: "Jl. Kemang Raya No. 45, Kemang, Jakarta Selatan",
    maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8150!3d-6.2600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTUnMzYuMCJTIDEwNsKwNDgnNTQuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
  },

  countdown_target: "2026-03-20T18:00:00",

  cover_photo: "assets/cover.jpg",

  gallery: [
    "assets/foto-1.jpg",
    "assets/foto-2.jpg",
    "assets/foto-3.jpg"
  ],

  // Ulang tahun tidak punya love_story
  // Tapi tetap sediakan field ini dengan array kosong
  love_story: [],

  music: "assets/musik.mp3",

  // Jika kosong, sembunyikan section video
  youtube_url: "",

  angpao: {
    rekening: [
      {
        bank: "BCA",
        no: "1234567890",
        name: "Rizky Aditya Pratama"
      }
    ],
    qris_url: "assets/qris.jpg",
    address: "Jl. Melati No. 12, Kemang, Jakarta Selatan 12730"
  },

  show_watermark: false

}


// ================================================================
// KATEGORI 3: AQIQAH
// ================================================================
// Gunakan untuk tema: aqiqah islami, aqiqah modern, dsb.

const DATA_AQIQAH = {

  guest_name: "Bapak/Ibu/Saudara/i Tamu Undangan",

  // Info anak
  child_name: "Muhammad Rafif Al-Faris",
  child_gender: "laki-laki", // "laki-laki" atau "perempuan"
  event_type: "aqiqah",      // selalu "aqiqah" untuk kategori ini

  // Info orang tua
  parents: "Bapak Ahmad Fauzi & Ibu Rina Kusuma",

  // Info acara
  event: {
    date: "Ahad, 5 April 2026",
    time: "10.00 – 13.00 WIB",
    venue: "Kediaman Keluarga Bapak Ahmad Fauzi",
    address: "Jl. Anggrek Indah No. 12, Beji, Depok, Jawa Barat",
    maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8200!3d-6.4000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnMDAuMCJTIDEwNsKwNDknMTIuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
  },

  countdown_target: "2026-04-05T10:00:00",

  cover_photo: "assets/cover.jpg",

  gallery: [
    "assets/foto-1.jpg",
    "assets/foto-2.jpg"
  ],

  love_story: [],

  music: "assets/musik.mp3",

  youtube_url: "",

  angpao: {
    rekening: [
      {
        bank: "Bank Mandiri",
        no: "1122334455",
        name: "Ahmad Fauzi"
      }
    ],
    qris_url: "assets/qris.jpg",
    address: "Jl. Anggrek Indah No. 12, Beji, Depok, Jawa Barat 16411"
  },

  show_watermark: false

}


// ================================================================
// KATEGORI 4: KHITAN
// ================================================================
// Gunakan untuk tema: khitan islami, khitan modern, dsb.

const DATA_KHITAN = {

  guest_name: "Bapak/Ibu/Saudara/i Tamu Undangan",

  child_name: "Farhan Rizqullah",
  child_gender: "laki-laki",
  event_type: "khitan",

  parents: "Bapak Dani Prasetyo & Ibu Siska Amelia",

  event: {
    date: "Sabtu, 18 April 2026",
    time: "09.00 – 12.00 WIB",
    venue: "Rumah Bapak Dani Prasetyo",
    address: "Jl. Flamboyan No. 8, Cinere, Depok, Jawa Barat",
    maps_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.7900!3d-6.3500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjEnMDAuMCJTIDEwNsKwNDcnMjQuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
  },

  countdown_target: "2026-04-18T09:00:00",

  cover_photo: "assets/cover.jpg",

  gallery: [
    "assets/foto-1.jpg",
    "assets/foto-2.jpg"
  ],

  love_story: [],

  music: "assets/musik.mp3",

  youtube_url: "",

  angpao: {
    rekening: [
      {
        bank: "BRI",
        no: "5566778899",
        name: "Dani Prasetyo"
      }
    ],
    qris_url: "",
    address: ""
  },

  show_watermark: false

}


// ================================================================
// CARA RENDER DATA KE HTML
// ================================================================
// Salin fungsi di bawah ini ke script.js kamu sebagai titik awal.
// Sesuaikan dengan struktur HTML temamu.

function renderUndangan(data) {

  // Nama tamu
  const elTamu = document.getElementById('nama-tamu')
  if (elTamu) elTamu.textContent = data.guest_name

  // ── WEDDING ──
  if (data.bride) {
    document.getElementById('nama-bride').textContent = data.bride.name
    document.getElementById('orang-tua-bride').textContent = data.bride.parents
  }
  if (data.groom) {
    document.getElementById('nama-groom').textContent = data.groom.name
    document.getElementById('orang-tua-groom').textContent = data.groom.parents
  }
  if (data.akad) {
    document.getElementById('akad-tanggal').textContent = data.akad.date
    document.getElementById('akad-jam').textContent = data.akad.time
    document.getElementById('akad-venue').textContent = data.akad.venue
    document.getElementById('akad-alamat').textContent = data.akad.address
    document.getElementById('akad-maps').src = data.akad.maps_url
  }
  if (data.resepsi) {
    document.getElementById('resepsi-tanggal').textContent = data.resepsi.date
    document.getElementById('resepsi-jam').textContent = data.resepsi.time
    document.getElementById('resepsi-venue').textContent = data.resepsi.venue
    document.getElementById('resepsi-alamat').textContent = data.resepsi.address
    document.getElementById('resepsi-maps').src = data.resepsi.maps_url
  }

  // ── ULANG TAHUN / AQIQAH / KHITAN ──
  if (data.celebrant_name) {
    document.getElementById('nama-celebrant').textContent = data.celebrant_name
  }
  if (data.child_name) {
    document.getElementById('nama-anak').textContent = data.child_name
    document.getElementById('nama-orang-tua').textContent = data.parents
  }
  if (data.event) {
    document.getElementById('event-tanggal').textContent = data.event.date
    document.getElementById('event-jam').textContent = data.event.time
    document.getElementById('event-venue').textContent = data.event.venue
    document.getElementById('event-alamat').textContent = data.event.address
    document.getElementById('event-maps').src = data.event.maps_url
  }

  // ── FOTO COVER ──
  const cover = document.getElementById('foto-cover')
  if (cover && data.cover_photo) cover.src = data.cover_photo

  // ── GALERI ──
  const galeri = document.getElementById('galeri')
  if (galeri && data.gallery) {
    data.gallery.forEach(function(url) {
      const img = document.createElement('img')
      img.src = url
      img.className = 'foto-galeri'
      img.alt = 'Foto galeri'
      galeri.appendChild(img)
    })
  }

  // ── LOVE STORY (sembunyikan jika kosong) ──
  const sectionLS = document.getElementById('section-love-story')
  if (sectionLS) {
    if (data.love_story && data.love_story.length > 0) {
      sectionLS.style.display = 'block'
      const container = document.getElementById('love-story-container')
      data.love_story.forEach(function(item) {
        const div = document.createElement('div')
        div.className = 'love-story-item'
        div.innerHTML = `
          <img src="${item.photo}" alt="Love story">
          <p class="ls-caption">${item.caption}</p>
          <span class="ls-date">${item.date}</span>
        `
        container.appendChild(div)
      })
    } else {
      sectionLS.style.display = 'none'
    }
  }

  // ── MUSIK ──
  const audioSrc = document.getElementById('audio-source')
  const audio = document.getElementById('audio-player')
  if (audioSrc && data.music) {
    audioSrc.src = data.music
    audio.load()
    // Autoplay dengan workaround (browser butuh interaksi user)
    document.addEventListener('click', function() {
      audio.play().catch(function() {})
    }, { once: true })
  }

  // ── VIDEO YOUTUBE (sembunyikan jika kosong) ──
  const sectionVideo = document.getElementById('section-video')
  if (sectionVideo) {
    if (data.youtube_url && data.youtube_url !== '') {
      sectionVideo.style.display = 'block'
      document.getElementById('iframe-youtube').src = data.youtube_url
    } else {
      sectionVideo.style.display = 'none'
    }
  }

  // ── ANGPAO DIGITAL ──
  if (data.angpao) {
    // Rekening bank
    const listRek = document.getElementById('list-rekening')
    if (listRek) {
      if (data.angpao.rekening && data.angpao.rekening.length > 0) {
        listRek.style.display = 'block'
        data.angpao.rekening.forEach(function(rek) {
          const div = document.createElement('div')
          div.className = 'rekening-item'
          div.innerHTML = `
            <span class="rek-bank">${rek.bank}</span>
            <span class="rek-nomor">${rek.no}</span>
            <span class="rek-nama">${rek.name}</span>
          `
          listRek.appendChild(div)
        })
      } else {
        listRek.style.display = 'none'
      }
    }

    // QR QRIS
    const qrisContainer = document.getElementById('qris-container')
    if (qrisContainer) {
      if (data.angpao.qris_url && data.angpao.qris_url !== '') {
        qrisContainer.style.display = 'block'
        qrisContainer.querySelector('img').src = data.angpao.qris_url
      } else {
        qrisContainer.style.display = 'none'
      }
    }

    // Alamat kado
    const alamatKado = document.getElementById('alamat-kado')
    if (alamatKado) {
      if (data.angpao.address && data.angpao.address !== '') {
        alamatKado.style.display = 'block'
        alamatKado.querySelector('p').textContent = data.angpao.address
      } else {
        alamatKado.style.display = 'none'
      }
    }
  }

  // ── COUNTDOWN ──
  if (data.countdown_target) {
    startCountdown(data.countdown_target)
  }

  // ── WATERMARK ──
  const watermark = document.getElementById('watermark')
  if (watermark) {
    watermark.style.display = data.show_watermark ? 'flex' : 'none'
  }
}


// ================================================================
// FUNGSI COUNTDOWN
// ================================================================
function startCountdown(targetDate) {
  function update() {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const diff = target - now

    if (diff <= 0) {
      const el = document.getElementById('countdown')
      if (el) el.innerHTML = '<p class="countdown-selesai">Hari ini adalah hari istimewa! 🎉</p>'
      return
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    const cdHari   = document.getElementById('cd-hari')
    const cdJam    = document.getElementById('cd-jam')
    const cdMenit  = document.getElementById('cd-menit')
    const cdDetik  = document.getElementById('cd-detik')

    if (cdHari)  cdHari.textContent  = String(days).padStart(2, '0')
    if (cdJam)   cdJam.textContent   = String(hours).padStart(2, '0')
    if (cdMenit) cdMenit.textContent = String(minutes).padStart(2, '0')
    if (cdDetik) cdDetik.textContent = String(seconds).padStart(2, '0')
  }

  update()
  setInterval(update, 1000)
}


// ================================================================
// TOMBOL MUSIK
// ================================================================
function initMusicPlayer() {
  const audio = document.getElementById('audio-player')
  const btn = document.getElementById('btn-musik')

  if (!audio || !btn) return

  btn.addEventListener('click', function() {
    if (audio.paused) {
      audio.play()
      btn.textContent = '⏸'
      btn.title = 'Pause musik'
    } else {
      audio.pause()
      btn.textContent = '▶'
      btn.title = 'Play musik'
    }
  })
}


// ================================================================
// INISIALISASI
// ================================================================
// Ganti DATA_WEDDING dengan nama object DATA yang sesuai temamu
// DATA_WEDDING / DATA_BIRTHDAY / DATA_AQIQAH / DATA_KHITAN

document.addEventListener('DOMContentLoaded', function() {
  renderUndangan(DATA_WEDDING) // <- ganti sesuai kategori tema
  initMusicPlayer()
})
