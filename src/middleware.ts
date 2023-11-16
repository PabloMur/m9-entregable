import { NextRequest, NextResponse } from "next/server";

const excludedUrls = ["/", "/api/auth", "/api/auth/token"];
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const authorization = request.headers.get("Authorization"); //ya nos estamos trayendo el token

  if (excludedUrls.includes(url)) {
    return NextResponse.next();
  } else if (!excludedUrls.includes(url)) {
    const token = "hola soy el token";
    console.log(authorization);
    console.log(token);
  } else {
    return NextResponse.json({
      message: "El email es necesario",
    });
  }
}
