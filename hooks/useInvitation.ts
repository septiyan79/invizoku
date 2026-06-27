'use client'

import { useState } from 'react'
import type { InvitationData } from '@/types/invitation'

interface SaveState {
  saving: boolean
  savedAt: Date | null
  error: string | null
}

export function useInvitation(orderId: string) {
  const [state, setState] = useState<SaveState>({
    saving: false,
    savedAt: null,
    error: null,
  })

  async function save(content: Partial<InvitationData>) {
    setState((s) => ({ ...s, saving: true, error: null }))
    try {
      const res = await fetch(`/api/undangan/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Gagal menyimpan')
      setState({ saving: false, savedAt: new Date(), error: null })
    } catch (err) {
      setState((s) => ({
        ...s,
        saving: false,
        error: err instanceof Error ? err.message : 'Terjadi kesalahan',
      }))
    }
  }

  return { ...state, save }
}
