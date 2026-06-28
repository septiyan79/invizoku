'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  currentUrl?: string
  onFile?: (file: File) => void
  onFiles?: (files: File[]) => void
  multiple?: boolean
  uploading?: boolean
  label?: string
  hint?: string
}

export default function UploadZone({ currentUrl, onFile, onFiles, multiple, uploading, label, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (multiple && onFiles) {
      onFiles(Array.from(files))
    } else if (onFile) {
      onFile(files[0])
    }
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
        dragging
          ? 'border-[#4A5FA8] bg-[#EEF0F9]'
          : 'border-neutral-200 bg-neutral-50 hover:border-[#4A5FA8] hover:bg-[#EEF0F9]/40'
      } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {currentUrl ? (
        <div className="relative w-full h-44 rounded-xl overflow-hidden">
          <Image src={currentUrl} alt={label ?? 'Foto'} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
            <span className="text-white text-[12px] font-medium flex items-center gap-1.5">
              <i className="ti ti-upload text-[14px]" />
              Ganti foto
            </span>
          </div>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          {uploading ? (
            <div className="w-6 h-6 border-2 border-[#4A5FA8] border-t-transparent rounded-full animate-spin mb-3" />
          ) : (
            <i className="ti ti-cloud-upload text-[28px] text-neutral-300 mb-3" aria-hidden="true" />
          )}
          <p className="text-[13px] text-neutral-500 font-medium">
            {uploading ? 'Mengupload...' : label ?? 'Klik atau seret foto ke sini'}
          </p>
          {hint && !uploading && (
            <p className="text-[11px] text-neutral-400 mt-1">{hint}</p>
          )}
        </div>
      )}
    </div>
  )
}
