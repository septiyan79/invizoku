import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { sendWhatsApp } from '@/lib/fonnte'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(req: Request) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const results = { expired: 0, notifH14: 0, notifH1: 0, cleaned: 0 }

  // ── 1. Tandai order yang expired ────────────────────────────────────────────
  const newlyExpired = await prisma.order.findMany({
    where: { status: 'active', expires_at: { lte: now } },
    select: { id: true, slug: true },
  })

  if (newlyExpired.length > 0) {
    await prisma.order.updateMany({
      where: { id: { in: newlyExpired.map((o) => o.id) } },
      data: { status: 'expired' },
    })
    for (const order of newlyExpired) {
      revalidatePath(`/undangan/${order.slug}`)
    }
    results.expired = newlyExpired.length
  }

  // ── 2. Notifikasi H-14 ──────────────────────────────────────────────────────
  const in14 = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
  const in13 = new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000)

  const ordersH14 = await prisma.order.findMany({
    where: {
      status: 'active',
      expires_at: { gte: in13, lte: in14 },
    },
    include: { user: { select: { phone_wa: true, name: true } } },
  })

  for (const order of ordersH14) {
    if (!order.user.phone_wa) continue
    await sendWhatsApp(
      order.user.phone_wa,
      `Halo ${order.user.name ?? 'Kak'} 👋\n\nUndangan digitalmu di Invizoku akan berakhir dalam *14 hari* (${formatDate(order.expires_at!)}).\n\nSegera perpanjang agar undangan tetap bisa diakses tamu 🙏\nhttps://invizoku.com/dashboard`
    )
    results.notifH14++
  }

  // ── 3. Notifikasi H-1 ───────────────────────────────────────────────────────
  const in1 = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000)

  const ordersH1 = await prisma.order.findMany({
    where: {
      status: 'active',
      expires_at: { gte: now, lte: in1 },
    },
    include: { user: { select: { phone_wa: true, name: true } } },
  })

  for (const order of ordersH1) {
    if (!order.user.phone_wa) continue
    await sendWhatsApp(
      order.user.phone_wa,
      `Halo ${order.user.name ?? 'Kak'} ⚠️\n\nUndangan digitalmu di Invizoku akan berakhir *besok* (${formatDate(order.expires_at!)}).\n\nJangan sampai undangan tidak bisa diakses tamu. Perpanjang sekarang:\nhttps://invizoku.com/dashboard`
    )
    results.notifH1++
  }

  // ── 4. Cleanup Cloudinary — order expired > 30 hari ─────────────────────────
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const toClean = await prisma.order.findMany({
    where: {
      status: 'expired',
      expires_at: { lte: thirtyDaysAgo },
      slug: { not: { startsWith: 'deleted-' } },
    },
    select: { id: true },
  })

  for (const order of toClean) {
    try {
      const prefix = `undangan/orders/${order.id}/`
      await cloudinary.api.delete_resources_by_prefix(prefix)
      await cloudinary.api.delete_folder(prefix.slice(0, -1))
    } catch {
      // Folder mungkin sudah kosong atau tidak ada — lanjut saja
    }

    await prisma.order.update({
      where: { id: order.id },
      // Bebaskan slug agar bisa dipakai order lain
      data: { slug: `deleted-${order.id}` },
    })
    results.cleaned++
  }

  return NextResponse.json({ ok: true, ...results })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
