import { NextResponse, NextRequest } from "next/server";
import { UserController } from "@/controllers/UserController";
import { decodeToken } from "@/tools/authTools";

export async function GET(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1] as any;
    const userDataToken = decodeToken(token) as any;
    const userEmail = userDataToken.data.data.email;
    const userData = await UserController.getUser(userEmail);
    return NextResponse.json({ userData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
