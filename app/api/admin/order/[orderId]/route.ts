import { NextResponse } from 'next/server'
import { AssistStatus } from '@prisma/client'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { sendWhatsApp } from '@/lib/fonnte'

const VALID_TRANSITIONS: Record<string, string[]> = {
  waiting_admin: ['in_progress'],
  in_progress: ['waiting_review'],
  waiting_review: ['in_progress', 'done'],
}

const WA_MESSAGES: Partial<Record<string, (name: string) => string>> = {
  waiting_review: (name) =>
    `Halo ${name} 👋\n\nAdmin sudah selesai mengerjakan undanganmu di Invizoku.\n\nSilakan cek hasilnya dan berikan ACC atau permintaan revisi di dashboard:\nhttps://invizoku.com/dashboard`,
  in_progress: (name) =>
    `Halo ${name} 👋\n\nAdmin mulai mengerjakan undanganmu sekarang. Estimasi selesai dalam 3×24 jam ya 🙏`,
}

export async function PATCH(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { orderId } = await params
  const { assist_status } = await req.json() as { assist_status: string }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: { select: { name: true, phone_wa: true } } },
  })
  if (!order) return NextResponse.json({ error: 'Order tidak ditemukan' }, { status: 404 })

  const allowed = VALID_TRANSITIONS[order.assist_status] ?? []
  if (!allowed.includes(assist_status)) {
    return NextResponse.json({ error: `Transisi ${order.assist_status} → ${assist_status} tidak valid` }, { status: 400 })
  }

  const isRevision = assist_status === 'in_progress' && order.assist_status === 'waiting_review'
  const maxRevision = order.package === 'studio' ? 3 : 1

  if (isRevision && order.revision_count >= maxRevision) {
    return NextResponse.json({ error: 'Jatah revisi habis' }, { status: 400 })
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      assist_status: assist_status as AssistStatus,
      ...(isRevision ? { revision_count: { increment: 1 } } : {}),
    },
  })

  const msgFn = WA_MESSAGES[assist_status]
  if (msgFn && order.user.phone_wa) {
    await sendWhatsApp(order.user.phone_wa, msgFn(order.user.name ?? 'Kak'))
  }

  return NextResponse.json({ ok: true })
}
