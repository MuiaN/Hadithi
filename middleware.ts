import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';
 
// Use dynamic import for jose to avoid module issues
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface UserJwtPayload extends JWTPayload {
  sub: string;
  role: 'USER' | 'CREATOR' | 'EDITOR' | 'ADMIN';
  iat: number;
  exp: number; 
}

const AUTH_LOGIN_URL = '/auth/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const roleDashboardMap: Record<string, string> = {
    ADMIN: '/admin',
    EDITOR: '/editor',
    CREATOR: '/creator',
    USER: '/dashboard',
  };

  const isProtectedRoute = Object.values(roleDashboardMap).some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL(AUTH_LOGIN_URL, request.url));
    }

    try {
      // jwtVerify is now imported at the top
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ['HS256'],
      });
      
      const userRole = (payload as UserJwtPayload).role;
      const expectedDashboard = roleDashboardMap[userRole];

      // If the user's role is not in our map or they are on the wrong dashboard
      if (!expectedDashboard || !pathname.startsWith(expectedDashboard)) {
        // Redirect to their correct dashboard, or login if their role is invalid.
        return NextResponse.redirect(new URL(expectedDashboard, request.url));
      }
    } catch (err) {
      console.error('JWT verification error:', err);
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL(AUTH_LOGIN_URL, request.url));
      // Clear the invalid cookie
      response.cookies.delete('auth_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/editor/:path*', '/creator/:path*', '/dashboard/:path*'],
};