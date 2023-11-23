import { NextRequest, NextResponse } from "next/server";
import { UserController } from "@/controllers/UserController";

export async function PATCH(request: NextRequest) {
  try {
    const response = await UserController.updateUserAddress(request);

    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
