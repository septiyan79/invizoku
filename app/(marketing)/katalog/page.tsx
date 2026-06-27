import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'
import { prisma } from '@/lib/prisma'
import KatalogGrid from './KatalogGrid'

export default async function KatalogPage() {
  const themes = await prisma.theme.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
      event_categories: true,
      style_tag: true,
      type: true,
      preview_url: true,
    },
    orderBy: { created_at: 'asc' },
  })

  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <Navbar />
      <KatalogGrid themes={themes} />
      <Footer />
    </div>
  )
}
