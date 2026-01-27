import { NextResponse } from 'next/server'

export function middleware(req) {
  const userCookie = req.cookies.get('user')?.value
  const path = req.nextUrl.pathname

  console.log('🔍 MIDDLEWARE DEBUG:', {
    path,
    userCookie: userCookie ? userCookie.substring(0, 50) + '...' : 'undefined',
    timestamp: new Date().toISOString()
  })

  // Jika belum login
  if (!userCookie) {
    console.log('⚠️  Tidak ada user cookie')
    // Lindungi admin & dokter
    if (path.startsWith('/admin') || path.startsWith('/dokter')) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  }

  let user
  try {
    user = JSON.parse(decodeURIComponent(userCookie))
    console.log('✅ User parsed:', { id: user.id, role: user.role, name: user.name })
  } catch (e) {
    // Cookie rusak → paksa login ulang
    console.log('❌ Cookie rusak, error:', e.message)
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // ❌ Dokter masuk admin
  if (path.startsWith('/admin') && user.role !== 'admin' && user.role !== 'superadmin') {
    console.log('🚫 Dokter coba akses /admin, redirect ke /')
    return NextResponse.redirect(new URL('/', req.url))
  }

  // ❌ Admin masuk dashboard dokter
  if (path.startsWith('/dokter') && user.role !== 'dokter') {
    console.log(`🚫 Non-dokter (role: ${user.role}) coba akses /dokter, redirect ke /`)
    return NextResponse.redirect(new URL('/', req.url))
  }

  console.log('✅ Akses diizinkan untuk', user.role)
  return NextResponse.next()
}

// ⛔ Jangan pasang middleware ke static & api
export const config = {
  matcher: ['/admin/:path*', '/dokter/:path*']
}
