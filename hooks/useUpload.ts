'use client'

import { useState } from 'react'

export type UploadType = 'cover' | 'gallery' | 'lovestory' | 'qris'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

export function useUpload(orderId: string) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function upload(file: File, type: UploadType): Promise<string | null> {
    setError(null)

    if (!ALLOWED.includes(file.type)) {
      setError('Format tidak didukung. Gunakan JPG, PNG, atau WEBP.')
      return null
    }
    if (file.size > MAX_SIZE) {
      setError('Ukuran file maksimal 5MB.')
      return null
    }

    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('orderId', orderId)
      form.append('type', type)

      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? `Upload gagal (${res.status})`)
        return null
      }

      return data.url as string
    } catch {
      setError('Koneksi bermasalah, coba lagi')
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error, clearError: () => setError(null) }
}
