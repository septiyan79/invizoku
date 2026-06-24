'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'

const schema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter').max(100).trim(),
    email: z.string().email('Email tidak valid'),
    phone_wa: z
      .string()
      .min(10, 'Nomor WA minimal 10 digit')
      .max(15)
      .regex(/^[0-9+]+$/, 'Hanya boleh angka'),
    password: z.string().min(8, 'Password minimal 8 karakter').max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof schema>

const fields = [
  { name: 'name', label: 'Nama lengkap', type: 'text', placeholder: 'Nama kamu' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'email@kamu.com' },
  { name: 'phone_wa', label: 'Nomor WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx' },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 karakter' },
  {
    name: 'confirmPassword',
    label: 'Konfirmasi password',
    type: 'password',
    placeholder: 'Ulangi password',
  },
] as const

export default function RegisterPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setError(null)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone_wa: data.phone_wa,
        password: data.password,
      }),
    })
    const json = await res.json()
    if (!res.ok) {
      setError(json.error ?? 'Terjadi kesalahan')
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-medium mb-2">Cek email kamu</h2>
          <p className="text-sm text-gray-500">
            Kami sudah kirim link verifikasi. Klik link tersebut untuk mengaktifkan akun.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-sm text-[#4A5FA8] hover:underline"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2] px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight">
            invizoku<span className="text-[#C9A55A]">.</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">Buat akun baru</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                {...register(field.name)}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5FA8]"
              />
              {errors[field.name] && (
                <p className="mt-1 text-xs text-red-500">{errors[field.name]?.message}</p>
              )}
            </div>
          ))}

          <p className="text-xs text-gray-400">
            Nomor WA digunakan untuk notifikasi status undangan kamu.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#4A5FA8] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Mendaftar...' : 'Daftar gratis'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <Link href="/login" className="text-[#4A5FA8] font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
