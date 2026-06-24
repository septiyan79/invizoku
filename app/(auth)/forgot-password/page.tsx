'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
})

type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight">
            invizoku<span className="text-[#C9A55A]">.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Lupa password</p>
        </div>

        {sent ? (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Jika email terdaftar, kami sudah kirim link reset password. Cek inbox atau folder
              spam kamu.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm text-[#4A5FA8] hover:underline"
            >
              Kembali ke halaman masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-gray-500">
              Masukkan email akunmu dan kami akan kirim link untuk reset password.
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@kamu.com"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#4A5FA8] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim link reset'}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-[#4A5FA8] hover:underline">
                Kembali ke halaman masuk
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
