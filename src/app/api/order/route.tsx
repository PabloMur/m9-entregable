//Este endpoint es el que debe crear una order y recibe el id del producto
//Usa el metodo post
import { OrderController } from "@/controllers/OrderController";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    const response = await OrderController.createOrder(request);
    return NextResponse.json({ response });
  } catch (error) {
    console.error(error);
  }
}
export {};
