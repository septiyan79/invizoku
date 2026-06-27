import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { getThemeLoader } from '@/components/themes'
import type { ThemeProps, InvitationData } from '@/types/invitation'

// ISR — revalidate setiap jam, atau on-demand via revalidatePath()
export const revalidate = 3600

// Mapping statis agar Next.js bisa bundle semua tema saat build
const themeComponents: Record<string, React.ComponentType<ThemeProps>> = {
  WeddingElegant: dynamic(() => import('@/components/themes/WeddingElegant'), {
    loading: () => <InvitationSkeleton />,
  }) as unknown as React.ComponentType<ThemeProps>,
}

function InvitationSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF8F2]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#C9A55A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[13px] text-neutral-400">Memuat undangan...</p>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const order = await prisma.order.findUnique({
    where: { slug },
    include: { theme: true },
  })
  if (!order || order.status !== 'active') {
    return { title: 'Undangan tidak ditemukan' }
  }
  return {
    title: `Undangan — ${order.theme.name}`,
    robots: { index: false, follow: false },
  }
}

export default async function UndanganPage({ params }: PageProps) {
  const { slug } = await params

  const order = await prisma.order.findUnique({
    where: { slug },
    include: {
      invitation: true,
      theme: true,
    },
  })

  if (!order || order.status !== 'active' || !order.invitation) {
    notFound()
  }

  const loader = getThemeLoader(order.theme.component_key)
  const ThemeComponent = themeComponents[order.theme.component_key]

  if (!loader || !ThemeComponent) {
    notFound()
  }

  const props: Omit<ThemeProps, 'guestName' | 'guestToken'> = {
    content: order.invitation.content as unknown as InvitationData,
    pkg: order.package as ThemeProps['pkg'],
    slug: order.slug,
    orderId: order.id,
  }

  return (
    <Suspense fallback={<InvitationSkeleton />}>
      <ThemeComponent {...props} />
    </Suspense>
  )
}
