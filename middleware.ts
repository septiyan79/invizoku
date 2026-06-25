// Deprecated: Next.js 16+ menggunakan proxy.ts. File ini dipertahankan untuk kompatibilitas.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(_request: NextRequest) {
  return NextResponse.next()
}
