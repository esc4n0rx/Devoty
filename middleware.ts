import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const protectedPaths = ['/app', '/dashboard', '/profile']
  const isProtectedPath = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!)
    } catch (error) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('auth-token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/dashboard/:path*', '/profile/:path*']
}