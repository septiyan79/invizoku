export default function Watermark() {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full shadow-md"
      style={{ background: '#FDF4E8', border: '1px solid #E8C98A', color: '#8B6845' }}
    >
      <i className="ti ti-award text-[13px]" style={{ color: '#C9A55A' }} aria-hidden="true" />
      Dibuat dengan <strong className="ml-0.5">Invizoku</strong>
    </div>
  )
}
