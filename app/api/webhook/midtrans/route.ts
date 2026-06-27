import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhookSignature } from '@/lib/midtrans'
import { getExpiresAt, type PaidPackage } from '@/lib/packages'
import { getDefaultContent } from '@/lib/defaultContent'

export async function POST(req: Request) {
  const body = await req.json()

  // ── Verifikasi signature (WAJIB — jangan skip) ───────────────────────────
  const isValid = verifyWebhookSignature(
    body.order_id,
    body.status_code,
    body.gross_amount,
    body.signature_key
  )
  if (!isValid) {
    return new Response('Forbidden', { status: 403 })
  }

  const { transaction_status, order_id, custom_field1: paymentType } = body

  // Hanya proses transaksi yang berhasil
  if (transaction_status !== 'settlement' && transaction_status !== 'capture') {
    return NextResponse.json({ ok: true })
  }

  if (paymentType === 'new_order') {
    const order = await prisma.order.findUnique({
      where: { id: order_id },
      include: { theme: true },
    })
    if (!order || order.status !== 'pending') {
      return NextResponse.json({ ok: true })
    }

    const defaultContent = getDefaultContent(
      order.theme.component_key,
      order.theme.event_categories
    )
    const expiresAt = getExpiresAt(order.package as PaidPackage)

    await prisma.order.update({
      where: { id: order_id },
      data: {
        status: 'active',
        payment_id: body.transaction_id,
        expires_at: expiresAt,
        invitation: {
          create: { content: defaultContent as object },
        },
      },
    })

    await sendWaNotification(
      order.user_id,
      `✅ Pembayaran berhasil! Undangan ${order.theme.name} kamu sudah aktif. Yuk mulai isi data di invizoku.com/dashboard`
    )
  }

  if (paymentType === 'renewal') {
    const order = await prisma.order.findUnique({ where: { id: order_id } })
    if (!order) return NextResponse.json({ ok: true })

    const base = order.expires_at ?? new Date()
    const newExpiry = getExpiresAt(order.package as PaidPackage, base)

    await prisma.order.update({
      where: { id: order_id },
      data: {
        status: 'active',
        payment_id: body.transaction_id,
        expires_at: newExpiry,
      },
    })

    await sendWaNotification(
      order.user_id,
      `✅ Perpanjangan berhasil! Masa aktif undangan diperpanjang hingga ${newExpiry.toLocaleDateString('id-ID')}.`
    )
  }

  if (paymentType === 'upgrade') {
    const order = await prisma.order.findUnique({ where: { id: order_id } })
    if (!order) return NextResponse.json({ ok: true })

    const newPackage = body.custom_field2 as PaidPackage
    const newExpiry = getExpiresAt(newPackage)

    await prisma.order.update({
      where: { id: order_id },
      data: {
        package: newPackage,
        upgraded_from: order.package as PaidPackage,
        upgraded_at: new Date(),
        expires_at: newExpiry,
        payment_id: body.transaction_id,
      },
    })

    await sendWaNotification(
      order.user_id,
      `✅ Upgrade ke paket ${newPackage} berhasil! Fitur baru sudah aktif di undangan kamu.`
    )
  }

  return NextResponse.json({ ok: true })
}

// Kirim WA via Fonnte — skip jika FONNTE_API_KEY belum diisi
async function sendWaNotification(userId: string, message: string) {
  if (!process.env.FONNTE_API_KEY) return
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone_wa: true },
    })
    if (!user?.phone_wa) return

    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        Authorization: process.env.FONNTE_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target: user.phone_wa, message }),
    })
  } catch {
    // Notif gagal tidak boleh block proses utama
  }
}
