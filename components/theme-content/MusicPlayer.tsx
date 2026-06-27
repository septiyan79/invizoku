'use client'

import { useState, useEffect, useRef } from 'react'
import { getMusicById } from '@/lib/music'

interface MusicPlayerProps {
  musicId: string
}

export default function MusicPlayer({ musicId }: MusicPlayerProps) {
  const track = getMusicById(musicId)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onCanPlay = () => setReady(true)
    audio.addEventListener('canplaythrough', onCanPlay)
    return () => audio.removeEventListener('canplaythrough', onCanPlay)
  }, [])

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  if (!track) return null

  return (
    <>
      <audio ref={audioRef} src={track.url} loop preload="none" />
      <button
        onClick={toggle}
        disabled={!ready}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-40"
        style={{ background: '#C9A55A' }}
        aria-label={playing ? 'Pause musik' : 'Play musik'}
        title={track.title}
      >
        <i
          className={`ti ${playing ? 'ti-player-pause' : 'ti-player-play'} text-white text-lg`}
          aria-hidden="true"
        />
      </button>
    </>
  )
}
