import type { Metadata } from 'next'
import './globals.css'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'
import Providers from './Providers'

const APP_URL = 'https://invizoku.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    template: '%s | Invizoku',
    default: 'Invizoku — Undangan Digital Tanpa Ribet',
  },
  description:
    'Buat undangan digital pernikahan, ulang tahun, dan aqiqah. Checkout otomatis, self-edit mandiri, atau terima beres dibantu admin.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: APP_URL,
    siteName: 'Invizoku',
    images: [
      {
        url: '/og?title=Undangan+Digital+Tanpa+Ribet',
        width: 1200,
        height: 630,
        alt: 'Invizoku — Undangan Digital Tanpa Ribet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og?title=Undangan+Digital+Tanpa+Ribet'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
