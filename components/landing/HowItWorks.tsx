import Link from 'next/link'

const steps = [
  {
    num: 1,
    label: 'Pilih tema',
    icon: 'ti ti-template',
    title: '50+ tema untuk setiap momen',
    desc: 'Pilih dari koleksi tema pernikahan, ulang tahun, aqiqah, hingga tema anime eksklusif.',
    details: [
      { icon: 'ti ti-eye', text: 'Preview langsung sebelum beli' },
      { icon: 'ti ti-heart', text: 'Simpan favorit untuk dibandingkan' },
      { icon: 'ti ti-lock-open', text: 'Coba gratis tanpa kartu kredit' },
    ],
    gold: false,
  },
  {
    num: 2,
    label: 'Bayar & isi data',
    icon: 'ti ti-shopping-cart',
    title: 'Checkout otomatis, langsung aktif',
    desc: 'Bayar via VA bank, QRIS, atau e-wallet — undangan aktif dalam hitungan detik.',
    badge: 'Pertama di Indonesia',
    details: [
      { icon: 'ti ti-edit', text: 'Isi sendiri via dashboard' },
      { icon: 'ti ti-tools', text: 'Atau minta admin kerjakan (Pro & Studio)' },
      { icon: 'ti ti-eye', text: 'Preview real-time setiap perubahan' },
    ],
    gold: true,
  },
  {
    num: 3,
    label: 'Sebar & pantau',
    icon: 'ti ti-send',
    title: 'Sebar via WhatsApp, pantau RSVP',
    desc: 'Kirim link personal ke setiap tamu dan pantau kehadiran secara real-time dari dashboard.',
    details: [
      { icon: 'ti ti-qrcode', text: 'QR Code unik per tamu' },
      { icon: 'ti ti-users', text: 'Pantau RSVP & ucapan langsung' },
      { icon: 'ti ti-bell', text: 'Notifikasi WhatsApp otomatis' },
    ],
    gold: false,
  },
]

export default function HowItWorks() {
  return (
    <section id="cara-kerja" className="px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#C9A55A] bg-[#FDF4E8] border border-[#E8C98A] px-3 py-1 rounded-full mb-4">
            <i className="ti ti-sparkles text-sm" aria-hidden="true" />
            Semudah itu
          </div>
          <h2 className="text-[28px] font-medium text-neutral-900 tracking-tight mb-2">
            Tiga langkah, undangan siap sebar
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed max-w-md mx-auto">
            Tidak perlu keahlian desain. Tidak perlu tunggu konfirmasi. Bayar, edit, sebar —
            selesai.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-0 relative">
          <div
            className="absolute border-t border-dashed border-neutral-300 z-0"
            style={{ top: 22, left: 'calc(33.33% - 12px)', width: 'calc(33.33% + 24px)' }}
          />
          <div
            className="absolute border-t border-dashed border-neutral-300 z-0"
            style={{ top: 22, left: 'calc(66.66% - 12px)', width: 'calc(33.33% + 24px)' }}
          />

          {steps.map((step) => (
            <div key={step.num} className="px-5 relative z-10">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-[15px] font-medium flex-shrink-0 ${
                    step.gold ? 'bg-[#E8C98A] text-[#7A5A1A]' : 'bg-[#4A5FA8] text-white'
                  }`}
                >
                  {step.num}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-widest text-neutral-400">
                  {step.label}
                </span>
              </div>

              <div
                className={`rounded-xl p-5 mb-3 ${
                  step.gold
                    ? 'border border-[#E8C98A] bg-[#FDF4E8]'
                    : 'border border-neutral-200 bg-white'
                }`}
              >
                <i
                  className={`${step.icon} text-[22px] mb-3 block ${
                    step.gold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'
                  }`}
                  aria-hidden="true"
                />
                <p className="text-[14px] font-medium text-neutral-800 mb-1.5">{step.title}</p>
                <p className="text-[12px] text-neutral-500 leading-relaxed">{step.desc}</p>
                {step.badge && (
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 bg-[#FDF4E8] text-[#7A5A1A] border border-[#E8C98A]">
                    {step.badge}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                {step.details.map((d) => (
                  <div
                    key={d.text}
                    className="flex items-center gap-2 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-lg px-3 py-2"
                  >
                    <i
                      className={`${d.icon} text-[13px] flex-shrink-0 ${
                        step.gold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'
                      }`}
                      aria-hidden="true"
                    />
                    {d.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-10 border-t border-neutral-200 text-center">
          <p className="text-[14px] text-neutral-500 mb-4">
            Siap buat undangan digitalmu sekarang?
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#4A5FA8] hover:bg-[#2D4080] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <i className="ti ti-sparkles" aria-hidden="true" />
              Mulai gratis
            </Link>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-[#E8C98A] hover:bg-[#C9A55A] text-[#7A5A1A] text-[13px] font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              <i className="ti ti-template" aria-hidden="true" />
              Lihat semua tema
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
