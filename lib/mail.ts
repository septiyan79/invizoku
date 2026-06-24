import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@invizoku.com'
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(email: string, name: string, token: string) {
  const link = `${appUrl}/verify-email?token=${encodeURIComponent(token)}`
  await resend.emails.send({
    from,
    to: email,
    subject: 'Verifikasi email Invizoku kamu',
    html: `<p>Hai ${name},</p><p>Klik link berikut untuk verifikasi email kamu:</p><p><a href="${link}">${link}</a></p><p>Link berlaku 24 jam.</p>`,
  })
}

export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const link = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`
  await resend.emails.send({
    from,
    to: email,
    subject: 'Reset password Invizoku',
    html: `<p>Hai ${name},</p><p>Klik link berikut untuk reset password:</p><p><a href="${link}">${link}</a></p><p>Link berlaku 1 jam. Abaikan jika kamu tidak meminta ini.</p>`,
  })
}
