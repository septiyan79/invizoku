import type { Metadata } from 'next'
import './globals.css'
import '@tabler/icons-webfont/dist/tabler-icons.min.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Invizoku',
    default: 'Invizoku — Undangan Digital Tanpa Ribet',
  },
  description:
    'Buat undangan digital pernikahan, ulang tahun, dan aqiqah. Checkout otomatis, self-edit mandiri, atau terima beres dibantu admin.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
