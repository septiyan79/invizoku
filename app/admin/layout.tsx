import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import AdminShell from './AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')
  if (session.user.role !== 'admin') redirect('/dashboard')

  return <AdminShell>{children}</AdminShell>
}
