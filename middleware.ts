import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  console.log(`Processing request for: ${pathname}`);

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)', '/']
};