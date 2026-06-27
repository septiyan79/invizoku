import { redirect } from 'next/navigation'
import PaymentClient from './PaymentClient'

interface PageProps {
  searchParams: Promise<{ token?: string; orderId?: string; clientKey?: string }>
}

export default async function PaymentPage({ searchParams }: PageProps) {
  const { token, orderId, clientKey } = await searchParams

  if (!token || !orderId) redirect('/katalog')

  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'

  return (
    <PaymentClient
      snapToken={token}
      orderId={orderId}
      clientKey={clientKey ?? process.env.MIDTRANS_CLIENT_KEY ?? ''}
      isProduction={isProduction}
    />
  )
}
