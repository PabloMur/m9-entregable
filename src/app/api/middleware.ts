import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

//Este lo vamos a usar para comprobar que los request tengan un token correcto y que ademas se protejan ciertas rutas

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/about/:path*",
};
