import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://invizoku.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/katalog', '/harga'],
        disallow: ['/dashboard', '/admin', '/checkout', '/profil', '/undangan', '/api'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
