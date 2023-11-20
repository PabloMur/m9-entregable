import { NextRequest, NextResponse } from "next/server";
import { decodeToken, isValidToken } from "./tools/authTools";

const excludedUrls = ["/", "/api/auth", "/api/auth/token", "/api/syncBases"];
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;
  const authorization = request.headers.get("Authorization"); //ya nos estamos trayendo el token
  const secret = process.env.SECRET as any;

  if (excludedUrls.includes(url)) {
    return NextResponse.next();
  } else if (!excludedUrls.includes(url)) {
    const token = authorization?.split(" ")[1] as any;
    const validToken = isValidToken(token, secret);
    console.log(validToken);

    if (validToken) {
      const decodedToken = decodeToken(token) as any;
      const email = decodedToken?.data.data.email;

      const requestHeaders = new Headers(request.headers);

      requestHeaders.set("user-email", email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } else {
      return NextResponse.json({
        message: "El token no es valido",
      });
    }
  } else {
    return NextResponse.json({
      message: "El token es necesario",
    });
  }
}
