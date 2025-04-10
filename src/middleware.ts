import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from './supabaseClient'

const publicRoutes: string[] = ['/', '/signin', '/signup']

const routesByRole: Record<string, string[]> = {
  client: ['/projects', '/projects/new-project'],
  pm: ['/projects', '/projects/[projectId]'],
  designer: ['/projects'],
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = req.cookies.get('supabase-auth-token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl.origin))
  }

  // Valida el token y obtiene el usuario desde Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token)

  if (error || !user) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl.origin))
  }

  const role = user.user_metadata.role

  if (!role || !routesByRole[role]) {
    return NextResponse.redirect(new URL('/404', req.nextUrl.origin))
  }

  const allowedRoutes = routesByRole[role]
  if (!allowedRoutes.some((route) => pathname.includes(route))) {
    return NextResponse.redirect(new URL('/projects', req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/projects/:path*',
    '/projects/new-project',
    '/projects/[projectId]',
  ],
}
