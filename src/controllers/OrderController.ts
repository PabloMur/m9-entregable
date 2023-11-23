import { CreatePreference } from "@/lib/mercadoPagoConn";
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

  static async sendNotifications(data: any) {
    try {
      const orderId = data.external_reference;
      const orderData = await this.getOrder(orderId);
      console.log(orderId, orderData);
      console.log("este ese el email del user: ", orderData.userID);
      const userData = await User.findByUserId(orderData.userID);
      console.log(userData);
      const userEmail = userData.data.email;
      return "Emails sent";
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
