import { NextRequest, NextResponse } from "next/server";
import { decodeToken, isValidToken } from "./tools/authTools";

const excludedUrls = ["/", "/api/auth", "/api/auth/token", "/api/syncBases"];
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  if (excludedUrls.includes(url)) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("Authorization"); // Extract the token
  if (!authorization) {
    return NextResponse.json({ message: "El token es necesario" });
  }

  const token = authorization.split(" ")[1];
  if (!isValidToken(token, process.env.SECRET as any)) {
    return NextResponse.json({ message: "El token no es valido" });
  }

  const decodedToken = decodeToken(token) as any;
  const email = decodedToken.data.data.email;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("user-email", email);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

//urls que si necesitan de un token
export const config = {
  matcher: ["/api/:me*"],
};
