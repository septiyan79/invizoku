'use client'

import { useState, useEffect, useRef } from 'react'
import QRCode from 'react-qr-code'
import { useGuests, type Guest } from '@/hooks/useGuests'

interface Props {
  orderId: string
  slug: string
  initialGuests: Guest[]
}

function rsvpBadgeCls(status: string) {
  if (status === 'hadir') return 'bg-green-50 text-green-700 border border-green-100'
  if (status === 'tidak') return 'bg-red-50 text-red-600 border border-red-100'
  return 'bg-neutral-100 text-neutral-500'
}

function rsvpLabel(status: string) {
  if (status === 'hadir') return 'Hadir'
  if (status === 'tidak') return 'Tidak'
  return 'Menunggu'
}

export default function GuestManager({ orderId, slug, initialGuests }: Props) {
  const { guests, adding, removing, error, add, remove } = useGuests(orderId, initialGuests)

  const [addMode, setAddMode] = useState<'single' | 'bulk'>('single')
  const [singleName, setSingleName] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [qrGuest, setQrGuest] = useState<Guest | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [origin, setOrigin] = useState('')
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const total = guests.length
  const hadir = guests.filter((g) => g.rsvp_status === 'hadir').length
  const tidak = guests.filter((g) => g.rsvp_status === 'tidak').length
  const pending = guests.filter((g) => g.rsvp_status === 'pending').length

  function guestUrl(token: string) {
    return `${origin}/undangan/${slug}?token=${token}`
  }

  async function handleAddSingle(e: React.FormEvent) {
    e.preventDefault()
    const name = singleName.trim()
    if (!name) return
    await add([name])
    setSingleName('')
  }

  async function handleAddBulk(e: React.FormEvent) {
    e.preventDefault()
    const names = bulkText
      .split('\n')
      .map((n) => n.trim())
      .filter(Boolean)
    if (!names.length) return
    await add(names)
    setBulkText('')
    setAddMode('single')
  }

  async function handleCopy(guest: Guest) {
    await navigator.clipboard.writeText(guestUrl(guest.token))
    setCopied(guest.id)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleDelete(guestId: string) {
    if (confirmDelete !== guestId) {
      setConfirmDelete(guestId)
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
      confirmTimerRef.current = setTimeout(() => setConfirmDelete(null), 3000)
      return
    }
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    setConfirmDelete(null)
    remove(guestId)
  }

  function handleExport() {
    const header = 'Nama,Link Personal,Status RSVP,Waktu RSVP\n'
    const rows = guests
      .map((g) => {
        const url = guestUrl(g.token)
        const status =
          g.rsvp_status === 'hadir'
            ? 'Hadir'
            : g.rsvp_status === 'tidak'
              ? 'Tidak Hadir'
              : 'Belum Respons'
        const rsvpAt = g.rsvp_at ? new Date(g.rsvp_at).toLocaleDateString('id-ID') : '-'
        return `"${g.name}","${url}","${status}","${rsvpAt}"`
      })
      .join('\n')

    const blob = new Blob(['﻿' + header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tamu-${slug}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const bulkCount = bulkText.split('\n').filter((n) => n.trim()).length

  return (
    <div className="space-y-5">
      {/* RSVP stats — only shown when guests exist */}
      {total > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: total, cls: 'text-neutral-700' },
            { label: 'Hadir', value: hadir, cls: 'text-green-600' },
            { label: 'Tidak', value: tidak, cls: 'text-red-500' },
            { label: 'Menunggu', value: pending, cls: 'text-amber-600' },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-xl border border-neutral-100 p-3 text-center"
            >
              <p className={`text-[22px] font-semibold leading-none ${s.cls}`}>{s.value}</p>
              <p className="text-[11px] text-neutral-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add guest form */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-5">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
          <h3 className="text-[13px] font-semibold text-neutral-700">Tambah Tamu</h3>
          <button
            onClick={() => setAddMode(addMode === 'single' ? 'bulk' : 'single')}
            className="text-[11px] text-[#4A5FA8] hover:underline"
          >
            {addMode === 'single' ? 'Tambah banyak sekaligus' : 'Mode satu per satu'}
          </button>
        </div>

        {addMode === 'single' ? (
          <form onSubmit={handleAddSingle} className="flex gap-2">
            <input
              type="text"
              value={singleName}
              onChange={(e) => setSingleName(e.target.value)}
              placeholder="Nama tamu..."
              maxLength={100}
              className="flex-1 px-3 py-2.5 text-[13px] border border-neutral-200 rounded-xl focus:outline-none focus:border-[#4A5FA8] transition-colors placeholder:text-neutral-300"
            />
            <button
              type="submit"
              disabled={adding || !singleName.trim()}
              className="px-4 py-2.5 text-[13px] bg-[#4A5FA8] text-white rounded-xl hover:bg-[#2D4080] transition-colors disabled:opacity-60 shrink-0"
            >
              {adding ? '...' : 'Tambah'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAddBulk} className="space-y-3">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={'Ahmad Fauzi\nBudi Santoso\nSiti Rahayu'}
              rows={5}
              className="w-full px-3 py-2.5 text-[13px] border border-neutral-200 rounded-xl focus:outline-none focus:border-[#4A5FA8] transition-colors placeholder:text-neutral-300 resize-none"
            />
            <p className="text-[11px] text-neutral-400">Satu nama per baris. Maks. 100 tamu sekaligus.</p>
            <button
              type="submit"
              disabled={adding || !bulkText.trim()}
              className="w-full py-2.5 text-[13px] bg-[#4A5FA8] text-white rounded-xl hover:bg-[#2D4080] transition-colors disabled:opacity-60"
            >
              {adding
                ? 'Menambahkan...'
                : `Tambah ${bulkCount} Tamu`}
            </button>
          </form>
        )}

        {error && <p className="text-[12px] text-red-500 mt-3">{error}</p>}
      </div>

      {/* Guest list */}
      {guests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
          <i className="ti ti-users text-[40px] text-neutral-200 block mb-3" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-400">Belum ada tamu</p>
          <p className="text-[12px] text-neutral-300 mt-1">
            Tambahkan nama tamu untuk membuat link personal dan QR code
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          {/* List header */}
          <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-neutral-700">
              Daftar Tamu{' '}
              <span className="text-[12px] font-normal text-neutral-400">({total})</span>
            </p>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
            >
              <i className="ti ti-download text-[13px]" aria-hidden="true" />
              Ekspor CSV
            </button>
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wide px-5 py-2.5">
                    Nama
                  </th>
                  <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wide px-3 py-2.5">
                    RSVP
                  </th>
                  <th className="text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wide px-3 py-2.5">
                    Token
                  </th>
                  <th className="w-28 px-3 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3 text-[13px] font-medium text-neutral-800">
                      {guest.name}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${rsvpBadgeCls(guest.rsvp_status)}`}
                      >
                        {rsvpLabel(guest.rsvp_status)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[11px] text-neutral-400 font-mono">
                        {guest.token.slice(0, 8)}…
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleCopy(guest)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-[#4A5FA8] hover:bg-neutral-100 transition-colors"
                          title="Salin link"
                        >
                          <i
                            className={`ti ${copied === guest.id ? 'ti-check' : 'ti-copy'} text-[13px]`}
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          onClick={() => setQrGuest(guest)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-[#4A5FA8] hover:bg-neutral-100 transition-colors"
                          title="QR Code"
                        >
                          <i className="ti ti-qrcode text-[13px]" aria-hidden="true" />
                        </button>
                        <button
                          onClick={() => handleDelete(guest.id)}
                          disabled={removing === guest.id}
                          className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                            confirmDelete === guest.id
                              ? 'text-red-500 bg-red-50 hover:bg-red-100'
                              : 'text-neutral-300 hover:text-red-400 hover:bg-neutral-100'
                          }`}
                          title={confirmDelete === guest.id ? 'Klik lagi untuk hapus' : 'Hapus'}
                        >
                          <i
                            className={`ti ${confirmDelete === guest.id ? 'ti-alert-triangle' : 'ti-trash'} text-[13px]`}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="sm:hidden divide-y divide-neutral-100">
            {guests.map((guest) => (
              <div key={guest.id} className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <p className="text-[13px] font-medium text-neutral-800">{guest.name}</p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${rsvpBadgeCls(guest.rsvp_status)}`}
                    >
                      {rsvpLabel(guest.rsvp_status)}
                    </span>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleCopy(guest)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-[#4A5FA8] hover:bg-neutral-100 transition-colors"
                    >
                      <i
                        className={`ti ${copied === guest.id ? 'ti-check' : 'ti-copy'} text-[13px]`}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      onClick={() => setQrGuest(guest)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-[#4A5FA8] hover:bg-neutral-100 transition-colors"
                    >
                      <i className="ti ti-qrcode text-[13px]" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id)}
                      disabled={removing === guest.id}
                      className={`p-1.5 rounded-lg transition-colors disabled:opacity-40 ${
                        confirmDelete === guest.id
                          ? 'text-red-500 bg-red-50'
                          : 'text-neutral-300 hover:text-red-400 hover:bg-neutral-100'
                      }`}
                    >
                      <i
                        className={`ti ${confirmDelete === guest.id ? 'ti-alert-triangle' : 'ti-trash'} text-[13px]`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">
                  token: {guest.token.slice(0, 8)}…
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QR Code modal */}
      {qrGuest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setQrGuest(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-semibold text-neutral-800">{qrGuest.name}</p>
              <button
                onClick={() => setQrGuest(null)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                <i className="ti ti-x text-[16px]" aria-hidden="true" />
              </button>
            </div>

            <div className="flex justify-center p-5 bg-white rounded-xl border border-neutral-100 mb-4">
              <QRCode value={guestUrl(qrGuest.token)} size={180} />
            </div>

            <p className="text-[11px] text-neutral-500 break-all font-mono mb-4 p-3 bg-neutral-50 rounded-xl leading-relaxed">
              {guestUrl(qrGuest.token)}
            </p>

            <button
              onClick={() => handleCopy(qrGuest)}
              className="w-full py-2.5 text-[13px] bg-[#4A5FA8] text-white rounded-xl hover:bg-[#2D4080] transition-colors flex items-center justify-center gap-2"
            >
              <i
                className={`ti ${copied === qrGuest.id ? 'ti-check' : 'ti-copy'} text-[13px]`}
                aria-hidden="true"
              />
              {copied === qrGuest.id ? 'Tersalin!' : 'Salin Link'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
