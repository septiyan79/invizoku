import type { Metadata } from 'next'
import Navbar from '@/components/landing/Navbar'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Harga & Paket',
  description:
    'Paket undangan digital mulai dari gratis. Basic Rp 79rb, Pro Rp 149rb, Studio Rp 199rb. Bayar sekali, aktif langsung.',
  openGraph: {
    title: 'Harga & Paket Undangan Digital — Invizoku',
    description: 'Trial gratis, Basic Rp 79rb, Pro Rp 149rb, Studio Rp 199rb. Bayar sekali, langsung aktif.',
    images: [{ url: '/og?title=Harga+%26+Paket&sub=Trial+Gratis+%7C+Basic+%7C+Pro+%7C+Studio', width: 1200, height: 630 }],
  },
}

export default function HargaPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <Navbar />
      <Pricing />
      <Footer />
    </div>
  )
}
