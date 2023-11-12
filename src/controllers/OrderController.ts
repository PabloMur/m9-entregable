import { MercadoPagoConfig, MerchantOrder, Payment } from "mercadopago";

const token = process.env.MERCADOPAGO_TOKEN as any;
export const testVenta = async () => {
  const client = new MercadoPagoConfig({
    accessToken: token,
  });

  const payment = new Payment(client);
};
