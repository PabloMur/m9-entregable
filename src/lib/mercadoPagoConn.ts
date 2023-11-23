import MercadoPagoConfig from "mercadopago";
import { Preference, MerchantOrder } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_TOKEN as string,
});

export async function GetMerchantOrder(id: any) {
  const merchantOrder = new MerchantOrder(client);
  const data = await merchantOrder.get({
    merchantOrderId: id,
  });
  return data;
}

export async function CreatePreference(
  items: any = [],
  external_reference: string
) {
  const preference = new Preference(client);
  const createdPreference = await preference.create({
    body: {
      items,
      external_reference,
      notification_url:
        "https://webhook.site/7fb7cbc0-294a-4779-b079-ad808e360e32",
    },
  });
  return createdPreference;
}
