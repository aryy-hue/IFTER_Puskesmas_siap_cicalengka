import { NextResponse } from 'next/server'

export function middleware(req) {
  const userCookie = req.cookies.get('user')?.value
  const path = req.nextUrl.pathname

  // Jika belum login
  if (!userCookie) {
    // Lindungi admin & dokter
    if (path.startsWith('/admin') || path.startsWith('/dashboarddokter')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  let user
  try {
    user = JSON.parse(decodeURIComponent(userCookie))
  } catch {
    // Cookie rusak → paksa login ulang
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ❌ Dokter masuk admin
  if (path.startsWith('/admin') && user.role !== 'admin' && user.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ❌ Admin masuk dashboard dokter
  if (path.startsWith('/dashboarddokter') && user.role !== 'dokter') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

// ⛔ Jangan pasang middleware ke static & api
export const config = {
  matcher: ['/admin/:path*', '/dashboarddokter/:path*']
}
