//este entra en accion cuando se confirma el pago creo que es el que usa el webhook
//aca se debe enviar un email al user avisando que el pago se concreto
//ademas se debe enviar un email al administrador o responsable de la gestion de las ventas
//se debe hacer alguna operacion correspondiente, por ejemplo disminuir la cantidad de stock del producto, etc...
import { NextRequest, NextResponse } from "next/server";
import { GetMerchantOrder } from "@/lib/mercadoPagoConn";
import { OrderController } from "@/controllers/OrderController";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const topic = url.searchParams.get("topic");
  if (topic == "merchant_order") {
    const data = await GetMerchantOrder(id);
    if (data.order_status == "paid") {
      console.log("avisar que esta pagado");
      const sendNotifications = await OrderController.sendNotifications(data);
      return NextResponse.json(
        { id, topic, data, sendNotifications },
        { status: 200 }
      );
    }
    return NextResponse.json({ id, topic, data }, { status: 200 });
  }
  return NextResponse.json({ ok: "ok" }, { status: 200 });
}
