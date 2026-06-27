import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { PACKAGES, getExpiresAt, type PaidPackage } from '@/lib/packages'
import { createSnapToken } from '@/lib/midtrans'
import { getDefaultContent } from '@/lib/defaultContent'

const slugRegex = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/

const checkoutSchema = z.object({
  themeId: z.string().uuid(),
  package: z.enum(['trial', 'basic', 'pro', 'studio']),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(50, 'Slug maksimal 50 karakter')
    .regex(slugRegex, 'Slug hanya boleh huruf kecil, angka, dan tanda hubung'),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = checkoutSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { themeId, package: pkg, slug } = parsed.data
  const userId = session.user.id

  // Cek slug unik
  const existingSlug = await prisma.order.findUnique({ where: { slug } })
  if (existingSlug) {
    return NextResponse.json({ error: 'URL undangan sudah dipakai, coba yang lain.' }, { status: 409 })
  }

  // Cek tema ada dan aktif
  const theme = await prisma.theme.findFirst({
    where: { id: themeId, is_active: true },
  })
  if (!theme) {
    return NextResponse.json({ error: 'Tema tidak ditemukan.' }, { status: 404 })
  }

  // ── TRIAL ──────────────────────────────────────────────────────────────────
  if (pkg === 'trial') {
    const hasPaid = await prisma.order.findFirst({
      where: {
        user_id: userId,
        package: { in: ['basic', 'pro', 'studio'] },
        status: { in: ['active', 'expired'] },
      },
    })
    if (hasPaid) {
      return NextResponse.json(
        { error: 'Paket uji coba hanya bisa digunakan sekali.' },
        { status: 403 }
      )
    }

    const defaultContent = getDefaultContent(theme.component_key, theme.event_categories)

    const order = await prisma.order.create({
      data: {
        user_id: userId,
        theme_id: themeId,
        package: 'trial',
        status: 'active',
        slug,
        expires_at: null,
        invitation: {
          create: { content: defaultContent as object },
        },
      },
    })

    return NextResponse.json({ orderId: order.id, type: 'trial' }, { status: 201 })
  }

  // ── PAID ───────────────────────────────────────────────────────────────────
  const pkgConfig = PACKAGES[pkg as PaidPackage]
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  })
  if (!user) return NextResponse.json({ error: 'User tidak ditemukan.' }, { status: 404 })

  const order = await prisma.order.create({
    data: {
      user_id: userId,
      theme_id: themeId,
      package: pkg,
      status: 'pending',
      slug,
    },
  })

  // Gunakan order.id sebagai Midtrans order_id
  const snap = await createSnapToken({
    orderId: order.id,
    amount: pkgConfig.price,
    customerName: user.name,
    customerEmail: user.email,
    itemName: `Invizoku ${pkgConfig.name} — ${theme.name}`,
    paymentType: 'new_order',
  })

  return NextResponse.json(
    {
      orderId: order.id,
      snapToken: snap.token,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
      type: 'paid',
    },
    { status: 201 }
  )
}
