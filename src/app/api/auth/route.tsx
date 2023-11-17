//aca se deberia recibir el email del user desde el front para poder enviarle el codigo por email
//Se necesitaria que el controller reciba el body y haga sus gestiones
import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/controllers/AuthController";

export async function POST(request: NextRequest) {
  try {
    const response = await AuthController.sendCode(request);
    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
