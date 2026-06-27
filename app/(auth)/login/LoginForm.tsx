'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'
  const justReset = searchParams.get('reset') === '1'
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    if (res?.error) {
      setError('Email atau password salah, atau email belum diverifikasi')
      return
    }
    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight">
            invizoku<span className="text-[#C9A55A]">.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Masuk ke akunmu</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {justReset && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg px-4 py-3">
              Password berhasil direset. Silakan masuk.
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="email@kamu.com"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-[#4A5FA8] hover:underline">
              Lupa password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4A5FA8] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <Link href="/register" className="text-[#4A5FA8] font-medium hover:underline">
            Daftar gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
