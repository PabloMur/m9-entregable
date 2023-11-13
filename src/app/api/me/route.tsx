import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ ok: "ok" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
