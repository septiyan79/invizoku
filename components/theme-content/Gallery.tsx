'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryProps {
  photos: string[]
  className?: string
}

export default function Gallery({ photos, className = '' }: GalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (!photos || photos.length === 0) return null

  return (
    <>
      <div className={`grid grid-cols-2 gap-2 ${className}`}>
        {photos.map((url, i) => (
          <button
            key={i}
            onClick={() => setLightbox(url)}
            className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 focus:outline-none"
          >
            <Image
              src={`${url}?f_auto,q_auto`}
              alt={`Foto ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-lg w-full max-h-[80vh] aspect-square">
            <Image
              src={`${lightbox}?f_auto,q_auto`}
              alt="Foto"
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none"
            onClick={() => setLightbox(null)}
            aria-label="Tutup"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
