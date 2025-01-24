import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Giriş yapmış kullanıcılar için
  if (token) {
    // Giriş yapmış kullanıcı login veya register sayfalarına erişmeye çalışırsa
    if (pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  // Giriş yapmamış kullanıcılar için
  else {
    // Ana sayfaya erişmeye çalışırsa
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Auth sayfalarına erişim kontrolü
  if (pathname.startsWith('/auth/') && token) {
    // Kullanıcı giriş yapmışsa ve auth sayfalarına erişmeye çalışıyorsa
    // kendi profiline yönlendir
    return NextResponse.redirect(new URL(`/${token.username}`, request.url))
  }

  return NextResponse.next()
}

// Middleware'in çalışacağı yollar
export const config = {
  matcher: ['/', '/auth/:path*']
} 