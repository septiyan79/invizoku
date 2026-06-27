'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

interface Props {
  snapToken: string
  orderId: string
  clientKey: string
  isProduction: boolean
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: unknown) => void
          onPending: (result: unknown) => void
          onError: (result: unknown) => void
          onClose: () => void
        }
      ) => void
    }
  }
}

export default function PaymentClient({ snapToken, orderId, clientKey, isProduction }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'ready' | 'pending' | 'error' | 'closed'>('loading')

  const snapUrl = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'

  function openSnap() {
    window.snap?.pay(snapToken, {
      onSuccess: () => router.push(`/checkout/success?orderId=${orderId}`),
      onPending: () => setStatus('pending'),
      onError: () => setStatus('error'),
      onClose: () => setStatus('closed'),
    })
  }

  useEffect(() => {
    // Kalau snap sudah ada (script sudah load sebelumnya), langsung buka
    if (window.snap) {
      setStatus('ready')
      openSnap()
    }
  }, [])

  return (
    <>
      <Script
        src={snapUrl}
        data-client-key={clientKey}
        strategy="afterInteractive"
        onLoad={() => {
          setStatus('ready')
          openSnap()
        }}
        onError={() => setStatus('error')}
      />

      <div className="min-h-screen bg-[#FDF8F2] flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-[#EEF0F9] flex items-center justify-center mx-auto mb-5">
            {status === 'loading' || status === 'ready' ? (
              <div className="w-6 h-6 border-2 border-[#4A5FA8] border-t-transparent rounded-full animate-spin" />
            ) : status === 'pending' ? (
              <i className="ti ti-clock text-2xl text-[#C9A55A]" aria-hidden="true" />
            ) : status === 'error' ? (
              <i className="ti ti-x text-2xl text-red-400" aria-hidden="true" />
            ) : (
              <i className="ti ti-x text-2xl text-neutral-400" aria-hidden="true" />
            )}
          </div>

          {(status === 'loading' || status === 'ready') && (
            <>
              <p className="text-[15px] font-medium text-neutral-800 mb-1">Membuka halaman pembayaran...</p>
              <p className="text-[12px] text-neutral-400">Jangan tutup halaman ini.</p>
            </>
          )}

          {status === 'pending' && (
            <>
              <p className="text-[15px] font-medium text-neutral-800 mb-1">Pembayaran sedang diproses</p>
              <p className="text-[12px] text-neutral-400 mb-5">
                Pesanan kamu akan aktif setelah pembayaran dikonfirmasi. Cek email untuk info lebih lanjut.
              </p>
              <a
                href="/dashboard"
                className="inline-block px-5 py-2.5 bg-[#4A5FA8] text-white text-[13px] rounded-xl"
              >
                Lihat dashboard
              </a>
            </>
          )}

          {status === 'error' && (
            <>
              <p className="text-[15px] font-medium text-neutral-800 mb-1">Pembayaran gagal</p>
              <p className="text-[12px] text-neutral-400 mb-5">Terjadi kesalahan. Silakan coba lagi.</p>
              <button
                onClick={() => { setStatus('ready'); openSnap() }}
                className="inline-block px-5 py-2.5 bg-[#4A5FA8] text-white text-[13px] rounded-xl"
              >
                Coba lagi
              </button>
            </>
          )}

          {status === 'closed' && (
            <>
              <p className="text-[15px] font-medium text-neutral-800 mb-1">Pembayaran dibatalkan</p>
              <p className="text-[12px] text-neutral-400 mb-5">
                Kamu menutup halaman pembayaran sebelum selesai.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => { setStatus('ready'); openSnap() }}
                  className="px-5 py-2.5 bg-[#4A5FA8] text-white text-[13px] rounded-xl"
                >
                  Lanjut bayar
                </button>
                <a
                  href="/katalog"
                  className="px-5 py-2.5 border border-neutral-200 text-neutral-600 text-[13px] rounded-xl"
                >
                  Batalkan
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
