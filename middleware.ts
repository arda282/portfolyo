import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Auth sayfalarına erişim kontrolü
  if (pathname.startsWith('/auth/') && token) {
    // Kullanıcı giriş yapmışsa ve auth sayfalarına erişmeye çalışıyorsa
    // kendi profiline yönlendir
    return NextResponse.redirect(new URL(`/${token.username}`, request.url))
  }

  return NextResponse.next()
}

// Middleware'in sadece auth sayfalarında çalışması için
export const config = {
  matcher: ['/auth/:path*']
} 