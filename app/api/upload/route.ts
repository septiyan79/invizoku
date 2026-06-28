import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import type { InvitationData } from '@/types/invitation'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const GALLERY_LIMIT: Record<string, number | null> = {
  trial: 2, basic: 10, pro: 30, studio: null,
}
const LOVESTORY_LIMIT: Record<string, number | null> = {
  trial: 0, basic: 0, pro: 10, studio: 20,
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const orderId = formData.get('orderId') as string | null
  const type = formData.get('type') as string | null

  if (!file || !orderId || !type) {
    return NextResponse.json({ error: 'Parameter tidak lengkap' }, { status: 400 })
  }
  if (!['cover', 'gallery', 'lovestory', 'qris'].includes(type)) {
    return NextResponse.json({ error: 'Tipe upload tidak valid' }, { status: 400 })
  }
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Ukuran file maksimal 5MB' }, { status: 400 })
  }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return NextResponse.json({ error: 'Format hanya JPG, PNG, atau WEBP' }, { status: 400 })
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, user_id: session.user.id, status: 'active' },
    include: { invitation: { select: { content: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

  const content = (order.invitation?.content ?? {}) as unknown as InvitationData
  const pkg = order.package

  if (type === 'gallery') {
    const limit = GALLERY_LIMIT[pkg]
    if (limit !== null && (content.gallery?.length ?? 0) >= limit) {
      return NextResponse.json({ error: `Batas galeri paket ${pkg}: ${limit} foto` }, { status: 403 })
    }
  }
  if (type === 'lovestory') {
    const limit = LOVESTORY_LIMIT[pkg]
    if (!limit) return NextResponse.json({ error: 'Love story tidak tersedia di paket ini' }, { status: 403 })
    if ((content.love_story?.length ?? 0) >= limit) {
      return NextResponse.json({ error: `Batas love story paket ${pkg}: ${limit} foto` }, { status: 403 })
    }
  }
  if (type === 'qris' && pkg === 'trial') {
    return NextResponse.json({ error: 'QRIS tidak tersedia di paket trial' }, { status: 403 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`

  const folder = `undangan/orders/${orderId}`
  const publicId =
    type === 'cover' ? `${folder}/cover`
    : type === 'qris' ? `${folder}/qris`
    : type === 'gallery' ? `${folder}/gallery_${Date.now()}`
    : `${folder}/lovestory_${Date.now()}`

  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: publicId,
      overwrite: true,
    })

    const url = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/')
    return NextResponse.json({ url })
  } catch (err) {
    const message = (err as Record<string, unknown>)?.message as string ?? 'Upload gagal'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
