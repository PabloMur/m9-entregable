import { MercadoPagoConfig, MerchantOrder, Payment } from "mercadopago";
import MerchantOrderCreateData from "mercadopago";
import MerchantOrderResponse from "mercadopago";
import { Order } from "@/models/OrderModel";

const token = process.env.MERCADOPAGO_TOKEN as any;

export class OrderController {
  static async createOrder(orderData: any) {
    try {
      const newOrder = await Order.createNewOrder(orderData);
      return { message: "Order created successfully", orderId: newOrder.id };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create order");
    }
  }

  static async getOrder(orderId: string) {
    try {
      const order = await Order.findById(orderId);
      return order.data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get order");
    }
  }

  static async updateOrder(orderId: string, updatedData: any) {
    try {
      const order = await Order.findById(orderId);
      order.data = { ...order.data, ...updatedData };
      await order.pushData();
      return { message: "Order updated successfully" };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update order");
    }
  }

  static async processPayment(orderId: string) {
    try {
      const order = await Order.findById(orderId);

      // Lógica para procesar el pago con MercadoPago
      const client = new MercadoPagoConfig({
        accessToken: token,
      });

      const payment = new Payment(client);

      // Configurar la orden del comerciante
      // const merchantOrder: MerchantOrder = {
      //   config: client,
      //   create: async (data: MerchantOrderCreateData) => {
      //     // Implementa la lógica para crear la orden del comerciante aquí
      //     // Asegúrate de devolver una instancia de MerchantOrderResponse
      //     return new MerchantOrderResponse(/* ... */);
      //   },
      //   get: async (id: string) => {
      //     // Implementa la lógica para obtener la orden del comerciante aquí
      //     return new MerchantOrderResponse(/* ... */);
      //   },
      //   update: async (id: string, data: any) => {
      //     // Implementa la lógica para actualizar la orden del comerciante aquí
      //     // Asegúrate de devolver una instancia de MerchantOrderResponse
      //     return new MerchantOrderResponse(/* ... */);
      //   },
      //   search: async (params: any) => {
      //     // Implementa la lógica para buscar la orden del comerciante aquí
      //     return new MerchantOrderResponse(/* ... */);
      //   },
      // };

      // Realizar el pago
      //const paymentResponse = await payment.createPayment(merchantOrder);

      // Actualizar el estado de la orden en tu sistema
      //order.data.paymentStatus = paymentResponse.status;
      await order.pushData();

      //return { message: "Payment processed successfully", paymentResponse };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to process payment");
    }
  }
}
