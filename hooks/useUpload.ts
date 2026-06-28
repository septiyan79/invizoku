'use client'

import { useState } from 'react'

export type UploadType = 'cover' | 'gallery' | 'lovestory' | 'qris'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

function addTransform(url: string): string {
  return url.replace('/upload/', '/upload/f_auto,q_auto/')
}

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
      // 1. Dapatkan signed params dari server
      const paramRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, type }),
      })
      if (!paramRes.ok) {
        const data = await paramRes.json()
        setError(data.error ?? 'Gagal mendapatkan izin upload')
        return null
      }
      const { cloudName, apiKey, timestamp, signature, publicId } = await paramRes.json()

      // 2. Upload langsung ke Cloudinary
      const form = new FormData()
      form.append('file', file)
      form.append('api_key', apiKey)
      form.append('timestamp', String(timestamp))
      form.append('signature', signature)
      form.append('public_id', publicId)

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: form }
      )
      if (!uploadRes.ok) {
        setError('Upload ke server gagal, coba lagi')
        return null
      }
      const uploadData = await uploadRes.json()

      // 3. Tambahkan transformasi f_auto,q_auto ke URL
      return addTransform(uploadData.secure_url as string)
    } catch {
      setError('Koneksi bermasalah, coba lagi')
      return null
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading, error, clearError: () => setError(null) }
}
