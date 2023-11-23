import { CreatePreference } from "@/lib/mercadoPagoConn";
import { notificationsSender } from "@/tools/emailSender";
import { Order } from "@/models/OrderModel";
import { User } from "@/models/UserModel";
import { NextRequest, NextResponse } from "next/server";

// {
//   "id": "",
//   "category_id": "car_electronics",
//   "currency_id": "ARS",
//   "description": "Dummy description",
//   "picture_url": "https://http2.mlstatic.com/D_NQ_NP_664821-MCO72985288227_112023-F.jpg",
//   "title": "Destornillador",
//   "quantity": 1,
//   "unit_price": 100
// }

export class OrderController {
  static async getUserOrders(userId: string) {
    try {
      const userOrders = await Order.getUserOrders(userId);
      return userOrders;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  static async createOrder(request: NextRequest) {
    try {
      const { orderData } = await request.json();
      const url = new URL(request.url);
      const productId = url.searchParams.get("productId") as string;
      const newOrder = await Order.createNewOrder(orderData, productId);
      const newPreference = await CreatePreference(
        orderData.Items,
        newOrder.id
      );
      return {
        message: "Order created successfully",
        orderId: newOrder.id,
        preferenceResponse: newPreference,
      };
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

  static async updateOrder(orderId: string) {
    try {
      await Order.updateOrderStatus(orderId);
      return { message: "Order updated successfully" };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update order");
    }
  }

  static async sendNotifications(data: any) {
    try {
      //aca debe tambien actualizar el status de la order a 'paid'
      const orderId = data.external_reference;

      const orderData = await this.getOrder(orderId);
      const userData = await User.findByUserId(orderData.userID);
      const userEmail = userData.data.email;
      const adminEmail = process.env.ADMIN_EMAIL;
      const orderTitle = orderData.Items[0].title;

      await this.updateOrder(orderId);

      const UserMessage = {
        to: userEmail,
        from: "votechoice.notifications@gmail.com",
        subject: "Confirmacion de pago",
        html: `
              <h3>Hemos recibido correctamente el pago</h3>
          `,
      };

      const AdminMessage = {
        to: adminEmail,
        from: "votechoice.notifications@gmail.com",
        subject: "Confirmacion de pago",
        html: `
              <h3>El pago del producto ${orderTitle}, se ha recibido correctamente</h3>
          `,
      };

      await notificationsSender(UserMessage);
      await notificationsSender(AdminMessage);

      return "Emails sent";
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
