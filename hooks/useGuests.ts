'use client'

import { useState, useCallback } from 'react'

export interface Guest {
  id: string
  name: string
  token: string
  rsvp_status: 'pending' | 'hadir' | 'tidak'
  rsvp_at: string | null
  created_at: string
}

export function useGuests(orderId: string, initial: Guest[]) {
  const [guests, setGuests] = useState<Guest[]>(initial)
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const add = useCallback(
    async (names: string[]) => {
      setAdding(true)
      setError(null)
      try {
        const res = await fetch(`/api/tamu/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ names }),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'Gagal menambahkan tamu')
        const { guests: created } = await res.json()
        setGuests((prev) => [...created, ...prev])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setAdding(false)
      }
    },
    [orderId],
  )

  const remove = useCallback(
    async (guestId: string) => {
      setRemoving(guestId)
      setError(null)
      try {
        const res = await fetch(`/api/tamu/${orderId}/${guestId}`, { method: 'DELETE' })
        if (!res.ok) throw new Error((await res.json()).error ?? 'Gagal menghapus tamu')
        setGuests((prev) => prev.filter((g) => g.id !== guestId))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      } finally {
        setRemoving(null)
      }
    },
    [orderId],
  )

  return { guests, adding, removing, error, add, remove }
}
