import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Your middleware logic goes here
  return NextResponse.next();
}

// Optional: Configure paths for the middleware to run on
// export const config = {
//   matcher: ['/api/:path*', '/dashboard/:path*'],
// };
