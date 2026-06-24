import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      if (pathname.startsWith('/admin')) {
        if (!isLoggedIn) return false
        return auth?.user?.role === 'admin'
      }

      if (
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profil') ||
        pathname.startsWith('/checkout')
      ) {
        return isLoggedIn
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: string }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as 'user' | 'admin'
      return session
    },
  },
  providers: [],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
}
