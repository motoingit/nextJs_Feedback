import "@/utils/logger-init";
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export { default } from 'next-auth/middleware';

// Matched routes for proxy execution
export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

/**
 * Proxy function that checks authentication state using NextAuth token
 * and handles redirects accordingly.
 * 
 * @param request - Incoming HTTP request.
 * @returns A redirect response or moves to the next handler.
 */
export async function proxy(request: NextRequest) {
  // Retrieve user session token (JWT)
  const token = await getToken({
    req: request,
    //TODO : is this right
    secret: process.env.NEXTAUTH_SECRET
  });
  const url = request.nextUrl;

  // Diagnostic log for every matched route
  console.log(
    `[Proxy] Checking access. Path: "${url.pathname}" | Authenticated: ${token ? "true" : "false"}`
  );

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, verification, or landing page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') ||
      url.pathname === '/'
    )
  ) {
    console.log(
      `[Proxy] Redirecting authenticated user on guest route "${url.pathname}" to "/dashboard"`
    );
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect to sign-in page if unauthenticated user tries to access dashboard
  if (!token && url.pathname.startsWith('/dashboard')) {
    console.log(
      `[Proxy] Redirecting unauthenticated user on private route "${url.pathname}" to "/sign-in"`
    );
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

