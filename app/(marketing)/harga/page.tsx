import type { Metadata } from 'next'
import Navbar from '@/components/landing/Navbar'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Harga & Paket',
  description:
    'Paket undangan digital mulai dari gratis. Basic Rp 79rb, Pro Rp 149rb, Studio Rp 199rb. Bayar sekali, aktif langsung.',
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
