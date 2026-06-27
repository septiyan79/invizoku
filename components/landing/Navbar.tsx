'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 bg-[#FDF8F2] flex items-center justify-between px-8 py-4 transition-all ${
        scrolled ? 'border-b border-neutral-200' : ''
      }`}
    >
      <Link href="/" className="text-[17px] font-medium text-neutral-900 tracking-tight">
        invi<span className="text-[#4A5FA8]">zo</span>ku
        <span className="text-[#C9A55A]">.</span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/katalog"
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Katalog tema
        </Link>
        <Link
          href="/harga"
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Harga
        </Link>
        <Link
          href="#cara-kerja"
          className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          Cara kerja
        </Link>
      </div>

      <div className="flex items-center gap-2">
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
    </nav>
  )
}
