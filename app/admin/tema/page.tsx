import { prisma } from '@/lib/prisma'
import TemaTable from './TemaTable'

export default async function AdminTemaPage() {
  const themes = await prisma.theme.findMany({
    orderBy: { created_at: 'desc' },
    include: { _count: { select: { orders: true } } },
  })

  const serialized = themes.map((t) => ({
    id: t.id,
    name: t.name,
    component_key: t.component_key,
    event_categories: t.event_categories,
    style_tag: t.style_tag,
    is_active: t.is_active,
    orderCount: t._count.orders,
    created_at: t.created_at.toISOString(),
  }))

  return (
    <div>
      <h1 className="text-[20px] font-semibold text-neutral-800 mb-6">Tema</h1>
      <TemaTable themes={serialized} />
    </div>
  )
}
