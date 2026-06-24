import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            password: true,
            email_verified: true,
          },
        })

        if (!user || !user.email_verified) return null

        const ok = await bcrypt.compare(parsed.data.password, user.password)
        if (!ok) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
})
