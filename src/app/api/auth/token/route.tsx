import { NextRequest, NextResponse } from "next/server";
//aca se debe recibir un email y un codigo valido
// en caso de que sea correcto el match se debe retornar un token con los datos del momento del user
// en caso de que sea incorrecto se debe rechazar la operacion

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  return NextResponse.json({ email });
}
