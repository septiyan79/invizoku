'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Rekening {
  bank: string
  no: string
  name: string
}

interface AngpaoProps {
  rekening: Rekening[]
  qrisUrl: string
  address: string
  className?: string
}

export default function Angpao({ rekening, qrisUrl, address, className = '' }: AngpaoProps) {
  const [copied, setCopied] = useState<string | null>(null)
  const hasRekening = rekening && rekening.length > 0
  const hasQris = !!qrisUrl
  const hasAddress = !!address

  if (!hasRekening && !hasQris && !hasAddress) return null

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className={`space-y-5 ${className}`}>
      {hasRekening && (
        <div className="space-y-3">
          {rekening.map((rek, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 bg-white">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 mb-0.5">
                  {rek.bank}
                </p>
                <p className="text-[15px] font-medium text-neutral-800 tracking-wider">{rek.no}</p>
                <p className="text-[12px] text-neutral-500">{rek.name}</p>
              </div>
              <button
                onClick={() => copy(rek.no, `rek-${i}`)}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
              >
                {copied === `rek-${i}` ? '✓ Tersalin' : 'Salin'}
              </button>
            </div>
          ))}
        </div>
      )}

      {hasQris && (
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-3">QRIS</p>
          <div className="relative w-44 h-44 mx-auto rounded-xl overflow-hidden border border-neutral-200">
            <Image
              src={`${qrisUrl}?f_auto,q_auto`}
              alt="QR QRIS"
              fill
              className="object-contain"
              sizes="176px"
            />
          </div>
        </div>
      )}

      {hasAddress && (
        <div className="p-4 rounded-xl border border-neutral-200 bg-white">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 mb-2">Kirim Kado</p>
          <p className="text-[13px] text-neutral-700 leading-relaxed">{address}</p>
          <button
            onClick={() => copy(address, 'address')}
            className="mt-2 text-[11px] text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            {copied === 'address' ? '✓ Tersalin' : 'Salin alamat'}
          </button>
        </div>
      )}
    </div>
  )
}
