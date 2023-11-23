//este entra en accion cuando se confirma el pago creo que es el que usa el webhook
import { NextRequest, NextResponse } from "next/server";
import { GetMerchantOrder } from "@/lib/mercadoPagoConn";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const topic = url.searchParams.get("topic");
  if (topic == "merchant_order") {
    const data = await GetMerchantOrder(id);
    return NextResponse.json({ id, topic, data }, { status: 200 });
  }
  return NextResponse.json({ ok: "ok" }, { status: 200 });
}
