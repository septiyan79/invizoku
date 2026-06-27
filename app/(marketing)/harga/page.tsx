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
      <div className="max-w-6xl mx-auto px-8 pt-12 pb-4">
        <h1 className="text-[28px] font-medium text-neutral-900 tracking-tight mb-2">
          Paket & harga
        </h1>
        <p className="text-[14px] text-neutral-500">
          Bayar sekali, bukan langganan. Pilih paket yang sesuai kebutuhanmu.
        </p>
      </div>
      <Pricing />
      <Footer />
    </div>
  )
}
