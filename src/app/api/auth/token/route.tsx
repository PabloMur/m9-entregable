import { NextRequest, NextResponse } from "next/server";
import { AuthController } from "@/controllers/AuthController";
//aca se debe recibir un email y un codigo valido
// en caso de que sea correcto el match se debe retornar un token con los datos del momento del user
// en caso de que sea incorrecto se debe rechazar la operacion

export async function POST(request: NextRequest) {
  try {
    const response = await AuthController.generateToken(request);
    return NextResponse.json({
      response,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
