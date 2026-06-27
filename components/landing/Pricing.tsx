import Link from 'next/link'

type Feature = { text: string; available: boolean }
type Package = {
  id: string
  badge: string
  badgeStyle: string
  name: string
  tagline: string
  price: string
  period: string
  masa: string
  masaStyle: string
  features: Feature[]
  btnLabel: string
  btnStyle: string
  href: string
  featured?: boolean
  studio?: boolean
  goldCheck?: boolean
}

const packages: Package[] = [
  {
    id: 'trial',
    badge: 'Gratis dulu',
    badgeStyle: 'bg-neutral-100 text-neutral-500',
    name: 'Trial',
    tagline: 'Penasaran dulu? Coba aja, tidak perlu kartu kredit.',
    price: 'Rp 0',
    period: 'Selamanya, sampai siap upgrade',
    masa: 'Tanpa batas waktu',
    masaStyle: 'bg-neutral-100 text-neutral-500',
    features: [
      { text: 'Pilih dari 3–5 tema pilihan', available: true },
      { text: 'Isi nama, tanggal, lokasi', available: true },
      { text: 'Upload 2 foto', available: true },
      { text: 'Lihat tampilan aslinya', available: true },
      { text: 'Belum bisa disebar ke tamu', available: false },
      { text: 'Ada watermark Invizoku', available: false },
    ],
    btnLabel: 'Cobain gratis',
    btnStyle: 'border border-neutral-200 text-neutral-500 hover:border-[#4A5FA8] hover:text-[#4A5FA8]',
    href: '/register',
  },
  {
    id: 'basic',
    badge: 'Basic',
    badgeStyle: 'bg-neutral-100 text-neutral-500',
    name: 'Basic',
    tagline: 'Sudah tahu mau apa? Langsung isi sendiri.',
    price: 'Rp 79rb',
    period: 'Sekali bayar, bukan langganan',
    masa: 'Aktif 6 bulan',
    masaStyle: 'bg-[#EEF0F9] text-[#2D4080]',
    features: [
      { text: 'Semua tema standar', available: true },
      { text: 'Galeri sampai 10 foto', available: true },
      { text: 'RSVP & buku ucapan', available: true },
      { text: 'Angpao digital (rek, QRIS, alamat)', available: true },
      { text: 'Tamu & link tidak terbatas', available: true },
      { text: 'Musik latar dari library', available: true },
      { text: 'Bantuan dari admin', available: false },
    ],
    btnLabel: 'Mulai dengan Basic',
    btnStyle: 'bg-[#4A5FA8] text-white hover:bg-[#2D4080]',
    href: '/checkout?paket=basic',
  },
  {
    id: 'pro',
    badge: 'Paling banyak dipilih',
    badgeStyle: 'bg-[#EEF0F9] text-[#2D4080]',
    name: 'Pro',
    tagline: 'Mau dibantu tapi tetap bisa edit sendiri.',
    price: 'Rp 149rb',
    period: 'Sekali bayar, bukan langganan',
    masa: 'Aktif 6 bulan',
    masaStyle: 'bg-[#EEF0F9] text-[#2D4080]',
    features: [
      { text: 'Semua yang ada di Basic', available: true },
      { text: 'Tema anime, kartun & eksklusif', available: true },
      { text: 'Galeri sampai 30 foto', available: true },
      { text: 'Love story & perjalanan kalian', available: true },
      { text: 'Sisipkan video YouTube', available: true },
      { text: 'Balas ucapan tamu langsung', available: true },
      { text: 'Admin buatkan + 1x revisi', available: true },
    ],
    btnLabel: 'Pilih Pro',
    btnStyle: 'bg-[#4A5FA8] text-white hover:bg-[#2D4080]',
    href: '/checkout?paket=pro',
    featured: true,
  },
  {
    id: 'studio',
    badge: 'Studio',
    badgeStyle: 'bg-[#FDF4E8] text-[#7A5A1A]',
    name: 'Studio',
    tagline: 'Tidak mau repot sama sekali? Serahkan ke kami.',
    price: 'Rp 199rb',
    period: 'Sekali bayar, bukan langganan',
    masa: 'Aktif 1 tahun',
    masaStyle: 'bg-[#FDF4E8] text-[#7A5A1A]',
    features: [
      { text: 'Semua yang ada di Pro', available: true },
      { text: 'Foto galeri tidak dibatasi', available: true },
      { text: 'Admin buatkan + 3x revisi', available: true },
      { text: 'Masuk antrian prioritas', available: true },
      { text: 'Love story sampai 20 foto', available: true },
      { text: 'Sisipkan video & live streaming', available: true },
      { text: 'Undangan aktif sampai 1 tahun', available: true },
    ],
    btnLabel: 'Pilih Studio',
    btnStyle: 'bg-[#E8C98A] text-[#7A5A1A] hover:bg-[#C9A55A] hover:text-white font-medium',
    href: '/checkout?paket=studio',
    studio: true,
    goldCheck: true,
  },
]

const trustItems = [
  { icon: 'ti ti-shield-check', text: 'Bayar aman lewat Midtrans' },
  { icon: 'ti ti-bolt', text: 'Aktif langsung setelah bayar' },
  { icon: 'ti ti-refresh', text: 'Bisa perpanjang kapan saja' },
  { icon: 'ti ti-arrow-up', text: 'Upgrade paket kapan saja' },
]

const faqs = [
  {
    q: 'Apakah ada biaya tambahan?',
    a: 'Tidak ada. Harga yang tertera sudah termasuk semua fitur sesuai paket. Tidak ada biaya tersembunyi.',
  },
  {
    q: 'Apa yang terjadi setelah masa aktif habis?',
    a: 'Halaman undangan tidak bisa diakses tamu. Data Anda masih aman selama 30 hari. Kami kirim pengingat H-14 dan H-1 sebelum expired.',
  },
  {
    q: 'Berapa lama terima beres diselesaikan?',
    a: 'Maksimal 3×24 jam. Paket Studio mendapat prioritas antrian dan biasanya selesai lebih cepat.',
  },
  {
    q: 'Bisa upgrade ke paket lebih tinggi nanti?',
    a: 'Bisa. Upgrade tersedia kapan saja dari dashboard dengan harga khusus — bukan harga penuh.',
  },
]

export default function Pricing() {
  return (
    <section className="px-4 md:px-8 py-12 md:py-20 bg-[#FDF8F2] border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#C9A55A] bg-[#FDF4E8] border border-[#E8C98A] px-3 py-1 rounded-full mb-4">
            <i className="ti ti-tag text-sm" aria-hidden="true" />
            Harga transparan
          </div>
          <h2 className="text-[28px] font-medium text-neutral-900 tracking-tight mb-2">
            Bayar sekali, langsung beres
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed max-w-sm mx-auto">
            Tidak ada biaya bulanan. Tidak ada kejutan di akhir. Pilih paket yang cocok, undangan
            langsung aktif.
          </p>
        </div>

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-4 px-4 mb-5 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:overflow-x-visible md:snap-none md:pb-0 md:mb-8 lg:grid-cols-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`snap-start shrink-0 w-[82vw] sm:w-72 md:w-auto rounded-xl p-5 flex flex-col border bg-white ${
                pkg.featured
                  ? 'border-[#4A5FA8] border-2'
                  : pkg.studio
                  ? 'border-[#C9A55A]'
                  : 'border-neutral-200'
              }`}
            >
              <span className={`text-[10px] px-2.5 py-1 rounded-full inline-block mb-3 font-medium ${pkg.badgeStyle}`}>
                {pkg.id === 'pro' && <i className="ti ti-star text-[10px] mr-1" aria-hidden="true" />}
                {pkg.id === 'studio' && <i className="ti ti-crown text-[10px] mr-1" aria-hidden="true" />}
                {pkg.badge}
              </span>

              <p className="text-[15px] font-medium text-neutral-800 mb-1">{pkg.name}</p>
              <p className="text-[11px] text-neutral-400 mb-4 leading-relaxed">{pkg.tagline}</p>

              <p className={`text-[26px] font-medium tracking-tight mb-1 ${pkg.id === 'trial' ? 'text-[#4A5FA8]' : 'text-neutral-900'}`}>
                {pkg.price}
              </p>
              <p className="text-[11px] text-neutral-400 pb-4 mb-4 border-b border-neutral-100">
                {pkg.period}
              </p>

              <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full mb-4 self-start ${pkg.masaStyle}`}>
                <i
                  className={`${pkg.id === 'trial' ? 'ti ti-infinity' : 'ti ti-clock'} text-[11px]`}
                  aria-hidden="true"
                />
                {pkg.masa}
              </span>

              <ul className="flex flex-col gap-2 flex-1 mb-5">
                {pkg.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-[11px] leading-relaxed">
                    <i
                      className={`${f.available ? 'ti ti-check' : 'ti ti-x'} text-[13px] shrink-0 mt-0.5 ${
                        f.available
                          ? pkg.goldCheck
                            ? 'text-[#C9A55A]'
                            : 'text-[#4A5FA8]'
                          : 'text-neutral-300'
                      }`}
                      aria-hidden="true"
                    />
                    <span className={f.available ? 'text-neutral-600' : 'text-neutral-300'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={pkg.href}
                className={`w-full py-2.5 rounded-lg text-[12px] text-center transition-colors mt-auto flex items-center justify-center gap-1.5 ${pkg.btnStyle}`}
              >
                {pkg.id === 'trial' && <i className="ti ti-sparkles text-[12px]" aria-hidden="true" />}
                {pkg.id === 'studio' && <i className="ti ti-crown text-[12px]" aria-hidden="true" />}
                {pkg.id !== 'trial' && pkg.id !== 'studio' && (
                  <i className="ti ti-arrow-right text-[12px]" aria-hidden="true" />
                )}
                {pkg.btnLabel}
              </Link>
            </div>
          ))}
        </div>

        <div className="flex gap-6 justify-center flex-wrap border-t border-neutral-200 pt-6 mb-8">
          {trustItems.map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-[12px] text-neutral-400">
              <i className={`${item.icon} text-[#4A5FA8] text-sm`} aria-hidden="true" />
              {item.text}
            </div>
          ))}
        </div>

        <p className="text-[13px] font-medium text-neutral-800 text-center mb-4">
          Yang sering ditanyakan sebelum beli
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-neutral-50 rounded-xl p-4">
              <p className="text-[12px] font-medium text-neutral-800 mb-1.5 flex items-start gap-1.5">
                <i className="ti ti-help-circle text-[#4A5FA8] text-[13px] shrink-0 mt-0.5" aria-hidden="true" />
                {faq.q}
              </p>
              <p className="text-[11px] text-neutral-500 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
