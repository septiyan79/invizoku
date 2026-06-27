'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Token tidak ditemukan.')
      return
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setStatus('error')
          setMessage(json.error)
        } else {
          setStatus('success')
          setMessage(json.message)
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Terjadi kesalahan. Coba lagi.')
      })
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-medium tracking-tight mb-6">
          invizoku<span className="text-[#C9A55A]">.</span>
        </h1>

        {status === 'loading' && <p className="text-sm text-gray-500">Memverifikasi email...</p>}

        {status === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <p className="text-sm text-gray-600">{message}</p>
            <Link
              href="/login"
              className="mt-6 inline-block bg-[#4A5FA8] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-[#2D4080] transition-colors"
            >
              Masuk sekarang
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <p className="text-sm text-red-600">{message}</p>
            <Link
              href="/register"
              className="mt-6 inline-block text-sm text-[#4A5FA8] hover:underline"
            >
              Daftar ulang
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
