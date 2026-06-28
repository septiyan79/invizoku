import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone_wa: true,
      role: true,
      email_verified: true,
      created_at: true,
      _count: { select: { orders: true } },
    },
  })

  return (
    <div>
      <h1 className="text-[20px] font-semibold text-neutral-800 mb-6">
        User <span className="text-neutral-400 font-normal text-[16px]">({users.length})</span>
      </h1>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-[11px] text-neutral-400 uppercase tracking-wide">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Nomor WA</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Verified</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Bergabung</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                <td className="px-4 py-3 font-medium text-neutral-700">{user.name ?? '—'}</td>
                <td className="px-4 py-3 text-neutral-500">{user.email}</td>
                <td className="px-4 py-3 text-neutral-500">{user.phone_wa}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-50 text-purple-600'
                      : 'bg-neutral-100 text-neutral-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {user.email_verified
                    ? <i className="ti ti-circle-check text-green-500 text-[16px]" />
                    : <i className="ti ti-circle-x text-neutral-300 text-[16px]" />
                  }
                </td>
                <td className="px-4 py-3 text-neutral-500">{user._count.orders}</td>
                <td className="px-4 py-3 text-neutral-400 text-[12px]">
                  {user.created_at.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-[12px] px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-[#4A5FA8] hover:text-[#4A5FA8] transition-colors"
                  >
                    Detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
