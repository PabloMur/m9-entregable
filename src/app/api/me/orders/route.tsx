import { NextRequest, NextResponse } from "next/server";
import { UserController } from "@/controllers/UserController";
export async function GET(request: NextRequest) {
  try {
    const results = await UserController.getMeOrders(request);
    return NextResponse.json({ response: results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
