import { NextResponse, NextRequest } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.json({
    welcome: "APX - MODULO 9 - made by PABLO MURILLO ",
  });
}
