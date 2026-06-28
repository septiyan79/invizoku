import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import ProfileForm from './ProfileForm'

export default async function ProfilPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/profil')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone_wa: true },
  })

  if (!user) redirect('/login')

  return <ProfileForm name={user.name} email={user.email} phoneWa={user.phone_wa} />
}
