import { NextResponse, NextRequest } from "next/server";
import { UserController } from "@/controllers/UserController";

export async function GET(request: NextRequest) {
  try {
    const userEmail = request.headers.get("user-email") as any;
    const userData = await UserController.getUser(userEmail);
    return NextResponse.json({ userData: userData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const response = await UserController.updateUser(request);
    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
