'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '/katalog', label: 'Katalog tema' },
  { href: '/harga', label: 'Harga' },
  { href: '#cara-kerja', label: 'Cara kerja' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-[#FDF8F2] flex items-center justify-between px-6 md:px-8 py-4 transition-all ${
          scrolled || menuOpen ? 'border-b border-neutral-200' : ''
        }`}
      >
        <Link href="/" className="text-[17px] font-medium text-neutral-900 tracking-tight">
          invi<span className="text-[#4A5FA8]">zo</span>ku
          <span className="text-[#C9A55A]">.</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded-lg bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors font-medium"
          >
            Coba gratis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        >
          <span
            className={`block w-5 h-0.5 bg-neutral-600 transition-all duration-200 ${
              menuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-neutral-600 transition-all duration-200 ${
              menuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-neutral-600 transition-all duration-200 ${
              menuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden sticky top-14.25 z-40 bg-[#FDF8F2] border-b border-neutral-200 px-6 pb-5">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-neutral-600 hover:text-neutral-900 py-2.5 border-b border-neutral-100 last:border-0 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-center py-2.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-center py-2.5 rounded-lg bg-[#4A5FA8] text-white hover:bg-[#2D4080] transition-colors font-medium"
            >
              Coba gratis
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
