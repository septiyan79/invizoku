import Link from 'next/link'

const trustNotes = [
  'Gratis tanpa batas waktu',
  'Aktif langsung setelah bayar',
  'Upgrade kapan saja',
  'Bayar sekali, bukan langganan',
]

export default function CtaFinal() {
  return (
    <section className="px-8 py-20 bg-neutral-50 border-t border-neutral-200 text-center">
      <div className="max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#C9A55A] bg-[#FDF4E8] border border-[#E8C98A] px-3 py-1 rounded-full mb-5">
          <i className="ti ti-heart text-sm" aria-hidden="true" />
          Mulai hari ini
        </div>

        <h2 className="text-[32px] font-medium text-neutral-900 tracking-tight leading-tight mb-3">
          Hari istimewamu layak dapat undangan yang{' '}
          <span className="text-[#4A5FA8]">istimewa</span> juga
        </h2>

        <p className="text-[14px] text-neutral-500 leading-relaxed mb-8">
          Coba gratis sekarang — tidak perlu kartu kredit, tidak perlu tunggu persetujuan siapapun.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mb-5">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#4A5FA8] hover:bg-[#2D4080] text-white text-[14px] font-medium px-7 py-3 rounded-lg transition-colors"
          >
            <i className="ti ti-sparkles" aria-hidden="true" />
            Buat undangan gratis
          </Link>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 bg-[#E8C98A] hover:bg-[#C9A55A] text-[#7A5A1A] text-[14px] font-medium px-7 py-3 rounded-lg transition-colors"
          >
            <i className="ti ti-template" aria-hidden="true" />
            Lihat semua tema
          </Link>
        </div>

        <div className="flex items-center justify-center gap-5 flex-wrap">
          {trustNotes.map((note) => (
            <div key={note} className="flex items-center gap-1.5 text-[12px] text-neutral-400">
              <i className="ti ti-check text-[#4A5FA8] text-sm" aria-hidden="true" />
              {note}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
