'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const schema = z
  .object({
    password: z.string().min(8, 'Password minimal 8 karakter').max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: data.password }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Terjadi kesalahan')
      return
    }
    router.push('/login?reset=1')
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Link tidak valid.</p>
          <Link
            href="/forgot-password"
            className="mt-4 inline-block text-sm text-[#4A5FA8] hover:underline"
          >
            Minta link baru
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight">
            invizoku<span className="text-[#C9A55A]">.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Buat password baru</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password baru</label>
            <input
              {...register('password')}
              type="password"
              placeholder="Min. 8 karakter"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi password
            </label>
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="Ulangi password baru"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4A5FA8] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan password baru'}
          </button>
        </form>
      </div>
    </div>
  )
}
