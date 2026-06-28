export async function sendWhatsApp(to: string, message: string): Promise<void> {
  const apiKey = process.env.FONNTE_API_KEY
  if (!apiKey) return

  try {
    await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: apiKey },
      body: new URLSearchParams({ target: to, message }),
    })
  } catch {
    // Notifikasi WA bukan critical path — gagal diam-diam
  }
}
