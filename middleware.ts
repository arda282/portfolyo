import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

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

  return NextResponse.next()
}

// Middleware'in çalışacağı yollar
export const config = {
  matcher: ['/', '/auth/:path*']
} 