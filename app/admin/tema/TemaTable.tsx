'use client'

import { useState } from 'react'

interface Theme {
  id: string
  name: string
  component_key: string
  event_categories: string[]
  style_tag: string
  is_active: boolean
  orderCount: number
  created_at: string
}

export default function TemaTable({ themes }: { themes: Theme[] }) {
  const [list, setList] = useState(themes)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleActive(id: string, current: boolean) {
    setLoading(id)
    try {
      const res = await fetch(`/api/admin/tema/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      })
      if (res.ok) {
        setList((prev) => prev.map((t) => t.id === id ? { ...t, is_active: !current } : t))
      }
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-neutral-100 text-left text-[11px] text-neutral-400 uppercase tracking-wide">
            <th className="px-4 py-3 font-medium">Nama</th>
            <th className="px-4 py-3 font-medium">Component Key</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Style</th>
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {list.map((theme) => (
            <tr key={theme.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
              <td className="px-4 py-3 font-medium text-neutral-700">{theme.name}</td>
              <td className="px-4 py-3 font-mono text-[11px] text-neutral-400">{theme.component_key}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {theme.event_categories.map((c: string) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-md">{c}</span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-neutral-500">{theme.style_tag}</td>
              <td className="px-4 py-3 text-neutral-500">{theme.orderCount}</td>
              <td className="px-4 py-3">
                <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                  theme.is_active
                    ? 'bg-green-50 text-green-600 border-green-100'
                    : 'bg-neutral-100 text-neutral-400 border-neutral-200'
                }`}>
                  {theme.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleActive(theme.id, theme.is_active)}
                  disabled={loading === theme.id}
                  className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors disabled:opacity-50"
                >
                  {loading === theme.id ? '...' : theme.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
