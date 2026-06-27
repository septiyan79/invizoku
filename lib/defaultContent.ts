import type { InvitationData } from '@/types/invitation'

const defaultWedding: InvitationData = {
  bride: { name: '', parents: '' },
  groom: { name: '', parents: '' },
  akad: { date: '', time: '', venue: '', address: '', maps_url: '' },
  resepsi: { date: '', time: '', venue: '', address: '', maps_url: '' },
  countdown_target: '',
  cover_photo: '',
  gallery: [],
  love_story: [],
  music_id: 'music_001',
  youtube_url: '',
  angpao: { rekening: [], qris_url: '', address: '' },
}

const defaultBirthday: InvitationData = {
  name: '',
  age: 0,
  event: { date: '', time: '', venue: '', address: '', maps_url: '' },
  countdown_target: '',
  cover_photo: '',
  gallery: [],
  love_story: [],
  music_id: 'music_001',
  youtube_url: '',
  angpao: { rekening: [], qris_url: '', address: '' },
}

const defaultAqiqah: InvitationData = {
  child_name: '',
  child_gender: 'laki-laki',
  event_type: 'aqiqah',
  parents: '',
  event: { date: '', time: '', venue: '', address: '', maps_url: '' },
  countdown_target: '',
  cover_photo: '',
  gallery: [],
  love_story: [],
  music_id: 'music_001',
  youtube_url: '',
  angpao: { rekening: [], qris_url: '', address: '' },
}

// Map component_key → default content
// Extend ini setiap ada tema baru
const contentMap: Record<string, InvitationData> = {
  WeddingElegant: defaultWedding,
  WeddingMinimalist: defaultWedding,
  WeddingRustic: defaultWedding,
  WeddingAnime: defaultWedding,
  BirthdayFun: defaultBirthday,
  AqiqahSakura: defaultAqiqah,
}

// Fallback: pilih default berdasarkan event_categories
function fallbackByCategory(categories: string[]): InvitationData {
  if (categories.includes('birthday')) return defaultBirthday
  if (categories.includes('aqiqah') || categories.includes('khitan')) return defaultAqiqah
  return defaultWedding
}

export function getDefaultContent(
  componentKey: string,
  eventCategories: string[] = []
): InvitationData {
  return contentMap[componentKey] ?? fallbackByCategory(eventCategories)
}
