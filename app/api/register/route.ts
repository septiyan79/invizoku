import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100).trim(),
  email: z.string().email('Email tidak valid'),
  phone_wa: z
    .string()
    .min(10, 'Nomor WA minimal 10 digit')
    .max(15)
    .regex(/^[0-9+]+$/, 'Nomor WA hanya boleh angka'),
  password: z.string().min(8, 'Password minimal 8 karakter').max(72),
})

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = registerSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    )
  }

  const { name, email, phone_wa, password } = parsed.data

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, phone_wa, password: hashed },
  })

  const token = await generateVerificationToken(user.id)
  await sendVerificationEmail(email, name, token)

  return NextResponse.json(
    { message: 'Registrasi berhasil. Cek email untuk verifikasi akun.' },
    { status: 201 }
  )
}
