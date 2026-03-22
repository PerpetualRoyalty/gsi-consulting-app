import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/api/webhooks',
];

export default withAuth(
  function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;

    // Check if path is for dashboard or admin
    const isDashboardPath = pathname.startsWith('/dashboard');
    const isAdminPath = pathname.startsWith('/admin');

    // If trying to access admin path and not admin
    if (isAdminPath && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Public paths don't need authorization
        if (publicPaths.some((path) => pathname.startsWith(path))) {
          return true;
        }

        // Dashboard and admin paths require authentication
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
