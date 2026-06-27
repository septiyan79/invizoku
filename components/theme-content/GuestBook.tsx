'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: string
  guest_name: string
  content: string
  created_at: string
}

interface GuestBookProps {
  orderId: string
  accentColor?: string
  className?: string
}

export default function GuestBook({ orderId, accentColor = '#4A5FA8', className = '' }: GuestBookProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/ucapan?orderId=${orderId}`)
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => {})
  }, [orderId])

  async function submit() {
    if (!name.trim() || !content.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/ucapan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, guest_name: name.trim(), content: content.trim() }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Gagal mengirim')
      const data = await res.json()
      setMessages((prev) => [data.message, ...prev])
      setContent('')
      setSent(true)
      setTimeout(() => setSent(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama kamu"
          className="w-full text-[14px] px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-400"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis ucapan untuk pasangan..."
          rows={3}
          className="w-full text-[13px] px-4 py-2.5 rounded-xl border border-neutral-200 bg-white focus:outline-none focus:border-neutral-400 resize-none"
        />
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        <button
          onClick={submit}
          disabled={!name.trim() || !content.trim() || loading}
          className="w-full py-2.5 rounded-xl text-[13px] font-medium text-white transition-opacity disabled:opacity-40"
          style={{ background: accentColor }}
        >
          {sent ? '✓ Terkirim!' : loading ? 'Mengirim...' : 'Kirim ucapan'}
        </button>
      </div>

      {messages.length > 0 && (
        <div className="space-y-3 pt-2">
          {messages.map((msg) => (
            <div key={msg.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <p className="text-[12px] font-medium text-neutral-700 mb-1">{msg.guest_name}</p>
              <p className="text-[13px] text-neutral-600 leading-relaxed">{msg.content}</p>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <p className="text-center text-[13px] text-neutral-400 py-4">
          Belum ada ucapan. Jadilah yang pertama!
        </p>
      )}
    </div>
  )
}
