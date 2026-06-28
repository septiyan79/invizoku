import type { Metadata } from 'next'
import { Suspense } from 'react'
import VerifyEmailContent from './VerifyEmailContent'

export const metadata: Metadata = { title: 'Verifikasi Email' }

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}
