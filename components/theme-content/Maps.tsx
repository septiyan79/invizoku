interface MapsProps {
  mapsUrl: string
  title?: string
  className?: string
}

export default function Maps({ mapsUrl, title, className = '' }: MapsProps) {
  if (!mapsUrl) return null

  return (
    <div className={className}>
      {title && (
        <p className="text-[11px] uppercase tracking-widest text-center opacity-50 mb-2">
          {title}
        </p>
      )}
      <div className="rounded-xl overflow-hidden aspect-video w-full">
        <iframe
          src={mapsUrl}
          className="w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title ?? 'Lokasi acara'}
          allowFullScreen
        />
      </div>
    </div>
  )
}
