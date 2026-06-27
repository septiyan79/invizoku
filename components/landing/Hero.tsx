import Link from 'next/link'

const featureCards = [
  {
    icon: 'ti ti-edit',
    title: 'Self-edit',
    desc: 'Isi form, upload foto, langsung preview real-time',
    gold: false,
    span: false,
  },
  {
    icon: 'ti ti-tools',
    title: 'Terima beres',
    desc: 'Admin kerjakan dalam 3×24 jam',
    badge: 'Pro & Studio',
    gold: true,
    span: false,
  },
  {
    icon: 'ti ti-users',
    title: 'Kelola tamu',
    desc: 'RSVP tracking & link personal per tamu',
    gold: false,
    span: false,
  },
  {
    icon: 'ti ti-template',
    title: '50+ tema',
    desc: 'Wedding, anime, birthday, aqiqah & lainnya',
    gold: false,
    span: false,
  },
  {
    icon: 'ti ti-shopping-cart',
    title: 'Checkout otomatis',
    desc: 'Bayar via VA, QRIS, atau e-wallet — undangan langsung aktif tanpa menunggu konfirmasi manual',
    badge: 'Pertama di Indonesia',
    gold: false,
    span: true,
  },
]

const checklist = [
  'Checkout otomatis — bayar, langsung aktif',
  'Edit sendiri atau serahkan ke admin kami',
  '50+ tema: elegan, minimalis, hingga anime',
  'RSVP & buku tamu digital otomatis',
]

const avatars = [
  { initials: 'AR', bg: '#4A5FA8' },
  { initials: 'BS', bg: '#C9A55A' },
  { initials: 'CW', bg: '#8B9ED4' },
  { initials: 'DM', bg: '#2D4080' },
]

export default function Hero() {
  return (
    <section className="px-4 md:px-8 pt-10 md:pt-14 pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-9 items-start max-w-6xl mx-auto">
        {/* Kiri */}
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#C9A55A] bg-[#FDF4E8] border border-[#E8C98A] px-3 py-1 rounded-full mb-4">
            <i className="ti ti-heart text-sm" aria-hidden="true" />
            Undangan digital Indonesia
          </div>

          <h1 className="text-[30px] font-medium leading-tight text-neutral-900 tracking-tight mb-3">
            Undangan digital <span className="text-[#4A5FA8]">tanpa ribet</span>,{' '}
            berkesan <span className="text-[#C9A55A]">selamanya</span>
          </h1>

          <p className="text-[13px] text-neutral-500 leading-relaxed mb-5">
            Platform undangan digital dengan checkout otomatis, editor mandiri, dan layanan terima
            beres — semua dalam satu tempat untuk hari istimewamu.
          </p>

          <div className="flex gap-2 mb-5">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#4A5FA8] hover:bg-[#2D4080] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <i className="ti ti-sparkles" aria-hidden="true" />
              Coba gratis
            </Link>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 bg-[#E8C98A] hover:bg-[#C9A55A] text-[#7A5A1A] text-[13px] font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              <i className="ti ti-eye" aria-hidden="true" />
              Lihat demo
            </Link>
          </div>

          <ul className="flex flex-col gap-2">
            {checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[12px] text-neutral-500">
                <i className="ti ti-check text-[#4A5FA8] text-sm shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Kanan — grid card */}
        <div className="grid grid-cols-2 gap-2">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl p-4 border transition-colors ${
                card.span ? 'col-span-2' : ''
              } ${
                card.gold
                  ? 'border-[#E8C98A] bg-[#FDF4E8]'
                  : 'border-neutral-200 bg-white hover:border-[#8B9ED4]'
              }`}
            >
              <i
                className={`${card.icon} text-xl mb-2 block ${
                  card.gold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'
                }`}
                aria-hidden="true"
              />
              <p className="text-[12px] font-medium text-neutral-800 mb-1">{card.title}</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{card.desc}</p>
              {card.badge && (
                <span
                  className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 ${
                    card.gold
                      ? 'bg-[#FDF4E8] text-[#7A5A1A] border border-[#E8C98A]'
                      : 'bg-[#EEF0F9] text-[#2D4080]'
                  }`}
                >
                  {card.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto mt-10 border-t border-neutral-200 pt-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex">
            {avatars.map((av, i) => (
              <div
                key={av.initials}
                className="w-6 h-6 rounded-full border-2 border-[#FDF8F2] flex items-center justify-center text-[9px] font-medium text-white"
                style={{ background: av.bg, marginLeft: i === 0 ? 0 : -6 }}
              >
                {av.initials}
              </div>
            ))}
          </div>
          <span className="text-[11px] text-neutral-400">
            Dipercaya 10.000+ pasangan di Indonesia
          </span>
        </div>
        <div className="flex items-center gap-1 text-[12px] text-neutral-500">
          <i className="ti ti-star-filled text-[#C9A55A] text-sm" aria-hidden="true" />
          <strong className="text-neutral-800">4.9</strong>
          &nbsp;/ 5 dari 2.300+ ulasan
        </div>
      </div>
    </section>
  )
}
