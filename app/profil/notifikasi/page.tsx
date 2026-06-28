import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import NotifForm from './NotifForm'

export default async function NotifikasiPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/profil/notifikasi')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { notif_rsvp: true, notif_ucapan: true },
  })

  if (!user) redirect('/login')

  return <NotifForm notifRsvp={user.notif_rsvp} notifUcapan={user.notif_ucapan} />
}
