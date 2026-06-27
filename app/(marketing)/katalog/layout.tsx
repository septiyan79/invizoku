import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Katalog Tema Undangan',
  description:
    '50+ tema undangan digital untuk pernikahan, ulang tahun, aqiqah, dan lainnya. Filter berdasarkan kategori acara dan gaya.',
  openGraph: {
    title: 'Katalog Tema Undangan — Invizoku',
    description: '50+ tema untuk berbagai acara. Pernikahan, ulang tahun, aqiqah, wisuda, dan lainnya.',
    images: [{ url: '/og?title=Katalog+Tema+Undangan&sub=50%2B+tema+untuk+semua+acara', width: 1200, height: 630 }],
  },
}

export default function KatalogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
