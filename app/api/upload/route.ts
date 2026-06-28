import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { InvitationData } from '@/types/invitation'

const GALLERY_LIMIT: Record<string, number | null> = {
  trial: 2, basic: 10, pro: 30, studio: null,
}
const LOVESTORY_LIMIT: Record<string, number | null> = {
  trial: 0, basic: 0, pro: 10, studio: 20,
}

const schema = z.object({
  orderId: z.string().uuid(),
  type: z.enum(['cover', 'gallery', 'lovestory', 'qris']),
})

function sign(params: Record<string, string | number>): string {
  const str = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  return createHash('sha1').update(str + process.env.CLOUDINARY_API_SECRET!).digest('hex')
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })

  const { orderId, type } = parsed.data

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: { invitation: { select: { content: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

  const content = (order.invitation?.content ?? {}) as unknown as InvitationData
  const pkg = order.package

  // Validasi limit per tipe
  if (type === 'gallery') {
    const limit = GALLERY_LIMIT[pkg]
    if (limit !== null && (content.gallery?.length ?? 0) >= limit) {
      return NextResponse.json({ error: `Batas galeri paket ${pkg}: ${limit} foto` }, { status: 403 })
    }
  }
  if (type === 'lovestory') {
    const limit = LOVESTORY_LIMIT[pkg]
    if (!limit) return NextResponse.json({ error: 'Fitur love story tidak tersedia di paket ini' }, { status: 403 })
    if ((content.love_story?.length ?? 0) >= limit) {
      return NextResponse.json({ error: `Batas love story paket ${pkg}: ${limit} foto` }, { status: 403 })
    }
  }
  if (type === 'qris' && pkg === 'trial') {
    return NextResponse.json({ error: 'QRIS tidak tersedia di paket trial' }, { status: 403 })
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = `undangan/orders/${orderId}`

  // publicId deterministik untuk cover & qris, acak untuk gallery & lovestory
  const publicId =
    type === 'cover' ? `${folder}/cover`
    : type === 'qris' ? `${folder}/qris`
    : type === 'gallery' ? `${folder}/gallery/${timestamp}`
    : `${folder}/lovestory/${timestamp}`

  const signature = sign({ folder, public_id: publicId, timestamp })

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    publicId,
    folder,
  })
}
