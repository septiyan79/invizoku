import type { Metadata } from 'next'
import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import ThemeShowcase from '@/components/landing/ThemeShowcase'
import Pricing from '@/components/landing/Pricing'
import SocialProof from '@/components/landing/SocialProof'
import CtaFinal from '@/components/landing/CtaFinal'
import Footer from '@/components/landing/Footer'

export const metadata: Metadata = {
  title: 'Invizoku — Undangan Digital untuk Momen Istimewamu',
  description:
    'Buat undangan digital pernikahan, ulang tahun, aqiqah, dan lebih banyak lagi. 50+ tema pilihan, checkout otomatis, langsung aktif.',
  openGraph: {
    title: 'Invizoku — Undangan Digital untuk Momen Istimewamu',
    description:
      '50+ tema undangan digital. Bayar sekali, langsung aktif. Edit sendiri atau serahkan ke admin.',
    url: 'https://invizoku.com',
    siteName: 'Invizoku',
    locale: 'id_ID',
    type: 'website',
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <Navbar />
      <Hero />
      <HowItWorks />
      <ThemeShowcase />
      <Pricing />
      <SocialProof />
      <CtaFinal />
      <Footer />
    </div>
  )
}
