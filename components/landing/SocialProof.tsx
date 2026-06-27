const stats = [
  {
    icon: 'ti ti-template',
    value: '50+',
    label: 'Tema tersedia — dari elegan klasik hingga anime eksklusif',
    gold: false,
  },
  {
    icon: 'ti ti-calendar-event',
    value: '7',
    label: 'Kategori acara — wedding, aqiqah, ulang tahun, dan lainnya',
    gold: false,
  },
  {
    icon: 'ti ti-bolt',
    value: '< 5 mnt',
    label: 'Rata-rata waktu dari bayar sampai undangan siap sebar',
    gold: true,
  },
  {
    icon: 'ti ti-clock',
    value: '3×24 jam',
    label: 'Garansi waktu pengerjaan untuk layanan terima beres',
    gold: true,
  },
]

const whys = [
  {
    icon: 'ti ti-shopping-cart',
    title: 'Checkout otomatis, tanpa nunggu konfirmasi',
    desc: 'Kebanyakan platform undangan masih minta chat WA admin dulu. Di Invizoku, bayar langsung aktif — tidak ada antrian, tidak ada drama.',
    gold: false,
  },
  {
    icon: 'ti ti-tools',
    title: 'Edit sendiri atau serahkan ke admin — pilihan ada di kamu',
    desc: 'Tidak semua orang mau repot edit-edit. Paket Pro dan Studio hadir untuk yang mau langsung terima jadi, dengan jaminan SLA yang jelas.',
    gold: true,
  },
  {
    icon: 'ti ti-brand-whatsapp',
    title: 'Notifikasi WA, bukan email yang sering tidak terbaca',
    desc: 'Semua notifikasi penting — dari konfirmasi bayar hingga RSVP tamu — masuk langsung ke WhatsApp kamu.',
    gold: false,
  },
]

const localTags = [
  { icon: 'ti ti-building-bank', text: 'Transfer bank & VA lokal' },
  { icon: 'ti ti-qrcode', text: 'QRIS & e-wallet' },
  { icon: 'ti ti-brand-whatsapp', text: 'Notifikasi via WA' },
  { icon: 'ti ti-currency-dollar', text: 'Harga dalam Rupiah', gold: true },
  { icon: 'ti ti-moon', text: 'Kategori acara lokal', gold: true },
  { icon: 'ti ti-headset', text: 'Support bahasa Indonesia' },
]

export default function SocialProof() {
  return (
    <section className="px-4 md:px-8 py-12 md:py-20 bg-white border-t border-neutral-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-widest uppercase text-[#C9A55A] bg-[#FDF4E8] border border-[#E8C98A] px-3 py-1 rounded-full mb-4">
            <i className="ti ti-shield-check text-sm" aria-hidden="true" />
            Kenapa Invizoku
          </div>
          <h2 className="text-[28px] font-medium text-neutral-900 tracking-tight mb-2">
            Dibangun khusus untuk kebutuhan Indonesia
          </h2>
          <p className="text-[14px] text-neutral-500 leading-relaxed max-w-md mx-auto">
            Bukan adaptasi produk luar. Dirancang dari nol untuk cara orang Indonesia merayakan
            momen.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-neutral-50 rounded-xl p-6 text-center">
              <i
                className={`${stat.icon} text-[24px] mb-3 block ${stat.gold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`}
                aria-hidden="true"
              />
              <p className="text-[28px] font-medium text-neutral-900 tracking-tight mb-1">
                {stat.value}
              </p>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
          {whys.map((why) => (
            <div
              key={why.title}
              className={`rounded-xl p-5 border ${
                why.gold ? 'border-[#E8C98A] bg-[#FDF4E8]' : 'border-neutral-200 bg-white'
              }`}
            >
              <i
                className={`${why.icon} text-xl mb-3 block ${why.gold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`}
                aria-hidden="true"
              />
              <p className="text-[13px] font-medium text-neutral-800 mb-2 leading-snug">
                {why.title}
              </p>
              <p className="text-[12px] text-neutral-500 leading-relaxed">{why.desc}</p>
            </div>
          ))}
        </div>

        <div className="border border-neutral-200 rounded-xl p-8 text-center bg-white">
          <p className="text-[16px] font-medium text-neutral-800 mb-2">
            Dibuat di Indonesia, untuk Indonesia
          </p>
          <p className="text-[13px] text-neutral-500 leading-relaxed max-w-md mx-auto mb-5">
            Invizoku dibangun dengan memahami kebiasaan lokal — mulai dari metode pembayaran, cara
            berkomunikasi dengan tamu, hingga kategori acara yang relevan di sini.
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            {localTags.map((tag) => (
              <span
                key={tag.text}
                className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border ${
                  tag.gold
                    ? 'bg-[#FDF4E8] border-[#E8C98A] text-[#7A5A1A]'
                    : 'border-neutral-200 text-neutral-500'
                }`}
              >
                <i
                  className={`${tag.icon} text-[12px] ${tag.gold ? 'text-[#C9A55A]' : 'text-[#4A5FA8]'}`}
                  aria-hidden="true"
                />
                {tag.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
