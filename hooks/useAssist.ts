'use client'

import { useState, useCallback } from 'react'

export interface AssistData {
  assist_status: string
  package: string
  revision_count: number
  max_revisions: number
  ticket: {
    id: string
    notes: string | null
    revision_note: string | null
    status: string
  } | null
}

export function useAssist(orderId: string, initial: AssistData) {
  const [data, setData] = useState<AssistData>(initial)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = useCallback(
    async (notes: string) => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/bantuan/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        })
        if (!res.ok) {
          const d = await res.json()
          setError(d.error ?? 'Gagal mengirim permintaan')
          return false
        }
        setData((prev) => ({ ...prev, assist_status: 'waiting_admin' }))
        return true
      } finally {
        setLoading(false)
      }
    },
    [orderId]
  )

  const accept = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/bantuan/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Gagal ACC')
        return false
      }
      setData((prev) => ({ ...prev, assist_status: 'done' }))
      return true
    } finally {
      setLoading(false)
    }
  }, [orderId])

  const requestRevision = useCallback(
    async (revisionNote: string) => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/bantuan/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'revision', revision_note: revisionNote }),
        })
        if (!res.ok) {
          const d = await res.json()
          setError(d.error ?? 'Gagal mengajukan revisi')
          return false
        }
        setData((prev) => ({
          ...prev,
          assist_status: 'in_progress',
          revision_count: prev.revision_count + 1,
        }))
        return true
      } finally {
        setLoading(false)
      }
    },
    [orderId]
  )

  return { data, loading, error, submit, accept, requestRevision }
}
