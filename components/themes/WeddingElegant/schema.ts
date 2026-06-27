import type { InvitationData } from '@/types/invitation'

// Default content sesuai DATA CONTOH/data-contoh.js → DATA_WEDDING
// Dipakai saat order baru dibuat (Invitation.content awal)
export const defaultWeddingContent: InvitationData = {
  bride: {
    name: 'Anisa Putri Rahayu',
    parents: 'Putri dari Bapak Hendra Wijaya & Ibu Sari Indah',
  },
  groom: {
    name: 'Budi Santoso Pratama',
    parents: 'Putra dari Bapak Agus Santoso & Ibu Dewi Lestari',
  },
  akad: {
    date: 'Sabtu, 14 Februari 2026',
    time: '08.00 WIB',
    venue: 'Masjid Al-Ikhlas',
    address: 'Jl. Sudirman No. 10, Tanah Abang, Jakarta Pusat',
    maps_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8455!3d-6.2088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzEuNyJTIDEwNsKwNTAnNDMuOCJF!5e0!3m2!1sid!2sid!4v1234567890',
  },
  resepsi: {
    date: 'Sabtu, 14 Februari 2026',
    time: '11.00 – 14.00 WIB',
    venue: 'Grand Ballroom Hotel Mulia Jakarta',
    address: 'Jl. Gatot Subroto Kav. 2-3, Kuningan, Jakarta Selatan',
    maps_url:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8200!3d-6.2350!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMDYuMCJTIDEwNsKwNDknMTIuMCJF!5e0!3m2!1sid!2sid!4v1234567890',
  },
  countdown_target: '2026-02-14T08:00:00',
  cover_photo: '',
  gallery: [],
  love_story: [],
  music_id: 'music_001',
  youtube_url: '',
  angpao: {
    rekening: [
      { bank: 'BCA', no: '1234567890', name: 'Anisa Putri Rahayu' },
      { bank: 'Bank Mandiri', no: '0987654321', name: 'Budi Santoso Pratama' },
    ],
    qris_url: '',
    address: 'Jl. Mawar Indah No. 5, RT 03/RW 02, Kebayoran Baru, Jakarta Selatan 12180',
  },
}
