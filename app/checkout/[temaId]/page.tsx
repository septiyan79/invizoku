import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import CheckoutForm from './CheckoutForm'

interface PageProps {
  params: Promise<{ temaId: string }>
}

export default async function CheckoutPage({ params }: PageProps) {
  const { temaId } = await params
  const session = await auth()

  const theme = await prisma.theme.findFirst({
    where: { id: temaId, is_active: true },
  })
  if (!theme) notFound()

  let isTrialEligible = false
  if (session?.user?.id) {
    const hasPaid = await prisma.order.findFirst({
      where: {
        user_id: session.user.id,
        package: { in: ['basic', 'pro', 'studio'] },
        status: { in: ['active', 'expired'] },
      },
    })
    isTrialEligible = !hasPaid
  }

  return (
    <div className="min-h-screen bg-[#FDF8F2]">
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 px-4 h-14 flex items-center justify-between">
        <a
          href="/katalog"
          className="flex items-center gap-1.5 text-[13px] text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <i className="ti ti-arrow-left text-[14px]" aria-hidden="true" />
          Katalog tema
        </a>
        <span className="text-[14px] font-medium text-neutral-800">
          inviz<span className="text-[#4A5FA8]">oku</span>
          <span className="text-[#C9A55A]">.</span>
        </span>
      </header>

      <div className="max-w-xl mx-auto px-4 py-10">
        {/* Tema dipilih */}
        <div className="flex items-center gap-3 mb-8 p-4 bg-white rounded-xl border border-neutral-100">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#EEF0F9] shrink-0">
            <i className="ti ti-template text-[20px] text-[#4A5FA8]" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-neutral-800">{theme.name}</p>
            <p className="text-[12px] text-neutral-400 mt-0.5">
              {theme.event_categories.join(', ')} · {theme.style_tag}
            </p>
          </div>
        </div>

        <CheckoutForm
          themeId={theme.id}
          themeName={theme.name}
          isTrialEligible={isTrialEligible}
        />
      </div>
    </div>
  )
}
