'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAssist, type AssistData } from '@/hooks/useAssist'

interface Props {
  orderId: string
  slug: string
  initial: AssistData
}

export default function AssistPanel({ orderId, slug, initial }: Props) {
  const { data, loading, error, submit, accept, requestRevision } = useAssist(orderId, initial)
  const [notes, setNotes] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [revisionNote, setRevisionNote] = useState('')

  const remainingRevisions = data.max_revisions - data.revision_count
  const canRevise = remainingRevisions > 0

  async function handleSubmit() {
    await submit(notes)
  }

  async function handleAccept() {
    await accept()
  }

  async function handleRevision() {
    const ok = await requestRevision(revisionNote)
    if (ok) {
      setShowRevisionForm(false)
      setRevisionNote('')
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[12px] text-red-600">
          {error}
        </div>
      )}

      {/* ── idle: form kirim permintaan ── */}
      {data.assist_status === 'idle' && (
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-50">
            <h2 className="text-[15px] font-medium text-neutral-800">Kirim Permintaan Terima Beres</h2>
            <p className="text-[12px] text-neutral-400 mt-1">
              Tim admin akan mengerjakan undangan sesuai data yang sudah kamu isi.
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-[12px] text-amber-700 space-y-1">
              <p className="font-medium">Sebelum mengirim, pastikan:</p>
              <ul className="list-disc list-inside space-y-0.5 text-amber-600">
                <li>Data acara sudah diisi dengan benar</li>
                <li>Foto sudah diupload (cover, galeri, dsb)</li>
                <li>Nama mempelai / pihak yang terlibat sudah benar</li>
              </ul>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                Catatan untuk Admin{' '}
                <span className="font-normal text-neutral-400">(opsional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Contoh: tolong sesuaikan warna dengan tema dusty pink, tambahkan kutipan di bagian pembuka..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-[13px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-[#4A5FA8] resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-[#4A5FA8] text-white text-[13px] font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
              >
                {loading ? 'Mengirim...' : 'Kirim Permintaan'}
              </button>
              <Link
                href={`/dashboard/edit/${orderId}`}
                className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Lengkapi data dulu
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── waiting_admin: menunggu admin ── */}
      {data.assist_status === 'waiting_admin' && (
        <div className="bg-white rounded-2xl border border-neutral-100 px-6 py-8 text-center">
          <i className="ti ti-clock text-[36px] text-amber-400 block mb-3" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-700 mb-1">Permintaan Diterima</p>
          <p className="text-[12px] text-neutral-400 leading-relaxed">
            Tim admin akan segera memulai pengerjaan. Estimasi mulai dalam 1×24 jam.
            <br />
            Kamu akan mendapat notifikasi WhatsApp saat pengerjaan dimulai.
          </p>
          {data.ticket?.notes && (
            <div className="mt-4 text-left bg-neutral-50 rounded-xl px-4 py-3">
              <p className="text-[11px] text-neutral-400 mb-1">Catatan yang dikirim:</p>
              <p className="text-[12px] text-neutral-600 whitespace-pre-wrap">{data.ticket.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* ── in_progress: sedang dikerjakan ── */}
      {data.assist_status === 'in_progress' && (
        <div className="bg-white rounded-2xl border border-neutral-100 px-6 py-8 text-center">
          <i className="ti ti-tools text-[36px] text-[#4A5FA8] block mb-3" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-700 mb-1">Sedang Dikerjakan</p>
          <p className="text-[12px] text-neutral-400 leading-relaxed">
            Admin sedang mengerjakan undanganmu.
            <br />
            Estimasi selesai dalam 3×24 jam. Kamu akan dinotifikasi via WhatsApp saat selesai.
          </p>
          {data.revision_count > 0 && (
            <p className="mt-3 text-[11px] text-neutral-400">
              Revisi ke-{data.revision_count} dari {data.max_revisions}
            </p>
          )}
        </div>
      )}

      {/* ── waiting_review: siap ditinjau ── */}
      {data.assist_status === 'waiting_review' && (
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-neutral-50">
            <div className="flex items-center gap-2 mb-1">
              <i className="ti ti-eye text-[16px] text-[#4A5FA8]" aria-hidden="true" />
              <h2 className="text-[15px] font-medium text-neutral-800">Siap Ditinjau</h2>
            </div>
            <p className="text-[12px] text-neutral-400">
              Admin sudah selesai mengerjakan undanganmu. Buka undangan, lalu pilih ACC atau minta revisi.
            </p>
          </div>

          <div className="px-6 py-5 space-y-4">
            <Link
              href={`/undangan/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-neutral-200 text-[13px] text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
            >
              <i className="ti ti-external-link text-[14px]" aria-hidden="true" />
              Buka Undangan
            </Link>

            {!showRevisionForm ? (
              <div className="flex gap-2">
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#4A5FA8] text-white text-[13px] font-medium hover:bg-[#2D4080] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Memproses...' : '✓ ACC — Terima Hasilnya'}
                </button>
                {canRevise && (
                  <button
                    onClick={() => setShowRevisionForm(true)}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-[13px] text-neutral-600 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-60"
                  >
                    Minta Revisi
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-medium text-neutral-600 mb-1.5">
                    Catatan Revisi
                  </label>
                  <textarea
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    rows={3}
                    placeholder="Jelaskan apa yang perlu diperbaiki..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-[13px] text-neutral-700 placeholder:text-neutral-300 focus:outline-none focus:border-[#4A5FA8] resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRevision}
                    disabled={loading || !revisionNote.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Permintaan Revisi'}
                  </button>
                  <button
                    onClick={() => { setShowRevisionForm(false); setRevisionNote('') }}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl border border-neutral-200 text-[12px] text-neutral-500 hover:border-neutral-300 transition-colors disabled:opacity-60"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {!canRevise && !showRevisionForm && (
              <p className="text-[11px] text-neutral-400 text-center">
                Jatah revisi ({data.max_revisions}x) sudah habis — hanya bisa ACC.
              </p>
            )}

            <p className="text-[11px] text-neutral-400 text-center">
              Sisa revisi: {remainingRevisions} dari {data.max_revisions}
            </p>
          </div>
        </div>
      )}

      {/* ── done: selesai ── */}
      {data.assist_status === 'done' && (
        <div className="bg-white rounded-2xl border border-neutral-100 px-6 py-8 text-center">
          <i className="ti ti-circle-check text-[36px] text-green-500 block mb-3" aria-hidden="true" />
          <p className="text-[14px] font-medium text-neutral-700 mb-1">Pengerjaan Selesai!</p>
          <p className="text-[12px] text-neutral-400 leading-relaxed mb-5">
            Undanganmu sudah siap disebarkan ke tamu-tamu.
          </p>
          <Link
            href={`/undangan/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4A5FA8] text-white text-[13px] font-medium hover:bg-[#2D4080] transition-colors"
          >
            <i className="ti ti-external-link text-[14px]" aria-hidden="true" />
            Lihat Undangan
          </Link>
          {data.revision_count > 0 && (
            <p className="mt-4 text-[11px] text-neutral-400">
              Revisi digunakan: {data.revision_count} dari {data.max_revisions}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
