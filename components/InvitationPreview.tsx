'use client'

import { useState, useRef, useImperativeHandle, forwardRef } from 'react'

export interface InvitationPreviewHandle {
  reload: () => void
}

interface Props {
  slug: string
  hint?: string
}

const InvitationPreview = forwardRef<InvitationPreviewHandle, Props>(
  function InvitationPreview({ slug, hint }, ref) {
    const [loading, setLoading] = useState(true)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useImperativeHandle(ref, () => ({
      reload() {
        setLoading(true)
        iframeRef.current?.contentWindow?.location.reload()
      },
    }))

    function handleManualReload() {
      setLoading(true)
      iframeRef.current?.contentWindow?.location.reload()
    }

    return (
      <div className="hidden md:block">
        <div className="sticky top-8">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <p className="text-[12px] font-medium text-neutral-500">Preview</p>
            <div className="flex gap-1">
              <button
                onClick={handleManualReload}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title="Muat ulang"
              >
                <i className="ti ti-refresh text-[14px]" aria-hidden="true" />
              </button>
              <a
                href={`/undangan/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                title="Buka di tab baru"
              >
                <i className="ti ti-external-link text-[14px]" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div
            className="relative rounded-2xl border border-neutral-200 overflow-hidden shadow-sm bg-neutral-100"
            style={{ height: 'calc(100vh - 200px)', minHeight: '520px' }}
          >
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FAFAF9] gap-3 z-10">
                <div className="w-5 h-5 border-2 border-[#4A5FA8] border-t-transparent rounded-full animate-spin" />
                <p className="text-[11px] text-neutral-400">Memuat preview...</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`/undangan/${slug}`}
              className="w-full h-full border-0"
              title="Preview undangan"
              onLoad={() => setLoading(false)}
            />
          </div>

          {hint && (
            <p className="text-[10px] text-neutral-400 text-center mt-2">{hint}</p>
          )}
        </div>
      </div>
    )
  }
)

export default InvitationPreview
