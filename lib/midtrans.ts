import crypto from 'crypto'

const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true'
const SNAP_BASE = IS_PRODUCTION
  ? 'https://app.midtrans.com'
  : 'https://app.sandbox.midtrans.com'

export const SNAP_JS_URL = IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/snap.js'
  : 'https://app.sandbox.midtrans.com/snap/snap.js'

export async function createSnapToken(params: {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  itemName: string
  paymentType: 'new_order' | 'renewal' | 'upgrade'
}): Promise<{ token: string; redirect_url: string }> {
  const auth = Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')

  const res = await fetch(`${SNAP_BASE}/snap/v1/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.amount,
      },
      customer_details: {
        first_name: params.customerName,
        email: params.customerEmail,
      },
      item_details: [
        {
          id: params.paymentType,
          name: params.itemName,
          price: params.amount,
          quantity: 1,
        },
      ],
      custom_field1: params.paymentType,
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      (err as { error_messages?: string[] }).error_messages?.[0] ?? 'Midtrans error'
    )
  }

  return res.json()
}

export function verifyWebhookSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signature: string
): boolean {
  const hash = crypto
    .createHash('sha512')
    .update(orderId + statusCode + grossAmount + process.env.MIDTRANS_SERVER_KEY)
    .digest('hex')
  return hash === signature
}
