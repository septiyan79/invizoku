'use client'

import { useCountdown } from '@/hooks/useCountdown'

interface CountdownProps {
  targetDate: string
  className?: string
}

export default function Countdown({ targetDate, className = '' }: CountdownProps) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(targetDate)

  if (isPast) {
    return (
      <p className={`text-center text-sm text-neutral-500 italic ${className}`}>
        Hari ini adalah hari istimewa 🎉
      </p>
    )
  }

  const units = [
    { value: days, label: 'Hari' },
    { value: hours, label: 'Jam' },
    { value: minutes, label: 'Menit' },
    { value: seconds, label: 'Detik' },
  ]

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-3xl font-medium tabular-nums leading-none">
              {String(value).padStart(2, '0')}
            </div>
            <div className="text-[10px] uppercase tracking-widest mt-1 opacity-60">
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl font-light opacity-40 -mt-3">:</span>
          )}
        </div>
      ))}
    </div>
  )
}
