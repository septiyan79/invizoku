export interface MusicTrack {
  id: string
  title: string
  artist: string
  url: string // relative path dari /public
}

export const musicLibrary: MusicTrack[] = [
  { id: 'music_001', title: 'A Thousand Years', artist: 'Instrumental', url: '/music/music_001.mp3' },
  { id: 'music_002', title: 'Perfect', artist: 'Instrumental', url: '/music/music_002.mp3' },
  { id: 'music_003', title: 'Can\'t Help Falling in Love', artist: 'Instrumental', url: '/music/music_003.mp3' },
  { id: 'music_004', title: 'All of Me', artist: 'Instrumental', url: '/music/music_004.mp3' },
  { id: 'music_005', title: 'Thinking Out Loud', artist: 'Instrumental', url: '/music/music_005.mp3' },
  { id: 'music_006', title: 'Marry You', artist: 'Instrumental', url: '/music/music_006.mp3' },
  { id: 'music_007', title: 'Make You Feel My Love', artist: 'Instrumental', url: '/music/music_007.mp3' },
  { id: 'music_008', title: 'Lagu Cinta', artist: 'Instrumental', url: '/music/music_008.mp3' },
]

export function getMusicById(id: string): MusicTrack | undefined {
  return musicLibrary.find((m) => m.id === id)
}
