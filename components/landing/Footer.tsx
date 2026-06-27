import Link from 'next/link'

const footerLinks = {
  Produk: [
    { label: 'Katalog tema', href: '/katalog' },
    { label: 'Paket & harga', href: '/harga' },
    { label: 'Cara kerja', href: '#cara-kerja' },
    { label: 'Coba gratis', href: '/register' },
  ],
  Tema: [
    { label: 'Wedding', href: '/katalog?acara=wedding' },
    { label: 'Ulang tahun', href: '/katalog?acara=birthday' },
    { label: 'Aqiqah & khitan', href: '/katalog?acara=aqiqah' },
    { label: 'Anime & eksklusif', href: '/katalog?gaya=anime-kartun' },
    { label: 'Semua kategori', href: '/katalog' },
  ],
  Bantuan: [
    { label: 'Cara pesan', href: '/bantuan/cara-pesan' },
    { label: 'FAQ', href: '/bantuan/faq' },
    { label: 'Hubungi kami', href: '/kontak' },
  ],
}

const socials = [
  { icon: 'ti ti-brand-instagram', href: 'https://instagram.com/invizoku', label: 'Instagram Invizoku' },
  { icon: 'ti ti-brand-tiktok', href: 'https://tiktok.com/@invizoku', label: 'TikTok Invizoku' },
  { icon: 'ti ti-brand-whatsapp', href: 'https://wa.me/628xxxxxxxxxx', label: 'WhatsApp Invizoku' },
]

export default function Footer() {
  return (
    <footer className="px-8 pt-12 pb-8 border-t border-neutral-200 bg-[#FDF8F2]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-8 mb-10">
          <div>
            <Link
              href="/"
              className="text-[18px] font-medium text-neutral-900 tracking-tight block mb-3"
            >
              invi<span className="text-[#4A5FA8]">zo</span>ku
              <span className="text-[#C9A55A]">.</span>
            </Link>
            <p className="text-[12px] text-neutral-500 leading-relaxed mb-4 max-w-[200px]">
              Platform undangan digital Indonesia — dari elegan klasik hingga anime eksklusif,
              semua ada di sini.
            </p>
            <div className="flex gap-2 mb-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                >
                  <i className={`${s.icon} text-sm`} aria-hidden="true" />
                </a>
              ))}
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-[#FDF4E8] border border-[#E8C98A] text-[#7A5A1A]">
              <i className="ti ti-map-pin text-[11px]" aria-hidden="true" />
              Dibuat di Indonesia
            </span>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 mb-4">
                {title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-neutral-500 hover:text-[#4A5FA8] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-200 pt-6 flex items-center justify-between flex-wrap gap-3">
          <p className="text-[12px] text-neutral-400">
            © {new Date().getFullYear()} Invizoku. Dibuat dengan{' '}
            <span className="text-[#C9A55A]">♥</span> di Indonesia.
          </p>
          <div className="flex gap-5">
            {['Syarat & ketentuan', 'Kebijakan privasi', 'Kebijakan refund'].map((label) => (
              <Link
                key={label}
                href={`/${label.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
