import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: Promise<{ temaId: string }> }) {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { temaId } = await params
  const { is_active } = await req.json() as { is_active: boolean }

  const theme = await prisma.theme.update({
    where: { id: temaId },
    data: { is_active },
    select: { id: true, is_active: true },
  })

  return NextResponse.json(theme)
}
