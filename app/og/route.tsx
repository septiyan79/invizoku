import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Undangan Digital Tanpa Ribet'
  const sub = searchParams.get('sub') ?? 'invizoku.com'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FDF8F2',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 48 }}>
          <span style={{ fontSize: 52, fontWeight: 400, color: '#2D4080', letterSpacing: '-1px' }}>
            inviz
          </span>
          <span style={{ fontSize: 52, fontWeight: 400, color: '#4A5FA8', letterSpacing: '-1px' }}>
            oku
          </span>
          <span style={{ fontSize: 56, fontWeight: 700, color: '#C9A55A' }}>.</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 600,
            color: '#2C1A0E',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 940,
          }}
        >
          {title}
        </div>

        {/* Sub */}
        <div style={{ fontSize: 28, color: '#8B6845', marginTop: 32 }}>{sub}</div>

        {/* Decorative bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            background: 'linear-gradient(to right, #4A5FA8, #C9A55A)',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
